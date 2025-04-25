import React, { useState, useEffect } from "react";
import { Calendar, Judge, Moneys, PercentageCircle } from "iconsax-react";
import { Button, Modal, Box, Switch } from "@mui/material";
import { Formik } from "formik";
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
import AppSelect from "../components/AppSelect";
import SmallLoadingSpinner from "../components/SmallLoadingSpinner";

const Details = ({ text, detail, icon }) => {
  return (
    <div className="w-1/2 flex flex-col items-center">
      <div className="flex gap-3 items-center ">
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
};

const ProductDetails = () => {
  const [userBalance, setUserBalance] = useState(0);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [processingInvesment, setProcessingInvestment] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState(0);
  const [investmentBalance, setInvestmentBalance] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [isLiabiltyProduct, setIsLiabilityProduct] = useState(false);
  const [liabiltyProducts, setLiabilityProducts] = useState([]);
  const [productTenors, setProductTenors] = useState([]);
  const [selectedTenor, setSelectedTenor] = useState("");

  const navigate = useNavigate();
  const { productId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true);
      const products = await getProducts();
      products && setProducts(products);

      const pId = Number(productId);
      const foundProduct = products?.find((p) => p.portfolioId === pId);
      if (!foundProduct) {
        navigate("/404", { replace: true });
      }
      setProduct(foundProduct);

      const userBalance = await getWalletBalance();
      setUserBalance(userBalance && userBalance[0]?.amount);

      if (foundProduct?.portfolioType === 9) {
        const investmentbalances = await getFixedIcomeOnlineBalances(productId);
        var balance = 0;
        investmentbalances?.map((investment, index) => {
          balance += investment.currentValue;
        });
        setInvestmentBalance(balance);

        setIsLiabilityProduct(true);
        const liabilityProducts = await getLiabilityProducts(
          foundProduct?.portfolioId
        );
        if (liabilityProducts) {
          setLiabilityProducts(liabilityProducts);
          const tenors = await getTenor(liabilityProducts[0].productId);
          setProductTenors(tenors);
        }
      } else {
        const investment = await getMutualFundOnlineBalance(productId);
        if (investment) setInvestmentBalance(investment.balance);
      }

      setLoading(false);
    };

    fetchData();
  }, [navigate, productId]);

  const handleInvestment = async () => {
    setProcessingInvestment(true);
    if (!investmentAmount) {
      toast.error("Please input amount");
    } else {
      if (isLiabiltyProduct) {
        const data = await fixedIncomeSubscriptionOrder({
          faceValue: investmentAmount,
          currency: "NGN",
          portfolioId: productId,
          securityProductId: liabiltyProducts[0]?.securityProductId,
          tenor: selectedTenor,
        });

        if (data) {
          toast.success(
            `You have successfully invested ${amountFormatter.format(
              investmentAmount
            )} in ${product.portfolioName}`
          );
          navigate("/");
        }
      } else {
        const data = await mutualFundSubscription({
          portfolioId: productId,
          amount: investmentAmount,
        });

        if (data) {
          toast.success(
            `You have successfully invested ${amountFormatter.format(
              investmentAmount
            )} in ${product.portfolioName}`
          );
          navigate("/");
        }
      }
    }
    setProcessingInvestment(false);
  };

  const validationSchema = Yup.object().shape({
    amount: Yup.number("Amount must be a number")
      .label("Amount")
      .required("Please input amount"),
  });

  const tenorOptions = productTenors?.map((tenor, index) => {
    return {
      label: `${tenor.tenor} Days`,
      value: tenor.tenor,
    };
  });

  return (
    <div className="h-full">
      {loading ? (
        <div className="h-screen flex items-center justify-center">
          <LargeLoadingSpinner color={Colors.lightPrimary} />
        </div>
      ) : (
        <>
          <HeaderText>{product.portfolioName}</HeaderText>

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
                {amountFormatter.format(investmentBalance)}
              </StyledText>
            </div>
          </ContentBox>

          <ContentBox className={"mt-[20px] md:mt-[35px]"}>
            <div className="flex justify-between flex-col md:flex-row">
              <div className="flex flex-col gap-5 w-[100%] md:w-[55%] ">
                <div className="flex">
                  <Details
                    icon={
                      <PercentageCircle
                        color={Colors.lightPrimary}
                        variant="Bold"
                        size={25}
                      />
                    }
                    text={"Annualized Yield"}
                    detail={`${product.return}%`}
                  />

                  <Details
                    icon={
                      <Moneys
                        color={Colors.lightPrimary}
                        variant="Bold"
                        size={25}
                      />
                    }
                    text={"Minimum Investment"}
                    detail={amountFormatter.format(product.minimumInvestment)}
                  />
                </div>
                <hr className="border-gray-400" />
                <div className="gap-5 flex">
                  <Details
                    icon={
                      <Calendar
                        color={Colors.lightPrimary}
                        variant="Bold"
                        size={25}
                      />
                    }
                    text={"Minimum Holding Period"}
                    detail={`${product.minimumHoldingPeriod} Days`}
                  />

                  <Details
                    icon={
                      <Judge
                        color={Colors.lightPrimary}
                        variant="Bold"
                        size={25}
                      />
                    }
                    text={"Penalty Rate"}
                    detail={`${product.earlyRedemptionPenaltyRate}%`}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-5 w-[100%] mt-[50px] md:w-[40%] md:mt-[0px]">
                <Formik
                  validationSchema={validationSchema}
                  initialValues={{ amount: "" }}
                  onSubmit={(values) => {
                    const { amount } = values;
                    setInvestmentAmount(amount);

                    if (amount < product?.minimumInvestment) {
                      toast.error(
                        `Minimum investment is ${amountFormatter.format(
                          product.minimumInvestment
                        )}`
                      );
                    } else if (amount > userBalance) {
                      toast.error(
                        "Your wallet balance is insufficient for this transaction"
                      );
                    } else if (isLiabiltyProduct) {
                      if (!selectedTenor) {
                        toast.error("Please select a tenor");
                      } else {
                        setIsModalOpen(true);
                      }
                    } else {
                      setIsModalOpen(true);
                    }
                  }}
                >
                  {({ handleChange, handleSubmit }) => (
                    <>
                      <AppTextField
                        name={"amount"}
                        label={"Amount to invest"}
                        onChange={handleChange("amount")}
                      />

                      {isLiabiltyProduct && (
                        <AppSelect
                          name={"tenor"}
                          options={tenorOptions}
                          onValueChange={(value) => setSelectedTenor(value)}
                          // selectedValue={selectedTenor}
                          // setSelectedValue={setSelectedTenor}
                          label="Tenor"
                        />
                      )}

                      <AppButton onClick={handleSubmit}>Invest</AppButton>
                    </>
                  )}
                </Formik>
              </div>
            </div>
          </ContentBox>
          <AppModal
            title={"Confirm Investment"}
            isOpen={isModalOpen}
            onClose={() => {
              !processingInvesment && setIsModalOpen(false);

              !processingInvesment && setIsChecked(false);
            }}
          >
            <StyledText style={{ marginTop: "20px" }}>
              Redemptions during the Lock-up period will attract a 20% penalty
              on accrued returns earned over the period. <br />
              <StyledText style={{ marginTop: "20px" }}>
                By tapping the "Make Payment" button, you agree to have the
                total due deducted from your wallet balance to create this
                investment plan
              </StyledText>
            </StyledText>

            <div style={{ marginTop: "20px", marginBottom: "20px" }}>
              <Switch
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
              />
              <StyledText>Yes, I agree to the terms above</StyledText>
            </div>

            <Button
              onClick={async () => {
                await handleInvestment();
                setIsModalOpen(false);
              }}
              variant="contained"
              style={{ backgroundColor: Colors.primary, height: "50px" }}
              className="w-full"
              disabled={isChecked === false ? true : false}
            >
              <StyledText variant="semibold">
                {processingInvesment ? (
                  <SmallLoadingSpinner color={Colors.white} />
                ) : (
                  "Make Payment"
                )}
              </StyledText>
            </Button>
          </AppModal>
        </>
      )}
    </div>
  );
};

export default ProductDetails;
