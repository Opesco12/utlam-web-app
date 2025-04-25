import { showMessage } from "react-native-flash-message";
import { router } from "expo-router";
import { Alert } from "react-native";

const responseMessages = {
  "00": "Successful",
  "01": "Record not found. Please ensure all details are correct and resubmit.",
  "02": "Service is currently unavailable. Please try again later.",
  "07": "This ID has been blocked or watch-listed. Please contact support for assistance.",
};

const documentNames = {
  NIN: "National Identification Number",
  BVN: "Bank Verification Number",
  Passport: "International Passport",
  License: "Driver's License",
  VoterCard: "Voter's Card",
};

export const handleVerificationResponses = (responses, navigateTo) => {
  const allSuccessful = responses.every(
    (response) => response.response_code === "00"
  );
  const allFailed = responses.every(
    (response) => response.response_code !== "00"
  );

  if (allSuccessful) {
    showMessage({
      message: "Verification Successful",
      description: "All your documents have been verified successfully.",
      type: "success",
    });
    setTimeout(() => {
      router.replace("/(tabs)/profile");
    }, 2000);
  } else if (allFailed) {
    showMessage({
      message: "Verification Failed",
      description:
        "None of your documents could be verified. Please check your information and try again.",
      type: "danger",
      duration: 8000,
    });
  } else {
    const failedVerifications = responses.filter(
      (response) => response.response_code !== "00"
    );

    let errorMessages = failedVerifications.map((response) => {
      const documentName = documentNames[response.type] || response.type;
      const message =
        responseMessages[response.response_code] || "An unknown error occurred";
      return `${documentName}: ${message}`;
    });

    showMessage({
      message: "Some Verifications Failed",
      description:
        "The following documents could not be verified:\n\n" +
        errorMessages.join("\n\n"),
      type: "warning",
      duration: 10000,
    });
  }
};

// {
//   "status": true,
//   "detail": "Verification Successful",
//   "response_code": "00",
//   "data": {
//     "firstName": "EMMANUEL",
//     "lastName": "OYELEKE",
//     "middleName": "OPEYEMI",
//     "dateOfBirth": "27-Jul-2004",
//     "phoneNumber": "08145298341",
//     "number": "22604519124"
//   },
//   "verification": {
//     "status": "VERIFIED",
//     "reference": "ca6e472c-8efa-4986-ab5a-841be981c905"
//   },
//   "session": {},
//   "endpoint_name": "Bank Verification Number (Basic)"
// }
