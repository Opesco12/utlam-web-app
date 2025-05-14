import { toast } from "sonner";
import axios from "axios";

import { endpoints } from "./endpoints";
import { userStorage } from "../storage/userStorage";
import { keys } from "../storage/kyes";
import { history } from "../helperFunctions/navigationHelper";

export const BASE_URL = import.meta.env.VITE_LIVE_BASE_URL;

class AuthenticationError extends Error {
  constructor(message = "Authentication required") {
    super(message);
    this.name = "AuthenticationError";
  }
}

const getAuthToken = async () => {
  const data = userStorage.getItem(keys.user);
  return data?.token;
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized request detected");
      userStorage.removeItem(keys.user);
      if (history && history.navigate) {
        history.navigate("/login", { replace: true });
      } else {
        window.location.href = "/login";
      }
      return Promise.reject(new AuthenticationError());
    }
    return Promise.reject(error);
  }
);

const apiCall = async ({
  endpoint,
  method = "GET",
  data = null,
  requiresAuth = true,
  customConfig = {},
} = {}) => {
  try {
    if (!endpoint) {
      throw new Error("Endpoint is required");
    }

    const config = {
      method,
      url: endpoint,
      headers: {
        "Content-Type": "application/json-patch+json",
      },
      ...customConfig,
    };

    if (data) {
      config.data = data;
    }

    if (requiresAuth) {
      const token = await getAuthToken();
      if (!token) {
        console.log("No auth token found");
        if (history && history.navigate) {
          history.navigate("/login", { replace: true });
        } else {
          window.location.href = "/login";
        }
        throw new AuthenticationError();
      }
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    console.error("API call error:", error);

    throw error;
  }
};

export const getCountries = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getCountries,
      method: "GET",
      requiresAuth: false,
    });
    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.log(error);
      toast.error("Unable to fetch countries");
    }
    return null;
  }
};

export const registerNewIndividual = async (info) => {
  try {
    const data = await apiCall({
      method: "POST",
      endpoint: endpoints.RegisterNewIndividual,
      data: info,
      requiresAuth: false,
    });
    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.log(error);
      if (error.response && error.response.status === 400) {
        toast.error("Invalid Details or account already exists");
      } else {
        toast.error("An error occurred");
      }
    }
    return null;
  }
};

export const registerExistingIndividual = async (info) => {
  try {
    console.log(info);
    const data = await apiCall({
      method: "POST",
      endpoint: endpoints.RegisterExistingIndividual,
      data: info,
      requiresAuth: false,
    });
    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.log(error);
      if (error.response && error.response.status === 400) {
        toast.error("Invalid Details or account already exists");
      } else {
        toast.error("An error occurred");
      }
    }
    return null;
  }
};

export const getClientInfo = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getClientInfo,
      method: "GET",
    });
    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.log(error);
      toast.error("Unable to fetch client information");
    }
    return null;
  }
};

export const updateClientInfo = async (info) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.UpdateClientInfo,
      method: "POST",
      data: info,
    });
    return data;
  } catch (error) {
    console.error(error);
    toast.error("An error occured");
  }
};

export const getNextOfKins = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getNextOfKins,
      method: "GET",
    });
    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.log(error);
      toast.error("Unable to fetch next of kins");
    }
    return null;
  }
};

export const createNextOfKin = async (info) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.createNextOfKin,
      method: "POST",
      data: info,
    });
    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.log(error);
      toast.error("Failed to create next of kin");
    }
    return null;
  }
};

export const login = async (username, password) => {
  console.log(username, password);
  try {
    const data = await apiCall({
      endpoint: endpoints.Login,
      method: "POST",
      data: { username: username, password: password },
      requiresAuth: false,
    });
    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.log(error);
      if (error.response && error.response.status === 400) {
        toast.error("Invalid username or password");
      } else {
        toast.error("Please try again later");
      }
    }
    return null;
  }
};

export const login2fa = async (info) => {
  console.log(info);
  try {
    const data = await apiCall({
      endpoint: endpoints.Login2Fa,
      method: "POST",
      requiresAuth: false,
      data: {
        username: info.email,
        securityCode: info.code,
      },
    });
    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.log(error);
      if (error.response && error.response.status === 400) {
        toast.error("Incorrect Security Code");
      } else {
        toast.error("Please try again later");
      }
    }
    return null;
  }
};

export const activateAccount = async (info) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.ActivateAccount,
      method: "POST",
      data: info,
      requiresAuth: false,
    });
    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.log(error);
      if (error.response && error.response.status === 400) {
        toast.error(
          "Invalid security passcode or security login passcode has expired"
        );
      } else {
        toast.error("Please try again later");
      }
    }
    return null;
  }
};

export const resnedActivationCode = async (info) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.ResendActivationCode,
      method: "POST",
      data: info,
      requiresAuth: false,
    });
    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.log(error);
      if (error.response && error.response.status === 400) {
        toast.error("Invalid details or account already exists");
      } else {
        toast.error("Please try again later");
      }
    }
    return null;
  }
};

export const logout = async (token) => {
  try {
    const data = await apiCall({
      method: "POST",
      endpoint: endpoints.Logout,
      data: { token: token },
    });
    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.log(error);
      toast.error("Logout failed");
    }
    return null;
  }
};

export const changePassword = async (oldPassword, newPassword) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.ChangePassword,
      method: "POST",
      data: { oldPassword: oldPassword, newPassword: newPassword },
    });
    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.log(error);
      if (error.response && error.response.status === 400) {
        toast.error("Incorrect Password");
      } else {
        toast.error("An error occurred");
      }
    }
    return null;
  }
};

export const resetPasswordRequest = async (email) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.ResetPasswordRequest,
      method: "POST",
      data: { username: email, emailAddress: email },
      requiresAuth: false,
    });
    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.log(error);
      if (error.response && error.response.status === 400) {
        toast.error("Please input a registered email address");
      } else {
        toast.error("An error occurred");
      }
    }
    return null;
  }
};

export const resetPassword = async (token, password) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.ResetPassword,
      method: "POST",
      data: { token: token, password: password },
      requiresAuth: false,
    });
    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.log(error);
      if (error.response && error.response.status === 400) {
        toast.error(
          "An error occurred, Please confirm that the token is correct"
        );
      } else {
        toast.error("An error occurred");
      }
    }
    return null;
  }
};

export const getWalletBalance = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getWalletBalance,
      method: "GET",
      requiresAuth: true,
    });
    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.log(error);
      toast.error("Unable to fetch wallet balances");
    }
    return null;
  }
};

export const getProducts = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getProducts,
      method: "GET",
      requiresAuth: true,
    });
    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.log(error);
      toast.error("Unable to fetch data");
    }
    return null;
  }
};

export const getVirtualAccounts = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getVirtualAccounts,
      method: "GET",
    });
    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.log(error);
      toast.error("Unable to fetch virtual accounts");
    }
    return null;
  }
};

export const getClientPortfolio = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getPortfolio,
      method: "GET",
    });
    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.log(error);
      toast.error("Unable to fetch client portfolio");
    }
    return null;
  }
};

export const getMutualFundOnlineBalances = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getMutualFundOnlineBalances,
      method: "GET",
    });
    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.log(error);
      toast.error("Unable to fetch mutual fund balances");
    }
    return null;
  }
};

export const getMutualFundOnlineBalance = async (portfolioId) => {
  try {
    const data = await apiCall({
      endpoint: `${endpoints.getMutualFundOnlineBalance}/${portfolioId}`,
      method: "GET",
    });
    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.log(error);
      toast.error("Unable to fetch mutual fund balance");
    }
    return null;
  }
};

export const getMutualFundStatement = async (portfolioId) => {
  try {
    const date = new Date().toISOString();
    const data = await apiCall({
      endpoint: `${endpoints.getMutualFundStatement}/${portfolioId}/${date}`,
      method: "GET",
    });
    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.log(error);
      toast.error("Unable to fetch statements");
    }
    return null;
  }
};

export const getTransactions = async (startdate, enddate) => {
  try {
    const data = await apiCall({
      endpoint: `${endpoints.getTransactions}/${startdate}/${enddate}`,
      method: "GET",
    });
    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.log(error);
      toast.error("Unable to fetch transactions");
    }
    return null;
  }
};

export const getRecentTransactions = async () => {
  try {
    const data = await apiCall({
      endpoint: `${endpoints.getRecentTransactions}/5`,
      method: "GET",
    });
    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.log(error);
      toast.error("An error occurred");
    }
    return null;
  }
};

export const mutualFundSubscription = async ({
  accountNumber,
  portfolioId,
  amount,
}) => {
  if (accountNumber) {
    try {
      const data = await apiCall({
        endpoint: endpoints.mutualFundWithAccount,
        method: "POST",
        data: {
          accountNumber: accountNumber,
          portfolioId: portfolioId,
          amount: amount,
        },
      });
      return data;
    } catch (error) {
      if (!(error instanceof AuthenticationError)) {
        console.log(error);
        toast.error("An error occurred");
      }
      return null;
    }
  } else {
    try {
      const data = await apiCall({
        endpoint: endpoints.mutualFundNoAccount,
        method: "POST",
        data: {
          portfolioId: portfolioId,
          amount: amount,
        },
      });
      console.log("The request gave back: ", data);
      return data;
    } catch (error) {
      if (!(error instanceof AuthenticationError)) {
        console.log(error);
        toast.error("An error occurred");
      }
      return null;
    }
  }
};

export const mutualfundRedemption = async (accountNo, amount) => {
  try {
    console.log("account number is:", accountNo);
    console.log("amount is : ", amount);
    const data = await apiCall({
      endpoint: endpoints.mutualfundRedemption,
      method: "POST",
      data: {
        mutualfundAccountNo: accountNo,
        amount: amount,
      },
    });
    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.log(error);
      toast.error("An error occurred while processing fund withdrawal");
    }
    return null;
  }
};

export const getFixedIcomeOnlineBalances = async (portfolioId) => {
  try {
    const data = await apiCall({
      endpoint: `${endpoints.getFixedIncomeBalances}/${portfolioId}`,
      method: "GET",
    });
    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.log(error);
      toast.error("Unable to fetch fixed income balances");
    }
    return null;
  }
};

export const getTitles = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getTitles,
      method: "GET",
    });
    return data;
  } catch (error) {
    if (error) {
    }
  }
};

export const getLiabilityProducts = async (portfolioId) => {
  try {
    const data = await apiCall({
      endpoint: `${endpoints.getLiabilityProducts}/${portfolioId}`,
      method: "GET",
    });
    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.log(error);
      toast.error("Unable to fetch liability products");
    }
    return null;
  }
};

export const getTenor = async (productId) => {
  try {
    const data = await apiCall({
      endpoint: `${endpoints.getProductTenor}/${productId}`,
      method: "GET",
    });
    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.log(error);
      toast.error("Unable to fetch tenor information");
    }
    return null;
  }
};

export const fixedIncomeSubscriptionOrder = async ({
  securityProductId,
  portfolioId,
  currency,
  faceValue,
  tenor,
}) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.fixedIncomeSubscription,
      method: "POST",
      data: {
        securityProductId: securityProductId,
        portfolioId: portfolioId,
        currency: currency,
        faceValue: faceValue,
        tenor: tenor,
      },
    });

    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.log(error);
      toast.error("An error occurred");
    }
    return null;
  }
};

export const fixedIncomeRedemptionOrder = async (referenceNo, amount) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.fixedIncomeRedemption,
      method: "POST",
      data: {
        purchaseReferenceNo: referenceNo,
        faceValue: amount,
      },
    });
    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.log(error);
      toast.error("An error occurred while processing fund withdrawal");
    }
    return null;
  }
};

export const getBanks = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getBanks,
      method: "GET",
    });
    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.error(error);
      toast.error("An error occurred");
    }
    return null;
  }
};

export const createClientBank = async (requestData) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.createBank,
      method: "POST",
      data: requestData,
    });
    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.error(error);
      toast.error("Invalid details or error while processing request");
    }
    return null;
  }
};

export const getClientBankAccounts = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getClientBanks,
      method: "GET",
    });
    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.error(error);
      toast.error("Unable to fetch client bank accounts");
    }
    return null;
  }
};

export const debitWallet = async (requestData) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.withdraw,
      method: "POST",
      data: requestData,
    });
    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.error(error);
      if (error.response.data?.Message === "Incorrect pin") {
        toast.error("Incorrect pin");
      } else {
        toast.error("An error occurred while processing fund withdrawal");
      }
    }
    return null;
  }
};

export const fetchClientPhoto = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getClientPhoto,
      method: "GET",
    });
    return data;
  } catch (error) {
    console.error(error);
    toast.error("An error occured while fetching photo");
  }
};

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result.split(",")[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const uploadImage = async (file) => {
  try {
    const base64String = await convertToBase64(file);

    const requestBody = {
      base64: base64String,
      filename: file?.name,
    };

    const token = await getAuthToken();

    const response = await fetch(`${BASE_URL}${endpoints.uploadClientPhoto}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json-patch+json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    return response;
  } catch (error) {
    console.error("Upload error:", error);
    toast.error("Upload failed");
  }
};

export const getPendingDocuments = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getPendingDocuments,
      method: "GET",
    });
    return data;
  } catch (error) {
    console.error(error);
    toast.error("An error occured while fetching photo");
  }
};
export const uploadClientDocument = async (file, documentId, comment) => {
  try {
    const formData = new FormData();

    formData.append("Files", file);

    formData.append("DocumentId", documentId);

    if (comment) {
      formData.append("Comment", comment);
    }

    const token = await getAuthToken();

    const response = await axios.post(
      `${BASE_URL}${endpoints.uploadClientDocument}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Document uploaded successfully");
    return response.data;
  } catch (error) {
    console.error("Upload failed: ", error);
    toast.error("Document upload failed");
    throw error;
  }
};

export const hasTransactionPin = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.hasTransactionPin,
      method: "GET",
    });
    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.error(error);
      toast.error("An error occurred");
    }
    return null;
  }
};

export const createTransactionPin = async (requestData) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.createPin,
      method: "POST",
      data: requestData,
    });
    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.error(error);
      toast.error("An error occurred");
    }
    return null;
  }
};

export const changeTransactionPin = async (requestData) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.createPin,
      method: "POST",
      data: requestData,
    });
    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.error(error);
      toast.error("An error occurred");
    }
    return null;
  }
};

export const resetTransactionPinRequest = async (username) => {
  try {
    const data = await apiCall({
      endpoint: `${endpoints.resetPinRequest}?username=${username}`,
      method: "POST",
    });

    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.error(error);
      toast.error("An error occurred");
    }
    return null;
  }
};

export const resetTransactionPin = async (requestData) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.resetPin,
      method: "POST",
      data: requestData,
    });
    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.error(error);
      toast.error("An error occurred");
    }
    return null;
  }
};

export const sendMessageToClientManager = async (message) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.sendMessageToClientManager,
      method: "POST",
      data: message,
    });
    return data;
  } catch (error) {
    if (!(error instanceof AuthenticationError)) {
      console.error(error);
      toast.error("An error occurred");
    }
    return null;
  }
};
