import React, { useEffect, useState } from "react";
import {
  ArrowCircleRight2,
  Bank,
  Copy,
  CopySuccess,
  EmptyWallet,
  FavoriteChart,
  Flash,
  ReceiptText,
  ReceiveSquare2,
  Reserve,
  StatusUp,
  TransmitSqaure2,
} from "iconsax-react";
import { Eye, EyeSlash } from "iconsax-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import StyledText from "../components/StyledText";
import { Colors } from "../constants/Colors";
import AppRippleButton from "../components/AppRippleButton";
import HeaderText from "../components/HeaderText";
import ContentBox from "../components/ContentBox";
import LargeLoadingSpinner from "../components/LargeLoadingSpinner";
import AppModal from "../components/AppModal";

import { getVirtualAccounts, getWalletBalance } from "../api";
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

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const accounts = await getVirtualAccounts();
      accounts && setVirtualAccounts(accounts);

      const userData = userStorage.getItem(keys.user);
      setName(userData.fullName);

      const data = await getWalletBalance();

      if (data) {
        setUserBalance(data[0]?.amount);
      } else {
        toast.error("Unable to fetch data");
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-[100vh] flex items-center justify-center">
        <LargeLoadingSpinner color={Colors.lightPrimary} />
      </div>
    );
  }

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 10000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const SmallContentBox = ({ icon, title, subtitle, navigateTo, navigate }) => {
    return (
      <div
        className="border border-gray-300 flex justify-between items-center rounded-lg p-[15px_10px] hover:bg-border gap-[10px] cursor-pointer"
        onClick={() => navigate(navigateTo)}
      >
        <div className="flex items-center gap-[10px]  md:gap-[15px]">
          {icon}
          <div>
            <StyledText
              type="title"
              variant="semibold"
              color={Colors.primary}
            >
              {title}
            </StyledText>
            <br />
            <StyledText
              type="body"
              color={Colors.light}
            >
              {subtitle}
            </StyledText>
          </div>
        </div>
        <ArrowCircleRight2
          size={35}
          color={Colors.primary}
          variant="Bold"
        />
      </div>
    );
  };

  return (
    <div className="md:px-[20px]">
      <HeaderText>Hello, {name && name}</HeaderText>

      <div className="flex justify-between flex-wrap flex-col md:flex-col">
        <ContentBox
          backgroundColor={Colors.primary}
          className={"w-[100%] md:px-[30px]"}
        >
          <div className="flex items-center gap-2 ">
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
                onClick={() => setHideBalance(!hideBalance)}
              />
            ) : (
              <Eye
                size={25}
                color={Colors.white}
                variant="Bold"
                onClick={() => setHideBalance(!hideBalance)}
              />
            )}
          </div>

          <div className="flex flex-row justify-between">
            <div
              className="w-[48%]"
              onClick={() => {
                setIsDepositModalOpen(true);
                setCopied(false);
              }}
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
              width={"48%"}
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
        <ContentBox
          backgroundColor={Colors.white}
          className={"w-[49%] hidden md:hidden"}
        >
          <div className="flex gap-2 ">
            <ReceiptText
              variant="Bold"
              size={20}
              color={Colors.primary}
            />
            <StyledText color={Colors.primary}>Recent Transactions</StyledText>
          </div>
        </ContentBox>
        <ContentBox
          backgroundColor={Colors.white}
          style={{ marginTop: "35px" }}
          className={"w-[100%]"}
        >
          <div className="flex items-center gap-2 mb-7">
            <Flash
              variant="Bold"
              size={25}
              color={Colors.primary}
            />
            <StyledText color={Colors.primary}>Quick Access</StyledText>
          </div>
          <div className="grid gap-[15px] md:grid-cols-2">
            <SmallContentBox
              icon={
                <StatusUp
                  variant="Bold"
                  size={35}
                  color={Colors.secondary}
                />
              }
              title="Mutual Funds"
              subtitle="Grow your wealth with diverse investment options"
              navigateTo="/invest/mutual_fund"
              navigate={navigate}
            />

            <SmallContentBox
              icon={
                <StatusUp
                  variant="Bold"
                  size={35}
                  color={Colors.secondary}
                />
              }
              title="Fixed Income"
              subtitle="Enjoy stable returns with predictable income."
              navigateTo="/invest/fixed_income"
              navigate={navigate}
            />

            <SmallContentBox
              icon={
                <FavoriteChart
                  variant="Bold"
                  size={35}
                  color={Colors.secondary}
                />
              }
              title="My Portfolio"
              subtitle="Track and manage your investment holdings"
              navigateTo="/portfolio"
              navigate={navigate}
            />

            <SmallContentBox
              icon={
                <ReceiptText
                  variant="Bold"
                  size={35}
                  color={Colors.secondary}
                />
              }
              title="My Transactions"
              subtitle="View your account activity and financial history."
              navigateTo="/transactions"
              navigate={navigate}
            />

            <SmallContentBox
              icon={
                <Reserve
                  variant="Bold"
                  size={35}
                  color={Colors.secondary}
                />
              }
              title="Help Desk"
              subtitle="Get help from excellent customer care service"
              navigateTo="/help"
              navigate={navigate}
            />
          </div>
        </ContentBox>
      </div>
      <AppModal
        isOpen={isDepositModalOpen}
        onClose={() => {
          setIsDepositModalOpen(false);
          setCopied(false);
        }}
        title={"Virtual Accounts"}
      >
        <div className="">
          <Bank
            size={50}
            color={Colors.primary}
            className="mx-auto mt-[20px] mb-[35px]"
          />
          <div className="grid grid-cols-2 gap-[10px]">
            {virtualAccounts?.length > 0 &&
              virtualAccounts?.map((account, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg p-2 hover:bg-border"
                >
                  <div>
                    <h3 className="font-semibold">
                      {`${account?.virtualAccountBankName} (${account?.virtualAccountCurrency})` ||
                        "UTLAM Bank(NGN)"}{" "}
                    </h3>
                    <p>{account?.virtualAccountNo}</p>
                    <h4 className="font-medium">
                      {account?.virtualAccountName}
                    </h4>
                  </div>
                  {copied ? (
                    <CopySuccess
                      size={25}
                      color={Colors.primary}
                    />
                  ) : (
                    <Copy
                      size={25}
                      color={Colors.primary}
                      onClick={() => handleCopy(account?.virtualAccountNo)}
                    />
                  )}
                </div>
              ))}
          </div>
        </div>
      </AppModal>
    </div>
  );
};

export default HomeScreen;
