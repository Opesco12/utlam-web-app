import { useState, useEffect } from "react";
import { Modal, Box } from "@mui/material";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { AddCircle, Bank } from "iconsax-react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import HeaderText from "../components/HeaderText";
import StyledText from "../components/StyledText";
import LargeLoadingSpinner from "../components/LargeLoadingSpinner";
import { Colors } from "../constants/Colors";

import {
  getClientBankAccounts,
  getBanks,
  createClientBank,
} from "../api/index";

const BankDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [banks, setBanks] = useState([]);
  const [clientbanks, setClientbanks] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    bank: Yup.string().required("Bank is required"),
    accountNo: Yup.number()
      .typeError("Account number must be a number")
      .test(
        "len",
        "Account number must be exactly 10 digits",
        (val) => val && String(val).length === 10
      )
      .required("Account number is required"),

    accountName: Yup.string()
      .required("Account name is required")
      .min(3, "Account name must be at least 3 characters")
      .max(100, "Account name can be at most 100 characters"),
  });

  const fetchData = async () => {
    const clientbanks = await getClientBankAccounts();
    console.log(clientbanks);
    setClientbanks(clientbanks);

    const banklist = await getBanks();
    setBanks(
      banklist.map((item) => ({
        label: item.bankName.split("-")[0],
        value: item.companyId,
      }))
    );

    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    const { bank, accountName, accountNo } = values;

    const requestData = {
      beneficiaryCompanyId: bank,
      beneficiaryAccountNo: accountNo,
      currencyCode: "NGN",
      beneficiaryName: accountName,
      countryCode: "NGA",
    };
    const response = await createClientBank(requestData);
    console.log(response);
    if (response) {
      if (response?.message === "success") {
        toast.success("Bank Details have been added successfully");
        setLoading(true);
        fetchData();
        setIsModalOpen(false);
        setSubmitting(false);
      }
    }
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
      <HeaderText>Bank Details</HeaderText>

      <div className="grid md:grid-cols-2 gap-3">
        {clientbanks?.map((bank, index) => (
          <BankItem
            bank={bank}
            key={index}
          />
        ))}
        {clientbanks?.length < 1 && (
          <div
            onClick={() => setIsModalOpen(true)}
            className="w-[100%] h-[180px] my-[20px] border border-gray-400 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50"
          >
            <div className="flex items-center justify-center flex-col">
              <AddCircle
                size={25}
                color={Colors.light}
              />
              <StyledText color={Colors.light}>Add Bank Details</StyledText>
            </div>
          </div>
        )}
      </div>

      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Bank Details"
      >
        <Formik
          initialValues={{
            bank: "",
            accountNo: "",
            accountName: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-[25px] my-[25px]">
              <SelectField
                name="bank"
                label="Bank"
                options={banks}
              />
              <TextField
                name="accountNo"
                label="Account Number"
                type="text"
              />
              <TextField
                name="accountName"
                label="Account Name"
                type="text"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-white py-2 px-4 rounded-md hover:bg-lightPrimary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
              >
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </CustomModal>
    </div>
  );
};

export default BankDetails;

const TextField = ({ label, ...props }) => {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium">{label}</label>
      <Field
        className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        {...props}
      />
      <ErrorMessage
        name={props.name}
        component="div"
        className="text-red-500 text-xs mt-1"
      />
    </div>
  );
};

const SelectField = ({ label, options = [], ...props }) => {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium">{label}</label>
      <Field
        as="select"
        className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        {...props}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </Field>
      <ErrorMessage
        name={props.name}
        component="div"
        className="text-red-500 text-xs mt-1"
      />
    </div>
  );
};

const CustomModal = ({ isOpen, onClose, title, children }) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          borderWidth: 0,
          bgcolor: "background.paper",
          borderRadius: "12px",
          boxShadow: 24,
          p: 2,
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2
            id="modal-title"
            className="text-lg font-medium"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <div id="modal-description">{children}</div>
      </Box>
    </Modal>
  );
};

const BankItem = ({ bank }) => {
  return (
    <div className="w-[100%] my-[20px] h-[180px] bg-primary rounded-lg px-[20px] flex items-center justify-between">
      <div>
        <StyledText
          variant="medium"
          type="title"
          color={Colors.white}
        >
          {bank?.bankName}
        </StyledText>
        <br />

        <StyledText color={Colors.white}>
          {bank?.beneficiaryAccountNo}
        </StyledText>
        <br />

        <StyledText
          color={Colors.white}
          variant="medium"
        >
          {bank?.beneficiaryName}
        </StyledText>
      </div>
      <Bank
        size={25}
        color={Colors.white}
      />
    </div>
  );
};
