import React, { useEffect, useState } from "react";
import {
  Bank,
  Briefcase,
  EmptyWallet,
  Flash,
  ReceiveSquare2,
  TransmitSqaure2,
  Eye,
  EyeSlash,
} from "iconsax-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import StyledText from "../components/StyledText";
import { Colors } from "../constants/Colors";
import AppRippleButton from "../components/AppRippleButton";
import HeaderText from "../components/HeaderText";
import ContentBox from "../components/ContentBox";
import LargeLoadingSpinner from "../components/LargeLoadingSpinner";
import AppModal from "../components/AppModal";
import QuickAccessItems from "../components/QuickAccess";
import VirtualAccountItem from "../components/VirtualAccountItem";
import BalanceCard from "../components/BalanceCard";

import {
  getVirtualAccounts,
  getWalletBalance,
  getProducts,
  getMutualFundOnlineBalances,
  getFixedIcomeOnlineBalances,
} from "../api";
import { amountFormatter } from "../helperFunctions/amountFormatter";
import { userStorage } from "../storage/userStorage";
import { keys } from "../storage/kyes";

const HomeScreen = () => {
  const [loading, setLoading] = useState(true);
  const [userBalance, setUserBalance] = useState(0);
  const [name, setName] = useState(null);
  const [hideBalance, setHideBalance] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [virtualAccounts, setVirtualAccounts] = useState([]);
  const [copied, setCopied] = useState(false);
  const [portfolioData, setPortfolioData] = useState({
    mutualFundBalances: [],
    fixedIncomePortfolio: [],
    portfolioBalance: 0,
  });

  const navigate = useNavigate();

  const toggleHideBalance = () => setHideBalance((prev) => !prev);

  const toggleDepositModal = (state) => {
    setIsDepositModalOpen(state);
    if (!state) setCopied(false);
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Fetch user data and wallet balance
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      try {
        // Get virtual accounts
        const accounts = await getVirtualAccounts();
        if (accounts) setVirtualAccounts(accounts);

        // Get user data
        const userData = userStorage.getItem(keys.user);
        setName(userData?.fullName);

        // Get wallet balance
        const data = await getWalletBalance();
        if (data) {
          setUserBalance(data[0]?.amount);
        } else {
          toast.error("Unable to fetch wallet balance");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("An error occurred while fetching your data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Fetch portfolio data
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        // Get mutual fund balances
        const mutualFundBalances = await getMutualFundOnlineBalances();

        // Get investible products
        const investibleProducts = await getProducts();

        if (investibleProducts) {
          // Process fixed income portfolios
          const fixedIncomePortfolios = await Promise.all(
            investibleProducts
              .filter((product) => product.portfolioType === 9)
              .map(async (product) => {
                const fixedIncomeBalances = await getFixedIcomeOnlineBalances(
                  product?.portfolioId
                );

                if (fixedIncomeBalances?.length > 0) {
                  return {
                    portfolio: product.portfolioName,
                    investments: fixedIncomeBalances,
                    portfolioType: product.portfolioType,
                    portfolioId: product.portfolioId,
                  };
                }
                return null;
              })
          );

          // Update portfolio data
          setPortfolioData((prev) => ({
            ...prev,
            mutualFundBalances: mutualFundBalances || [],
            fixedIncomePortfolio: fixedIncomePortfolios.filter(
              (item) => item !== null
            ),
          }));
        }
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
        toast.error("An error occurred while fetching portfolio data");
      }
    };

    fetchPortfolioData();
  }, []);

  // Calculate portfolio balance
  useEffect(() => {
    const { mutualFundBalances, fixedIncomePortfolio } = portfolioData;

    let totalBalance = 0;

    // Add fixed income values
    fixedIncomePortfolio.forEach((portfolio) => {
      portfolio.investments?.forEach((investment) => {
        totalBalance += investment?.currentValue || 0;
      });
    });

    // Add mutual fund values
    mutualFundBalances?.forEach((investment) => {
      totalBalance += investment?.balance || 0;
    });

    setPortfolioData((prev) => ({
      ...prev,
      portfolioBalance: totalBalance,
    }));
  }, [portfolioData.mutualFundBalances, portfolioData.fixedIncomePortfolio]);

  // Loading state
  if (loading) {
    return (
      <div className="h-[100vh] flex items-center justify-center">
        <LargeLoadingSpinner color={Colors.lightPrimary} />
      </div>
    );
  }

  return (
    <div className="md:px-[20px]">
      <HeaderText>Dashboard</HeaderText>

      <StyledText
        variant="semibold"
        type="title"
        className="mb-4"
        color={Colors.primary}
      >
        Hello, {name || ""}
      </StyledText>

      <div className="flex justify-between flex-wrap flex-col md:flex-col">
        {/* Mobile Balance Display */}
        <ContentBox
          backgroundColor={Colors.primary}
          className="w-full md:px-[30px] md:hidden"
        >
          <div className="flex items-center gap-2">
            <EmptyWallet
              variant="Bold"
              size={20}
              color={Colors.white}
            />
            <StyledText color={Colors.white}>Wallet Balance</StyledText>
          </div>

          <div className="flex items-center justify-between mb-[40px] mt-[15px]">
            <StyledText
              type="subheading"
              variant="semibold"
              color={Colors.white}
            >
              {hideBalance ? "₦*******" : amountFormatter.format(userBalance)}
            </StyledText>
            {hideBalance ? (
              <EyeSlash
                size={25}
                color={Colors.white}
                variant="Bold"
                onClick={toggleHideBalance}
              />
            ) : (
              <Eye
                size={25}
                color={Colors.white}
                variant="Bold"
                onClick={toggleHideBalance}
              />
            )}
          </div>

          <div className="flex flex-row justify-between">
            <div
              className="w-[48%]"
              onClick={() => toggleDepositModal(true)}
            >
              <AppRippleButton backgroundColor={Colors.lightPrimary}>
                <ReceiveSquare2
                  size={25}
                  color={Colors.white}
                  variant="Bold"
                />
                <StyledText variant="medium">Deposit</StyledText>
              </AppRippleButton>
            </div>

            <AppRippleButton
              backgroundColor={Colors.white}
              width="48%"
            >
              <TransmitSqaure2
                size={25}
                color={Colors.primary}
                variant="Bold"
              />
              <StyledText variant="medium">Withdraw</StyledText>
            </AppRippleButton>
          </div>
        </ContentBox>

        {/* Desktop Balance Display */}
        <div className="hidden rounded-xl overflow-hidden md:grid md:grid-cols-2">
          {/* Wallet Balance Card */}
          <BalanceCard
            title="Wallet Balance"
            balance={userBalance}
            hideBalance={hideBalance}
            onToggleHide={toggleHideBalance}
          >
            <div className="flex gap-4 items-center">
              <button
                onClick={() => toggleDepositModal(true)}
                className="border border-white py-2 px-4 rounded-lg text-white flex items-center gap-1 justify-start w-fit hover:bg-white/20 transition-colors"
              >
                <ReceiveSquare2
                  size={25}
                  color={Colors.white}
                  variant="Bold"
                />{" "}
                Deposit
              </button>
              <button className="border border-white py-2 px-4 rounded-lg text-white flex items-center gap-1 justify-start w-fit hover:bg-white/20 transition-colors">
                <TransmitSqaure2
                  size={25}
                  color={Colors.primary}
                  variant="Bold"
                />{" "}
                Withdraw
              </button>
            </div>
          </BalanceCard>

          {/* Portfolio Balance Card */}
          <div className="bg-primary p-5">
            <div className="flex items-center gap-2">
              <EmptyWallet
                variant="Bold"
                size={15}
                color={Colors.white}
              />
              <StyledText
                color={Colors.white}
                type="label"
              >
                Portfolio Balance
              </StyledText>
            </div>

            <div className="flex items-center justify-between mb-[40px] mt-[15px]">
              <StyledText
                type="heading"
                variant="semibold"
                color={Colors.white}
              >
                {hideBalance
                  ? "₦*******"
                  : amountFormatter.format(portfolioData.portfolioBalance)}
              </StyledText>
              {hideBalance ? (
                <EyeSlash
                  size={25}
                  color={Colors.white}
                  variant="Bold"
                  onClick={toggleHideBalance}
                />
              ) : (
                <Eye
                  size={25}
                  color={Colors.white}
                  variant="Bold"
                  onClick={toggleHideBalance}
                />
              )}
            </div>

            <button
              onClick={() => navigate("/portfolio")}
              className="w-full border border-white py-2 px-4 rounded-lg text-white flex items-center gap-1 justify-center hover:bg-white/20 transition-colors"
            >
              <Briefcase
                variant="Bold"
                color={Colors.white}
                size={25}
              />
              View Portfolio
            </button>
          </div>
        </div>

        {/* Quick Access Section */}
        <ContentBox
          backgroundColor={Colors.white}
          style={{ marginTop: "35px" }}
          className="w-full"
        >
          <div className="flex items-center gap-2 mb-7">
            <Flash
              variant="Bold"
              size={25}
              color={Colors.primary}
            />
            <StyledText color={Colors.primary}>Quick Access</StyledText>
          </div>
          <QuickAccessItems navigate={navigate} />
        </ContentBox>
      </div>

      {/* Virtual Accounts Modal */}
      <AppModal
        isOpen={isDepositModalOpen}
        onClose={() => toggleDepositModal(false)}
        title="Virtual Accounts"
      >
        <div>
          <Bank
            size={50}
            color={Colors.primary}
            className="mx-auto mt-[20px] mb-[35px]"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px]">
            {virtualAccounts?.length > 0 &&
              virtualAccounts.map((account, index) => (
                <VirtualAccountItem
                  key={index}
                  account={account}
                  copied={copied}
                  onCopy={handleCopy}
                />
              ))}
          </div>
        </div>
      </AppModal>
    </div>
  );
};

export default HomeScreen;
