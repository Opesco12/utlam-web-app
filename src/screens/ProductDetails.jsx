import React, { useState, useEffect, useCallback } from "react";
import { Calendar, Judge, Moneys, PercentageCircle } from "iconsax-react";
import { Button, Switch } from "@mui/material";
import { Formik, Form } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import * as Yup from "yup";

import HeaderText from "../components/HeaderText";
import { Colors } from "../constants/Colors";
import StyledText from "../components/StyledText";
import ContentBox from "../components/ContentBox";
import AppTextField from "../components/AppTextField";
import AppButton from "../components/AppButton";
import LargeLoadingSpinner from "../components/LargeLoadingSpinner";
import AppModal from "../components/AppModal";
import AppSelect from "../components/AppSelect";
import SmallLoadingSpinner from "../components/SmallLoadingSpinner";
import {
  getProducts,
  mutualFundSubscription,
  getMutualFundOnlineBalance,
  getFixedIcomeOnlineBalances,
  getLiabilityProducts,
  getTenor,
  getWalletBalance,
  fixedIncomeSubscriptionOrder,
} from "../api";
import { amountFormatter } from "../helperFunctions/amountFormatter";
import Tooltip from "../components/Tooltip";

const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .typeError("Amount must be a number")
    .required("Please input amount")
    .positive("Amount must be positive"),
});

const DetailsItem = ({ text, detail, icon, tooltipContent }) => (
  <div className="w-1/2 flex flex-col items-center">
    <div className="flex gap-3 items-center">
      {icon}
      <StyledText
        type="label"
        color={Colors.lightPrimary}
      >
        {text}
      </StyledText>
    </div>
    <div className="flex items-center space-x-4">
      <StyledText
        type="subheading"
        variant="medium"
        color={Colors.text}
        style={{ marginRight: "5px" }}
      >
        {detail}
      </StyledText>
      <Tooltip
        position="top"
        content={tooltipContent}
      />
    </div>
  </div>
);

const InvestmentBalance = ({ balance }) => (
  <ContentBox>
    <div className="flex flex-col items-center justify-center">
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
          Investment Balance
        </StyledText>
      </div>
      <StyledText
        color={Colors.primary}
        type="heading"
        variant="semibold"
      >
        {amountFormatter.format(balance)}
      </StyledText>
    </div>
  </ContentBox>
);

const InvestmentForm = ({
  product,
  userBalance,
  isLiabilityProduct,
  tenorOptions,
  onSubmit,
}) => {
  const [selectedTenor, setSelectedTenor] = useState("");

  return (
    <Formik
      initialValues={{ amount: "" }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        const amount = Number(values.amount);
        if (amount < product.minimumInvestment) {
          toast.error(
            `Minimum investment is ${amountFormatter.format(
              product.minimumInvestment
            )}`
          );
          return;
        }
        if (amount > userBalance) {
          toast.error("Insufficient wallet balance");
          return;
        }
        if (isLiabilityProduct && !selectedTenor) {
          toast.error("Please select a tenor");
          return;
        }
        onSubmit(amount, selectedTenor);
      }}
    >
      {({ handleChange }) => (
        <Form className="flex flex-col gap-5">
          <AppTextField
            name="amount"
            label="Amount to invest"
            onChange={handleChange("amount")}
          />
          {isLiabilityProduct && (
            <AppSelect
              name="tenor"
              options={tenorOptions}
              onValueChange={(value) => setSelectedTenor(value)}
              label="Tenor"
            />
          )}
          <AppButton type="submit">Invest</AppButton>
        </Form>
      )}
    </Formik>
  );
};

const ProductDetails = () => {
  const [state, setState] = useState({
    userBalance: 0,
    products: [],
    product: null,
    investmentBalance: 0,
    isLiabilityProduct: false,
    liabilityProducts: [],
    productTenors: [],
    loading: true,
    processingInvestment: false,
    isModalOpen: false,
    investmentAmount: 0,
    isChecked: false,
  });

  const navigate = useNavigate();
  const { portfolioId } = useParams();

  const fetchData = useCallback(async () => {
    try {
      const products = await getProducts();
      if (!products) throw new Error("Failed to fetch products");

      const pId = Number(portfolioId);
      const foundProduct = products.find((p) => p.portfolioId === pId);
      if (!foundProduct) {
        navigate("/404", { replace: true });
        return;
      }

      const userBalance = await getWalletBalance();
      let investmentBalance = 0;
      let liabilityProducts = [];
      let productTenors = [];

      if (foundProduct.portfolioType === 9) {
        const balances = await getFixedIcomeOnlineBalances(portfolioId);
        investmentBalance =
          balances?.reduce((sum, inv) => sum + inv.currentValue, 0) || 0;
        liabilityProducts = await getLiabilityProducts(
          foundProduct.portfolioId
        );
        if (liabilityProducts?.length) {
          productTenors = await getTenor(liabilityProducts[0].productId);
        }
      } else {
        const investment = await getMutualFundOnlineBalance(portfolioId);
        investmentBalance = investment?.balance || 0;
      }

      setState((prev) => ({
        ...prev,
        products,
        product: foundProduct,
        userBalance: userBalance?.[0]?.amount || 0,
        investmentBalance,
        isLiabilityProduct: foundProduct.portfolioType === 9,
        liabilityProducts,
        productTenors,
        loading: false,
      }));
    } catch (error) {
      toast.error("Failed to load product details");
      navigate("/404", { replace: true });
    }
  }, [navigate, portfolioId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const tenorOptions = state.productTenors.map((tenor) => ({
    label: `${tenor.tenor} Days`,
    value: tenor.tenor,
  }));

  const handleInvestment = async (amount, portfolioId) => {
    console.log(amount, portfolioId);
    setState((prev) => ({ ...prev, processingInvestment: true }));

    const response = await mutualFundSubscription({
      amount: amount,
      portfolioId: portfolioId,
    });

    if (response) {
      toast.success("Invesment Successful");
      setState((prev) => ({
        ...prev,
        processingInvestment: false,
        isModalOpen: false,
        investmentAmount: 0,
      }));
      navigate("/");
    }

    setState((prev) => ({
      ...prev,
      processingInvestment: false,
      isModalOpen: false,
    }));
  };

  if (state.loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LargeLoadingSpinner color={Colors.lightPrimary} />
      </div>
    );
  }

  if (!state.product) {
    navigate("/404", { replace: true });
  }

  return (
    <div className="h-full">
      <HeaderText>{state.product.portfolioName}</HeaderText>
      <InvestmentBalance balance={state.investmentBalance} />
      <ContentBox className="mt-[20px] md:mt-[35px]">
        <div className="flex justify-between flex-col md:flex-row">
          <div className="flex flex-col gap-5 w-[100%] md:w-[55%]">
            {!state.isLiabilityProduct ? (
              <>
                <div className="flex">
                  <DetailsItem
                    icon={
                      <PercentageCircle
                        color={Colors.lightPrimary}
                        variant="Bold"
                        size={25}
                      />
                    }
                    text="Annualized Yield"
                    detail={`${state.product.return}%`}
                    tooltipContent={
                      "The annual rate of return on an investment, expressed as a percentage"
                    }
                  />
                  <DetailsItem
                    icon={
                      <Moneys
                        color={Colors.lightPrimary}
                        variant="Bold"
                        size={25}
                      />
                    }
                    text="Minimum Investment"
                    detail={amountFormatter.format(
                      state.product.minimumInvestment
                    )}
                    tooltipContent={
                      "The smallest amount of money required to start investing"
                    }
                  />
                </div>
                <hr className="border-gray-300" />
                <div className="gap-5 flex">
                  <DetailsItem
                    icon={
                      <Calendar
                        color={Colors.lightPrimary}
                        variant="Bold"
                        size={25}
                      />
                    }
                    text="Minimum Holding Period"
                    detail={`${state.product.minimumHoldingPeriod} Days`}
                    tooltipContent={
                      "The shortest duration you must hold an investment before liquidation"
                    }
                  />
                  <DetailsItem
                    icon={
                      <Judge
                        color={Colors.lightPrimary}
                        variant="Bold"
                        size={25}
                      />
                    }
                    text="Penalty Fee"
                    detail={`${state.product.earlyRedemptionPenaltyRate}%`}
                    tooltipContent={
                      "A charge incurred for early withdrawal/pre-liquidation"
                    }
                  />
                </div>
              </>
            ) : (
              <>
                <div className="gap-5 flex items-center justify-center">
                  <DetailsItem
                    icon={
                      <Moneys
                        color={Colors.lightPrimary}
                        variant="Bold"
                        size={25}
                      />
                    }
                    text="Minimum Investment"
                    detail={amountFormatter.format(
                      state.product.minimumInvestment
                    )}
                    tooltipContent={
                      "The smallest amount of money required to start investing"
                    }
                  />
                </div>

                <hr className="border-gray-300" />
                <div className="gap-5 flex item-center justify-center">
                  <DetailsItem
                    icon={
                      <Judge
                        color={Colors.lightPrimary}
                        variant="Bold"
                        size={25}
                      />
                    }
                    text="Penalty Fee"
                    detail={`${state.product.earlyRedemptionPenaltyRate}%`}
                    tooltipContent={
                      "A charge incurred for early withdrawal/pre-liquidation"
                    }
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col gap-5 w-[100%] mt-[50px] md:w-[40%] md:mt-[0px]">
            <InvestmentForm
              product={state.product}
              userBalance={state.userBalance}
              isLiabilityProduct={state.isLiabilityProduct}
              tenorOptions={tenorOptions}
              onSubmit={(amount, tenor) => {
                setState((prev) => ({
                  ...prev,
                  investmentAmount: amount,
                  selectedTenor: tenor,
                  isModalOpen: state.isLiabilityProduct ? false : true,
                  // processingInvestment: true,
                }));
                if (state?.isLiabilityProduct === true) {
                  navigate("/invest/investment_simulator", {
                    state: { principal: amount, portfolioId: portfolioId },
                  });
                }
              }}
            />
          </div>
        </div>
      </ContentBox>

      <AppModal
        title="Confirm Investment"
        isOpen={state.isModalOpen}
        onClose={() =>
          !state.processingInvestment &&
          setState((prev) => ({
            ...prev,
            isModalOpen: false,
            isChecked: false,
          }))
        }
      >
        <p>
          By tapping the "Make Payment" button, you agree to have the total due
          deducted from your wallet balance to create this investment plan
        </p>

        <div style={{ marginTop: "20px", marginBottom: "20px" }}>
          <Switch
            checked={state.isChecked}
            onChange={() =>
              setState((prev) => ({
                ...prev,
                isChecked: !prev.isChecked,
              }))
            }
          />
          <p>Yes, I agree to the terms above</p>
        </div>
        <button
          onClick={() =>
            handleInvestment(
              Number(state.investmentAmount),
              Number(state.product?.portfolioId)
            )
          }
          className="w-full mt-5 border border-gray-300 rounded-md px-3 py-2 hover:bg-light-primary focus:outline-none focus:ring-2 focus:ring-primary text-white bg-primary"
          disabled={!state.isChecked || state.processingInvestment}
        >
          <div className="font-semibold">
            {state.processingInvestment ? (
              <SmallLoadingSpinner color={Colors.white} />
            ) : (
              "Make Payment"
            )}
          </div>
        </button>
      </AppModal>
    </div>
  );
};

export default ProductDetails;
