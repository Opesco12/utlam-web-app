import React, { useEffect, useState, useRef } from "react";
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
import { Field, Formik, Form } from "formik";
import * as Yup from "yup";

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
import SmallLoadingSpinner from "../components/SmallLoadingSpinner";

import {
  getVirtualAccounts,
  getWalletBalance,
  getProducts,
  getMutualFundOnlineBalances,
  getFixedIcomeOnlineBalances,
  getClientBankAccounts,
  debitWallet,
} from "../api";
import { amountFormatter } from "../helperFunctions/amountFormatter";
import { userStorage } from "../storage/userStorage";
import { keys } from "../storage/kyes";
import HomeScreenSkeleton from "../components/skeletons/HomeScreenSkeleton";

const HomeScreen = () => {
  const [state, setState] = useState({
    loading: true,
    userBalance: null,
    name: null,
    hideBalance: false,
    isDepositModalOpen: false,
    isWithdrawalModalOpen: false,
    isPinModalOpen: false,
    withdrawalAmount: 0,
    virtualAccounts: [],
    clientBanks: [],
    copied: false,
    pin: ["", "", "", ""],
    isPinSubmitting: false,
    portfolioData: {
      mutualFundBalances: [],
      fixedIncomePortfolio: [],
      portfolioBalance: 0,
    },
  });

  const navigate = useNavigate();
  const pinRefs = useRef([]);

  const toggleHideBalance = () =>
    setState((prev) => ({ ...prev, hideBalance: !prev.hideBalance }));

  const toggleDepositModal = (isOpen) =>
    setState((prev) => ({
      ...prev,
      isDepositModalOpen: isOpen,
      copied: isOpen ? prev.copied : false,
    }));

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setState((prev) => ({ ...prev, copied: true }));
      toast.success("Copied");
      setTimeout(() => setState((prev) => ({ ...prev, copied: false })), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
      toast.error("Failed to copy text");
    }
  };

  const handlePinChange = (index, value) => {
    const newValue = value.replace(/[^0-9]/g, "").slice(0, 1);
    setState((prev) => {
      const newPin = [...prev.pin];
      newPin[index] = newValue;
      return { ...prev, pin: newPin };
    });
    if (newValue && index < 3 && pinRefs.current[index + 1]) {
      pinRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && !e.target.value) {
      pinRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    pinRefs.current = pinRefs.current.slice(0, 4);
    if (pinRefs.current[0] && state.isPinModalOpen) {
      pinRefs.current[0].focus();
    }
  }, [state.isPinModalOpen]);

  const validateWithdrawal = async (amount, setSubmitting) => {
    try {
      if (!state.clientBanks?.length) {
        toast.error("Please add a bank account in the profile page.");
        setSubmitting(false);
        return;
      }

      if (amount <= 0) {
        toast.error("Amount must be greater than zero");
        setSubmitting(false);
        return;
      }

      if (amount > state.userBalance?.amount) {
        toast.error("Insufficient Balance");
        setSubmitting(false);
        return;
      }

      setSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second loading
      setState((prev) => ({
        ...prev,
        withdrawalAmount: amount,
        isWithdrawalModalOpen: false,
        isPinModalOpen: true,
      }));
    } catch (error) {
      console.error("Withdrawal validation failed:", error);
      toast.error("Validation failed. Please try again later.");
      setSubmitting(false);
    }
  };

  const handleWithdrawal = async (amount, pinString, setSubmitting) => {
    try {
      if (!state.clientBanks?.length) {
        toast.error("Please add a bank account in the profile page.");
        setSubmitting(false);
        return;
      }

      if (amount > state.userBalance?.amount) {
        toast.error("Insufficient Balance");
        setSubmitting(false);
        return;
      }

      const requestData = {
        currencyCode: "NGN",
        amount,
        beneficiaryBankAccountNo: state.clientBanks[0]?.beneficiaryAccountNo,
        transactionPin: Number(pinString),
      };

      const response = await debitWallet(requestData);

      if (response) {
        toast.success(
          "Wallet withdrawal is being processed. Kindly note that withdrawals are processed within 24 hours."
        );
        setState((prev) => ({
          ...prev,
          isPinModalOpen: false,
          pin: ["", "", "", ""],
          withdrawalAmount: 0,
        }));
      }
    } catch (error) {
      console.error("Withdrawal failed:", error);
      toast.error("Withdrawal failed. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePinSubmit = async () => {
    setState((prev) => ({ ...prev, isPinSubmitting: true }));
    const pinString = state.pin.join("");

    if (pinString.length !== 4) {
      toast.error("Please enter all 4 digits");
      setState((prev) => ({ ...prev, isPinSubmitting: false }));
      return;
    }

    await handleWithdrawal(state.withdrawalAmount, pinString, (value) =>
      setState((prev) => ({ ...prev, isPinSubmitting: value }))
    );
  };

  const amountValidationSchema = Yup.object().shape({
    amount: Yup.number()
      .typeError("Amount must be a number")
      .positive("Amount must be greater than zero")
      .required("Amount is required")
      .test(
        "maxBalance",
        "Insufficient Balance",
        (value) => value <= (state.userBalance?.amount || 0)
      ),
  });

  useEffect(() => {
    const fetchAllData = async () => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const [
          accounts,
          clientBanks,
          walletBalance,
          mutualFundBalances,
          investibleProducts,
        ] = await Promise.all([
          getVirtualAccounts(),
          getClientBankAccounts(),
          getWalletBalance(),
          getMutualFundOnlineBalances(),
          getProducts(),
        ]);

        const userData = userStorage.getItem(keys.user);

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

        let portfolioBalance = 0;
        validFixedIncomePortfolio.forEach((portfolio) => {
          portfolio.investments?.forEach((investment) => {
            portfolioBalance += investment?.currentValue || 0;
          });
        });
        mutualFundBalances?.forEach((investment) => {
          portfolioBalance += investment?.balance || 0;
        });

        setState((prev) => ({
          ...prev,
          loading: false,
          virtualAccounts: accounts || [],
          clientBanks: clientBanks || [],
          name: userData?.fullName || "",
          userBalance: walletBalance?.[0] || null,
          portfolioData: {
            mutualFundBalances: mutualFundBalances || [],
            fixedIncomePortfolio: validFixedIncomePortfolio,
            portfolioBalance,
          },
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("An error occurred while fetching your data");
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchAllData();
  }, []);

  if (state.loading) {
    return <HomeScreenSkeleton />;
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
        Hello, {state.name || ""}
      </StyledText>

      <div className="flex justify-between flex-wrap flex-col md:flex-col">
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
              {state.hideBalance
                ? "₦*******"
                : amountFormatter.format(state.userBalance?.amount)}
            </StyledText>
            {state.hideBalance ? (
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
              className="w-[48%] cursor-pointer"
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

            <div
              className="w-[48%] cursor-pointer"
              onClick={() =>
                setState((prev) => ({ ...prev, isWithdrawalModalOpen: true }))
              }
            >
              <AppRippleButton backgroundColor={Colors.white}>
                <TransmitSqaure2
                  size={25}
                  color={Colors.primary}
                  variant="Bold"
                />
                <StyledText variant="medium">Withdraw</StyledText>
              </AppRippleButton>
            </div>
          </div>
        </ContentBox>

        <div className="hidden rounded-xl overflow-hidden md:grid md:grid-cols-2">
          <BalanceCard
            title="Wallet Balance"
            balance={state.userBalance?.amount}
            hideBalance={state.hideBalance}
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
              <button
                onClick={() =>
                  setState((prev) => ({ ...prev, isWithdrawalModalOpen: true }))
                }
                className="border border-white py-2 px-4 rounded-lg text-white flex items-center gap-1 justify-start w-fit hover:bg-white/20 transition-colors"
              >
                <TransmitSqaure2
                  size={25}
                  color={Colors.primary}
                  variant="Bold"
                />{" "}
                Withdraw
              </button>
            </div>
          </BalanceCard>

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
                {state.hideBalance
                  ? "₦*******"
                  : amountFormatter.format(
                      state.portfolioData.portfolioBalance
                    )}
              </StyledText>
              {state.hideBalance ? (
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
        isOpen={state.isDepositModalOpen}
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
            {state.virtualAccounts?.length > 0 &&
              state.virtualAccounts.map((account, index) => (
                <VirtualAccountItem
                  key={index}
                  account={account}
                  copied={state.copied}
                  onCopy={handleCopy}
                />
              ))}
          </div>
        </div>
      </AppModal>

      {/* Withdrawal Modal */}
      <AppModal
        isOpen={state.isWithdrawalModalOpen}
        onClose={() =>
          setState((prev) => ({ ...prev, isWithdrawalModalOpen: false }))
        }
        title="Withdraw Funds"
      >
        <div>
          <Formik
            enableReinitialize={true}
            initialValues={{
              amount: 0,
              bankName: state.clientBanks[0]?.bankName,
              accountNo: state.clientBanks[0]?.beneficiaryAccountNo,
            }}
            validationSchema={amountValidationSchema}
            onSubmit={(values, { setSubmitting }) => {
              validateWithdrawal(values.amount, setSubmitting);
            }}
          >
            {({ handleSubmit, isSubmitting, errors, touched }) => (
              <Form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Amount
                  </label>
                  <Field
                    id="amount"
                    name="amount"
                    type="text"
                    inputMode="numeric"
                    className={`w-full p-2 border border-gray-300 rounded-md ${
                      errors.amount && touched.amount ? "border-red-500" : ""
                    }`}
                  />
                  {errors.amount && touched.amount && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.amount}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="bankName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Bank Name
                  </label>
                  <Field
                    id="bankName"
                    name="bankName"
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    disabled
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="accountNo"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Account Number
                  </label>
                  <Field
                    id="accountNo"
                    name="accountNo"
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    disabled
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-lightPrimary transition-colors mt-5"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <SmallLoadingSpinner color={Colors.white} />
                  ) : (
                    "Withdraw"
                  )}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </AppModal>

      {/* PIN Input Modal */}
      <AppModal
        isOpen={state.isPinModalOpen}
        onClose={() =>
          setState((prev) => ({
            ...prev,
            isPinModalOpen: false,
            pin: ["", "", "", ""],
          }))
        }
        title="Enter Transaction PIN"
      >
        <div className="flex flex-col items-center justify-center p-6 max-w-md mx-auto">
          <div className="w-full mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter PIN
            </label>
            <div className="flex justify-center gap-4">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={`pin-${index}`}
                  ref={(el) => (pinRefs.current[index] = el)}
                  type="password"
                  value={state.pin[index]}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 text-center text-2xl border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                  maxLength={1}
                  inputMode="numeric"
                  disabled={state.isPinSubmitting}
                />
              ))}
            </div>
          </div>

          <div className="w-full flex gap-4">
            <button
              disabled={state.isPinSubmitting}
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  isPinModalOpen: false,
                  pin: ["", "", "", ""],
                }))
              }
              className="w-full py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md shadow transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              disabled={state.isPinSubmitting}
              onClick={handlePinSubmit}
              className="w-full py-3 px-4 bg-primary hover:bg-light-primary text-white font-medium rounded-md shadow transition-colors disabled:opacity-50"
            >
              {state.isPinSubmitting ? (
                <SmallLoadingSpinner color={Colors.white} />
              ) : (
                "Confirm PIN"
              )}
            </button>
          </div>
        </div>
      </AppModal>
    </div>
  );
};

export default HomeScreen;
