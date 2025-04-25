import axios from "axios";
import { showMessage } from "react-native-flash-message";

import { compareData } from "../../helperFunctions/compareData";

import {} from "react-identity-kyc";

export const verifyDocuments = async ({
  nin,
  bvn,
  userData,
  documentNumber,
  documentType,
  // documentImage,
  firstname,
  lastname,
  vin,
  DOB,
  state,
  LGA,
}) => {
  const API_Key = "live_sk_RfxvOPK05yXRXObmXaYuGcs3pOWQJ3FrKL9gMO9";
  const APP_ID = "a3394093-5a56-4381-ad3f-9479bbe7e9fa";
  const ninOptions = {
    method: "POST",
    url: "https://api.prembly.com/identitypass/verification/vnin",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "app-id": APP_ID,
      "x-api-key": API_Key,
    },
    data: { number_nin: nin },
  };

  const bvnOptions = {
    method: "POST",
    url: "https://api.prembly.com/identitypass/verification/bvn_validation",
    headers: {
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded",
      "app-id": APP_ID,
      "x-api-key": API_Key,
    },
    data: { number: bvn },
  };

  const passportOptions = {
    method: "POST",
    url: "https://api.prembly.com/identitypass/verification/national_passport",
    headers: {
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded",
      "app-id": APP_ID,
      "x-api-key": API_Key,
    },
    data: { number: documentNumber, last_name: lastname },
  };

  const licenseOptions = {
    method: "POST",
    url: "https://api.prembly.com/identitypass/verification/drivers_license",
    headers: {
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded",
      "app-id": APP_ID,
      "x-api-key": API_Key,
    },
    data: {
      number: documentNumber,
      dob: DOB,
      first_name: firstname,
      last_name: lastname,
    },
  };

  const cardOptions = {
    method: "POST",
    url: "https://api.prembly.com/identitypass/verification/voters_card",
    headers: {
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded",
      "app-id": APP_ID,
      "x-api-key": API_Key,
    },
    data: {
      number: vin,
      first_name: firstname,
      last_name: lastname,
      dob: DOB,
      lga: LGA,
      state: state,
    },
  };

  const responses = [];

  try {
    const NINVerification = await axios.request(ninOptions);
    console.log("NIN response: ", NINVerification.data.response_code);
    const ninComparison = compareData(
      NINVerification.data.nin_data,
      userData,
      "NIN"
    );
    responses.push({
      type: "NIN",
      response_code: NINVerification.data.response_code,
      dataMatch: ninComparison,
    });

    const BVNVerification = await axios.request(bvnOptions);
    console.log("BVN response: ", BVNVerification.data.response_code);
    const bvnComparison = compareData(
      BVNVerification.data.data,
      userData,
      "BVN"
    );
    responses.push({
      type: "BVN",
      response_code: BVNVerification.data.response_code,
      dataMatch: bvnComparison,
    });

    const overallVerification = responses.every(
      (response) =>
        response.response_code === "00" && response.dataMatch.isMatch
    );

    if (overallVerification) {
    } else {
      const mismatchFields = responses.flatMap(
        (response) => response.dataMatch.mismatches
      );
      //   showMessage({
      //     message: `Verification failed or data mismatch in fields: ${mismatchFields.join(
      //       ", "
      //     )}`,
      //     type: "warning",
      //   });
    }
  } catch (error) {
    // showMessage({
    //   message: "An error occurred",
    //   description:
    //     "We were unable to verify your identity using the provided KYC document.",
    //   type: "warning",
    //   duration: 7000,
    // });
    console.log(error);
    responses.push({
      type: "Error",
      error: error.message || "An unknown error occurred",
    });
  }

  return responses;
};
