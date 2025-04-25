import { useState, useEffect } from "react";
import { Calendar, Clock, Moneys, PercentageCircle } from "iconsax-react";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import * as _ from "lodash";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import ContentBox from "../components/ContentBox";
import StyledText from "../components/StyledText";
import AppButton from "../components/AppButton";
import AppTextField from "../components/AppTextField";
import { Colors } from "../constants/Colors";
import SmallLoadingSpinner from "../components/SmallLoadingSpinner";
import LargeLoadingSpinner from "../components/LargeLoadingSpinner";

import { amountFormatter } from "../helperFunctions/amountFormatter";
import { fixedIncomeRedemptionOrder, getProducts } from "../api";
import HeaderText from "../components/HeaderText";

const FixedIncomeWithdrawal = () => {
  const { portfolioName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const investment = location.state.investment;

  const [loading, setLoading] = useState(false);

  const findProduct = async () => {
    setLoading(true);

    if (!investment) {
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

  function calculateTenor(investmentDate, maturityDate) {
    const startDate = new Date(investmentDate);
    const endDate = new Date(maturityDate);

    const timeDifference = endDate - startDate;

    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

    return daysDifference;
  }

  function convertToDateString(date) {
    return new Date(date).toDateString();
  }

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
        {" "}
        {_.upperCase(_.replace(portfolioName, /-/g, " "))}
      </HeaderText>
      <ContentBox>
        <div className="flex items-center flex-col justify-center">
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
            {amountFormatter.format(investment?.currentValue)}
          </StyledText>
        </div>
      </ContentBox>
      <ContentBox style={{ marginTop: "30px" }}>
        <div className="flex items-center justify-center">
          <StyledText
            color={Colors.primary}
            variant="semibold"
            type="title"
          >
            Withdraw Funds
          </StyledText>
        </div>

        <div className=" grid grid-cols-1 gap-[20px] mx-auto my-[20px] md:grid-cols-5 ">
          <div className="col-span-2">
            <div className="flex gap-[5px]">
              <Clock
                size={20}
                color={Colors.primary}
              />
              <StyledText
                color={Colors.primary}
                type="body"
                variant="medium"
              >
                Tenor:{" "}
                {calculateTenor(
                  investment?.valueDate,
                  investment?.maturityDate
                )}{" "}
                Days
              </StyledText>
            </div>
            <br />
            <div className="flex gap-[5px]">
              <PercentageCircle
                size={20}
                color={Colors.primary}
              />
              <StyledText
                color={Colors.primary}
                type="body"
                variant="medium"
              >
                Interest Rate: {investment?.interestRate}%
              </StyledText>
            </div>{" "}
            <br />
            <div className="flex gap-[5px]">
              <Calendar
                size={20}
                color={Colors.primary}
              />
              <StyledText
                color={Colors.primary}
                type="body"
                variant="medium"
              >
                Maturity Date: {convertToDateString(investment?.maturityDate)}
              </StyledText>
            </div>
          </div>
          <div className="col-span-3">
            <Formik
              initialValues={{ amount: "" }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);
                const { amount } = values;

                if (Number(amount) > investment?.currentValue === false) {
                  const data = await fixedIncomeRedemptionOrder(
                    investment?.referenceNo,
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
                <div className="flex flex-col flex-1 gap-[20px]">
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
                </div>
              )}
            </Formik>
          </div>
        </div>
      </ContentBox>
    </div>
  );
};

export default FixedIncomeWithdrawal;
