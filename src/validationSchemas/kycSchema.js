import * as Yup from "yup";

export const kycValidationSchema = Yup.object().shape({
  nin: Yup.string()
    .matches(/^\d{11}$/, "NIN must be exactly 11 digits")
    .required("NIN is required"),

  bvn: Yup.string()
    .matches(/^\d{11}$/, "BVN must be exactly 11 digits")
    .required("BVN is required"),

  voterNumber: Yup.string().when(() => {
    return documentType === "Voter's Card"
      ? Yup.string().required("Voter's Card Number is required")
      : // .matches(
        //   /^[0-9]{8}-[0-9]{8}-[0-9]{3}$/,
        //   "Invalid Voter's Card Number format. It should be in the format: 12345678-12345678-123"
        // )
        Yup.string().notRequired();
  }),

  voterFirstname: Yup.string().when(() => {
    return documentType === "Voter's Card"
      ? Yup.string().required("First Name is required")
      : Yup.string().notRequired();
  }),
  voterLastname: Yup.string().when(() => {
    return documentType === "Voter's Card"
      ? Yup.string().required("Last Name is required")
      : Yup.string().notRequired();
  }),
  voterLga: Yup.string().when(() => {
    return documentType === "Voter's Card"
      ? Yup.string().required("Local Goverment Area is required")
      : Yup.string().notRequired();
  }),
  voterState: Yup.string().when(() => {
    return documentType === "Voter's Card"
      ? Yup.string().required("State is required")
      : Yup.string().notRequired();
  }),
});
