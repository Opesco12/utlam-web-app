import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as _ from "lodash";
import { Moneys, TrendUp, ArrowCircleRight2 } from "iconsax-react";
import { Formik } from "formik";
import * as Yup from "yup";

import HeaderText from "../components/HeaderText";
import ContentBox from "../components/ContentBox";
import StyledText from "../components/StyledText";
import { Colors } from "../constants/Colors";
import AppTextField from "../components/AppTextField";
import AppButton from "../components/AppButton";
import LargeLoadingSpinner from "../components/LargeLoadingSpinner";

import { amountFormatter } from "../helperFunctions/amountFormatter";
import { getProducts, getWalletBalance, mutualfundRedemption } from "../api";
import SmallLoadingSpinner from "../components/SmallLoadingSpinner";
import { toast } from "react-toastify";

const PortfolioDetails = () => {
  const navigate = useNavigate();
  const { portfolioName } = useParams();
  const location = useLocation();
  const product = location.state;
  console.log(product);

  const [loading, setLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);

  const findProduct = async () => {
    if (!product) {
      navigate("/portfolio");
    }

    const products = await getProducts();
    const foundProduct = products?.find(
      (p) => _.kebabCase(p.portfolioName) === portfolioName
    );

    if (!foundProduct) {
      navigate("/404", { replace: true });
    }

    setLoading(false);
  };

  useEffect(() => {
    findProduct();
  }, []);

  const validationSchema = Yup.object().shape({
    amount: Yup.number("Amount must be a number")
      .moreThan(
        999,
        `Please enter an amount of at least ${amountFormatter.format(1000)}`
      )
      .label("Amount")
      .required("Please input amount"),
  });

  if (loading) {
    return (
      <div className="h-[100vh] flex items-center justify-center">
        <LargeLoadingSpinner color={Colors.lightPrimary} />
      </div>
    );
  }

  return (
    <div>
      <HeaderText>
        {_.upperCase(_.replace(portfolioName, /-/g, " "))}
      </HeaderText>

      <ContentBox className={"bg-white"}>
        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
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
              Portfolio Balance
            </StyledText>
          </div>
          <StyledText
            color={Colors.primary}
            type="heading"
            variant="semibold"
          >
            {amountFormatter.format(product?.balance)}
          </StyledText>
        </div>
      </ContentBox>
      <ContentBox
        style={{ marginTop: "30px" }}
        className={"bg-white"}
      >
        {!product?.portfolioType && (
          <>
            {" "}
            <div className="flex items-center justify-center">
              <StyledText
                color={Colors.primary}
                variant="semibold"
                type="title"
              >
                Withdraw Funds
              </StyledText>
            </div>
            <div className=" flex gap-[20px] mx-auto my-[20px] justify-center flex-col w-[100%] md:w-[40%]">
              <Formik
                initialValues={{ amount: "" }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  setSubmitting(true);
                  const { amount } = values;
                  console.log(Number(amount) > product?.balance);
                  if (Number(amount) > product?.balance === false) {
                    const data = await mutualfundRedemption(
                      product?.mutualfundAccountNo,
                      amount
                    );
                    if (data) {
                      toast.success(
                        `You have successfully withdrawn ${amountFormatter.format(
                          amount
                        )} from ${_.upperCase(
                          _.replace(portfolioName, /-/g, " ")
                        )}`
                      );
                      navigate("/portfolio", { replace: true });
                    }
                  } else {
                    toast.error(
                      "Your balance is insufficient for this transaction"
                    );
                  }

                  setSubmitting(false);
                }}
              >
                {({ handleSubmit, handleChange, isSubmitting }) => (
                  <>
                    <AppTextField
                      name="amount"
                      label={"Amount"}
                      onChange={handleChange("amount")}
                    />
                    <AppButton onClick={handleSubmit}>
                      {isSubmitting ? (
                        <SmallLoadingSpinner color={Colors.white} />
                      ) : (
                        "Withdraw"
                      )}
                    </AppButton>
                  </>
                )}
              </Formik>
            </div>
          </>
        )}
        {product?.portfolioType && (
          <div className="flex justify-between flex-wrap flex-col md:flex-row">
            {product?.investments?.map((investment, index) => (
              <FixedIncomeIvestmentItem
                key={index}
                investment={investment}
                portfolioName={portfolioName}
              />
            ))}
          </div>
        )}
      </ContentBox>
    </div>
  );
};

export default PortfolioDetails;

const FixedIncomeIvestmentItem = ({ investment, portfolioName }) => {
  const navigate = useNavigate();

  const date = new Date(investment?.maturityDate).toDateString();

  return (
    <div
      onClick={() =>
        navigate(`/portfolio/${portfolioName}/withdraw`, {
          state: { investment: investment, portfolioName: portfolioName },
        })
      }
      className="flex justify-between items-center py-3 px-[0.5%] rounded-lg bg-white hover:bg-border w-[100%] md:w-[48%]"
    >
      <div className="flex gap-2 items-center">
        <TrendUp
          size={30}
          variant="Bold"
          color={Colors.secondary}
        />
        <div>
          <StyledText
            color={Colors.primary}
            variant="semibold"
            type="title"
          >
            {amountFormatter.format(investment?.currentValue)}
          </StyledText>{" "}
          <br />
          <div className="flex flex-row gap-1 items-center">
            <StyledText
              color={Colors.light}
              variant="semibold"
            >
              Maturity Date: {date}
            </StyledText>
          </div>
        </div>
      </div>
      <ArrowCircleRight2
        size={30}
        color={Colors.primary}
        variant="Bold"
      />
    </div>
  );
};
