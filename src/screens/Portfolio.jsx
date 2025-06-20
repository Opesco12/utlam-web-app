import React, { useEffect, useState } from "react";
import { Moneys, Bank } from "iconsax-react";
import { toast } from "sonner";

import { Colors } from "../constants/Colors";
import HeaderText from "../components/HeaderText";
import StyledText from "../components/StyledText";
import ContentBox from "../components/ContentBox";
import LargeLoadingSpinner from "../components/LargeLoadingSpinner";
import PortfolioItem from "../components/PortfolioItem";
import AppModal from "../components/AppModal";
import VirtualAccountItem from "../components/VirtualAccountItem";

import { amountFormatter } from "../helperFunctions/amountFormatter";
import {
  getWalletBalance,
  getFixedIcomeOnlineBalances,
  getProducts,
  getMutualFundOnlineBalances,
  getVirtualAccounts,
} from "../api";

const Portfolio = () => {
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [virtualAccounts, setVirtualAccounts] = useState([]);
  const [portfolioData, setPortfolioData] = useState({
    walletBalance: 0,
    mutualFundBalances: [],
    fixedIncomePortfolio: [],
    totalBalance: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      setLoading(true);
      try {
        const [
          walletBalance,
          mutualFundBalances,
          investibleProducts,
          accounts,
        ] = await Promise.all([
          getWalletBalance(),
          getMutualFundOnlineBalances(),
          getProducts(),
          getVirtualAccounts(),
        ]);

        const fixedIncomePortfolio = await Promise.all(
          investibleProducts
            ?.filter((product) => product.portfolioType === 9)
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
            }) || []
        );

        const validFixedIncomePortfolio = fixedIncomePortfolio.filter(
          (item) => item !== null
        );

        let totalBalance = walletBalance?.[0]?.amount || 0;

        validFixedIncomePortfolio.forEach((portfolio) => {
          portfolio.investments?.forEach((investment) => {
            totalBalance = totalBalance + (investment?.currentValue || 0);
          });
        });

        mutualFundBalances?.forEach((investment) => {
          totalBalance =
            totalBalance +
            investment?.balance +
            (investment?.pendingDividendAmount || 0);
        });

        setPortfolioData({
          walletBalance: walletBalance?.[0]?.amount || 0,
          mutualFundBalances: mutualFundBalances || [],
          fixedIncomePortfolio: validFixedIncomePortfolio,
          totalBalance,
        });

        setVirtualAccounts(accounts);
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied");
      setTimeout(() => setCopied(true), 2000);
    } catch (err) {}
  };

  if (loading) {
    return (
      <div className="h-[100vh] flex items-center justify-center">
        <LargeLoadingSpinner color={Colors.lightPrimary} />
      </div>
    );
  }

  return (
    <div>
      <HeaderText>My Portfolio</HeaderText>
      <ContentBox className="bg-white">
        <div className="flex items-center justify-center flex-col">
          <div className="flex items-center gap-[10px]">
            <Moneys
              variant="Bold"
              size={25}
              color={Colors.primary}
            />
            <StyledText
              color={Colors.primary}
              variant="medium"
              type="subheading"
            >
              Total Portfolio Balance
            </StyledText>
          </div>
          <StyledText
            color={Colors.primary}
            type="heading"
            variant="semibold"
          >
            {amountFormatter.format(portfolioData.totalBalance)}
          </StyledText>
        </div>
      </ContentBox>

      <ContentBox className="mt-[35px] bg-white">
        <div className="grid gap-[15px] md:grid-cols-2 items-start">
          <PortfolioItem
            product={{
              portfolio: "Wallet",
              balance: portfolioData.walletBalance,
            }}
            setIsModalOpen={setIsDepositModalOpen}
          />
          {portfolioData.mutualFundBalances?.map((portfolio, index) => (
            <PortfolioItem
              key={`mutual-${index}`}
              product={portfolio}
            />
          ))}
          {portfolioData.fixedIncomePortfolio?.map((portfolio, index) => (
            <PortfolioItem
              key={`fixed-${index}`}
              product={portfolio}
            />
          ))}
        </div>
      </ContentBox>
      <AppModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
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

export default Portfolio;
