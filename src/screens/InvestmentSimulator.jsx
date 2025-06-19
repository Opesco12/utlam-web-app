import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { Switch } from "@mui/material";
import { toast } from "sonner";

import HeaderText from "../components/HeaderText";
import ContentBox from "../components/ContentBox";
import AppModal from "../components/AppModal";
import SmallLoadingSpinner from "../components/SmallLoadingSpinner";
import { Colors } from "../constants/Colors";

import { amountFormatter } from "../helperFunctions/amountFormatter";
import {
  getLiabilityProducts,
  getProducts,
  getTenor,
  fixedIncomeSubscriptionOrder,
  getWalletBalance,
} from "../api";

const InvestmentSimulator = () => {
  const [investibleProducts, setInvestibleProducts] = useState([]);
  const [userBalance, setUserBalance] = useState(0);
  const [productOptions, setProductOptions] = useState([]);
  const [tenorOptions, setTenorOptions] = useState([]);
  const [selectedTenorInterestRate, setSelectedTenorInterestRate] =
    useState(null);
  const [state, setState] = useState({
    isModalOpen: false,
    isChecked: false,
    processingInvestment: false,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const data = location?.state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userBalance = await getWalletBalance();
        setUserBalance(userBalance[0]?.amount);

        const data = await getProducts();
        setInvestibleProducts(data);
        setProductOptions(
          data
            ?.filter((item) => item.portfolioType === 9)
            .map((item) => ({
              label: item.portfolioName,
              value: item.portfolioId,
              isLiabilityProduct: true,
              minimumHoldingPeriod: item?.minimumHoldingPeriod,
              return: item?.return,
            }))
        );
      } catch (error) {
        console.error("Error fetching investment products:", error);
      }
    };

    fetchData();
  }, []);

  const getProductTenors = async (portfolioId) => {
    const liabilityProducts = await getLiabilityProducts(portfolioId);
    const productId = liabilityProducts && liabilityProducts[0]?.productId;
    const tenors = await getTenor(productId);
    setTenorOptions(
      tenors.map((tenor) => ({
        label: tenor?.tenor + " days",
        value: tenor?.tenor,
        interest: tenor?.interestRate,
      }))
    );
  };

  const getSelectedTenorInterest = (selectedTenor) => {
    const selected = tenorOptions.find(
      (tenor) => tenor?.value === Number(selectedTenor)
    );
    setSelectedTenorInterestRate(selected?.interest);
    return selected?.interest + "%";
  };

  const addDaysToDate = (days, startDate = new Date()) => {
    const result = new Date(startDate);
    result.setDate(startDate.getDate() + Number(days));
    return result.toDateString();
  };

  const isLiabilityProduct = (portfolioid) => {
    const selectedProduct = productOptions.find(
      (product) => product.value === Number(portfolioid)
    );

    return selectedProduct?.isLiabilityProduct;
  };

  const getSelectedProductName = (portfolioId) => {
    const selectedProduct = productOptions.find(
      (product) => product.value === Number(portfolioId)
    );
    return selectedProduct?.label;
  };

  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .required("Principal is required")
      .min(1, "Principal must be greater than 0")
      .test(
        "max-user-balance",
        "Amount cannot exceed your wallet balance",
        function (value) {
          if (value === undefined || value === null) return false;
          return Number(value) <= userBalance;
        }
      ),
    portfolioId: Yup.string().required("Select a product"),
    tenor: Yup.string().test(
      "tenor-required-if-liability",
      "Select a tenor",
      function (value) {
        const { portfolioId } = this.parent;
        const selectedProduct = productOptions.find(
          (product) => String(product.value) === String(portfolioId)
        );
        if (selectedProduct?.isLiabilityProduct) {
          return !!value;
        }
        return true;
      }
    ),
  });

  const handleLiabilityProductInvestment = async (
    amount,
    portfolioId,
    tenor
  ) => {
    try {
      const liabilityProducts = await getLiabilityProducts(portfolioId);
      const data = await fixedIncomeSubscriptionOrder({
        faceValue: amount,
        currency: "NGN",
        portfolioId: portfolioId,
        securityProductId: liabilityProducts[0]?.securityProductId,
        tenor: tenor,
      });
      if (data) {
        toast.success(
          `Successfully invested ${amountFormatter.format(
            amount
          )} in ${getSelectedProductName(portfolioId)}`
        );
        navigate("/");
      }
    } catch (error) {
      toast.error("An error occured while processing investment");
    } finally {
      setState((prev) => ({
        ...prev,
        processingInvestment: false,
        isModalOpen: false,
      }));
    }
  };

  const handleInvestment = async (amount, portfolioId, tenor) => {
    setState((prev) => ({
      ...prev,
      processingInvestment: true,
      isModalOpen: true,
    }));

    if (isLiabilityProduct(portfolioId) === true) {
      await handleLiabilityProductInvestment(amount, portfolioId, tenor);
    }

    setState((prev) => ({
      ...prev,
      processingInvestment: false,
      isModalOpen: false,
    }));
  };

  useEffect(() => {
    const fetchTenor = async () => {
      if (data?.portfolioId) {
        await getProductTenors(data.portfolioId);
      }
    };

    fetchTenor();
  }, [data]);

  return (
    <div>
      <HeaderText>Investment Simulator</HeaderText>

      <ContentBox className={"p-[20px] md:mt-[35px] bg-white"}>
        <Formik
          initialValues={{
            amount: data?.principal || "",
            portfolioId: data?.portfolioId || "",
            tenor: data?.tenor || "",
          }}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            setState((prev) => ({
              ...prev,
              isModalOpen: true,
              isChecked: false,
            }));
          }}
        >
          {({ values, setFieldValue, errors, touched, handleSubmit }) => (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px] items-stretch">
                <div>
                  <h3 className="font-semibold text-primary mb-4">
                    Investment Details
                  </h3>
                  <div className="flex flex-col mb-4">
                    <label
                      htmlFor="amount"
                      className="mb-1 text-sm font-medium"
                    >
                      Principal
                    </label>
                    <Field
                      name="amount"
                      type="number"
                      id="amount"
                      placeholder="Enter amount"
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.amount && touched.amount && (
                      <div style={{ color: "red" }}>{errors.amount}</div>
                    )}
                  </div>

                  <div className="flex flex-col mb-4">
                    <label className="mb-1 text-sm font-medium">
                      Investment Product
                    </label>
                    <Field
                      id="portfolioId"
                      name="portfolioId"
                      as="select"
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      onChange={(e) => {
                        const portfolioId = e.target.value;
                        console.log("Selected portfolioId: ", portfolioId);
                        setFieldValue("portfolioId", portfolioId);
                        setFieldValue("tenor", "");
                        if (portfolioId) {
                          isLiabilityProduct(portfolioId) === true &&
                            getProductTenors(portfolioId);
                        } else {
                          setTenorOptions([]);
                        }
                      }}
                    >
                      <option value="">Select Product</option>
                      {productOptions?.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ))}
                    </Field>
                    {errors.portfolioId && touched.portfolioId && (
                      <div style={{ color: "red" }}>{errors.portfolioId}</div>
                    )}
                  </div>

                  {values?.portfolioId !== "" &&
                    isLiabilityProduct(values?.portfolioId) === true && (
                      <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium">
                          Desired Tenor
                        </label>
                        <Field
                          id="tenor"
                          name="tenor"
                          as="select"
                          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="">Select Tenor</option>
                          {tenorOptions?.map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </option>
                          ))}
                        </Field>
                        {errors.tenor && touched.tenor && (
                          <div style={{ color: "red" }}>{errors.tenor}</div>
                        )}
                        {values?.tenor && (
                          <p className="text-light-primary text-sm">
                            Returns {getSelectedTenorInterest(values?.tenor)}
                          </p>
                        )}
                      </div>
                    )}
                </div>

                <div className="">
                  <h3 className="font-semibold text-primary mb-4 md:mb-10">
                    Simulation Details
                  </h3>

                  <div className="w-full rounded-lg border border-light-primary p-3">
                    <div className="border-b border-gray-300 p-2 flex items-center justify-between">
                      <p className="text-light-primary">Principal</p>
                      <p className="text-sm font-semibold">
                        {amountFormatter.format(values?.amount)}
                      </p>
                    </div>

                    <div className="border-b border-gray-300 p-2 flex items-center justify-between">
                      <p className="text-light-primary">Estimated Returns</p>
                      <p className="text-sm font-semibold">
                        {values?.amount === "" && values?.tenor === ""
                          ? amountFormatter.format(0)
                          : isLiabilityProduct(values?.portfolioId) === true &&
                            amountFormatter.format(
                              Number(values?.amount) *
                                (selectedTenorInterestRate / 100)
                            )}
                      </p>
                    </div>

                    <div className="border-b border-gray-300 p-2 flex items-center justify-between">
                      <p className="text-light-primary">Estimated Payout</p>
                      <p className="text-sm font-semibold">
                        {values?.amount === "" && values?.tenor === ""
                          ? amountFormatter.format(0)
                          : amountFormatter.format(
                              Number(values?.amount) +
                                Number(values?.amount) *
                                  (selectedTenorInterestRate / 100)
                            )}
                      </p>
                    </div>

                    {
                      isLiabilityProduct(values?.portfolioId) &&
                        values?.tenor !== "" && (
                          <div className="p-2 flex items-center justify-between">
                            <p className="text-light-primary">Maturity Date</p>
                            <p className="text-sm font-semibold">
                              {addDaysToDate(values?.tenor)}
                            </p>
                          </div>
                        )
                      // : values?.portfolioId && (
                      //     <div className="p-2 flex items-center justify-between">
                      //       <p className="text-light-primary">Maturity Date</p>
                      //       <p className="text-sm font-semibold">
                      //         {addDaysToDate(
                      //           getMinimumHoldingPeriod(values?.portfolioId)
                      //         )}
                      //       </p>
                      //     </div>
                      //   )
                    }
                  </div>
                </div>
              </div>
              <button
                onClick={handleSubmit}
                type="submit"
                className="w-full mt-5 border border-gray-300 rounded-md px-3 py-2 hover:bg-light-primary focus:outline-none focus:ring-2 focus:ring-primary text-white bg-primary"
              >
                Proceed to Invest
              </button>

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
                <p className="mt-4">
                  Redemptions during the Lock-up period will attract a 20%
                  penalty on accrued returns earned over the period.
                </p>

                <p>
                  {" "}
                  By tapping the "Make Payment" button, you agree to have the
                  total due deducted from your wallet balance to create this
                  investment plan
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
                      Number(values?.amount),
                      Number(values?.portfolioId),
                      Number(values?.tenor)
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
          )}
        </Formik>
      </ContentBox>
    </div>
  );
};

export default InvestmentSimulator;
