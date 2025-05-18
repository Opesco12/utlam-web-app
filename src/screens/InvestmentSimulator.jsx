import { useEffect, useState } from "react";
import { Formik, Field } from "formik";

import HeaderText from "../components/HeaderText";
import ContentBox from "../components/ContentBox";
import { Colors } from "../constants/Colors";

import { amountFormatter } from "../helperFunctions/amountFormatter";
import { getLiabilityProducts, getProducts, getTenor } from "../api";

const InvestmentSimulator = () => {
  const [productOptions, setProductOptions] = useState([]);
  const [tenorOptions, setTenorOptions] = useState([]);
  const [selectedTenorInterestRate, setSelectedTenorInterestRate] =
    useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts();
        setProductOptions(
          data.map((item) => ({
            label: item.portfolioName,
            value: item.portfolioId,
            isLiabilityProduct: item?.portfolioType === 9 ? true : false,
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

  return (
    <div>
      <HeaderText>Investment Simulator</HeaderText>

      <ContentBox className={"p-[20px] md:mt-[35px] bg-white"}>
        <Formik
          initialValues={{
            amount: "",
            portfolioId: "",
            tenor: "",
          }}
        >
          {({ values, setFieldValue, errors, touched }) => (
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
                        setFieldValue("portfolioId", portfolioId);
                        setFieldValue("tenor", "");
                        if (portfolioId) {
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

                  {values?.portfolioId !== "" && (
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
                          returns {getSelectedTenorInterest(values?.tenor)}
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
                          : amountFormatter.format(
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

                    {values?.tenor && (
                      <div className="p-2 flex items-center justify-between">
                        <p className="text-light-primary">Maturity Date</p>
                        <p className="text-sm font-semibold">
                          {addDaysToDate(values?.tenor)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-5 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-white bg-primary"
              >
                Proceed to Invest
              </button>
            </div>
          )}
        </Formik>
      </ContentBox>
    </div>
  );
};

export default InvestmentSimulator;
