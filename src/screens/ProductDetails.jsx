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

const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .typeError("Amount must be a number")
    .required("Please input amount")
    .positive("Amount must be positive"),
});

const DetailsItem = ({ text, detail, icon }) => (
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
    <StyledText
      type="subheading"
      variant="medium"
      color={Colors.text}
    >
      {detail}
    </StyledText>
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

  const handleInvestment = async () => {
    if (!state.investmentAmount) {
      toast.error("Please input amount");
      return;
    }

    setState((prev) => ({ ...prev, processingInvestment: true }));
    try {
      let data;
      if (state.isLiabilityProduct) {
        data = await fixedIncomeSubscriptionOrder({
          faceValue: state.investmentAmount,
          currency: "NGN",
          portfolioId: portfolioId,
          securityProductId: state.liabilityProducts[0]?.securityProductId,
          tenor: state.productTenors.find(
            (t) => t.tenor === Number(state.selectedTenor)
          )?.tenor,
        });
      } else {
        data = await mutualFundSubscription({
          portfolioId: portfolioId,
          amount: state.investmentAmount,
        });
      }

      if (data) {
        toast.success(
          `Successfully invested ${amountFormatter.format(
            state.investmentAmount
          )} in ${state.product?.portfolioName}`
        );
        navigate("/");
      }
    } catch (error) {
      toast.error("Investment failed");
    } finally {
      setState((prev) => ({
        ...prev,
        processingInvestment: false,
        isModalOpen: false,
      }));
    }
  };

  const tenorOptions = state.productTenors.map((tenor) => ({
    label: `${tenor.tenor} Days`,
    value: tenor.tenor,
  }));

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
                detail={amountFormatter.format(state.product.minimumInvestment)}
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
              />
              <DetailsItem
                icon={
                  <Judge
                    color={Colors.lightPrimary}
                    variant="Bold"
                    size={25}
                  />
                }
                text="Penalty Rate"
                detail={`${state.product.earlyRedemptionPenaltyRate}%`}
              />
            </div>
          </div>
          <div className="flex flex-col gap-5 w-[100%] mt-[50px] md:w-[40%] md:mt-[0px]">
            <InvestmentForm
              product={state.product}
              userBalance={state.userBalance}
              isLiabilityProduct={state.isLiabilityProduct}
              tenorOptions={tenorOptions}
              onSubmit={(amount, tenor) => {
                // setState((prev) => ({
                //   ...prev,
                //   investmentAmount: amount,
                //   selectedTenor: tenor,
                //   isModalOpen: true,
                // }));
                navigate("/invest/investment_simulator", {
                  state: { principal: amount, portfolioId: portfolioId },
                });
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
        <StyledText style={{ marginTop: "20px" }}>
          Redemptions during the Lock-up period will attract a 20% penalty on
          accrued returns earned over the period. <br />
          <StyledText style={{ marginTop: "20px" }}>
            By tapping the "Make Payment" button, you agree to have the total
            due deducted from your wallet balance to create this investment plan
          </StyledText>
        </StyledText>
        <div style={{ marginTop: "20px", marginBottom: "20px" }}>
          <Switch
            checked={state.isChecked}
            onChange={() =>
              setState((prev) => ({ ...prev, isChecked: !prev.isChecked }))
            }
          />
          <StyledText>Yes, I agree to the terms above</StyledText>
        </div>
        <Button
          onClick={handleInvestment}
          variant="contained"
          style={{ backgroundColor: Colors.primary, height: "50px" }}
          className="w-full"
          disabled={!state.isChecked || state.processingInvestment}
        >
          <StyledText variant="semibold">
            {state.processingInvestment ? (
              <SmallLoadingSpinner color={Colors.white} />
            ) : (
              "Make Payment"
            )}
          </StyledText>
        </Button>
      </AppModal>
    </div>
  );
};

export default ProductDetails;
