import { useState, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";
import {
  Outlet,
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useParams,
} from "react-router-dom";
import "./App.css";

import ResponsiveSidebar from "./components/AppSidebar";
import HomeScreen from "./screens/HomeScreen";
import Portfolio from "./screens/Portfolio";
import Profile from "./screens/Profile";
import ProductDetails from "./screens/ProductDetails";
import MutualFunds from "./screens/MutualFunds";
import FixedIncome from "./screens/FixedIncome";
import PortfolioDetails from "./screens/PortfolioDetails";
import Transactions from "./screens/Transactions";
import MutualFundStatement from "./screens/MutualFundStatement";
import FixedIncomeWithdrawal from "./screens/FixedIcomeWithdrawal";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Otp from "./screens/OTP";
import ResetPassword from "./screens/ResetPassword";
import ChangePassword from "./screens/ChangePassword";
import NotFound from "./screens/NotFound";
import PersonalDetails from "./screens/PersonalDetails";
import BankDetails from "./screens/BankDetails";
import KYC_1 from "./screens/Kyc_1";

import {
  PublicRoute,
  ProtectedRoute,
  AuthProvider,
} from "./context/AuthProvider";
import Referral from "./screens/Referral";
import BreadCrumbs from "./components/BreadCrumbs";
import RegisterExistingUser from "./screens/RegisterExistingUser";
import Pin from "./screens/Pin";
import ContactRelationShipManager from "./screens/ContactRelationShipManager";
import InvestmentSimulator from "./screens/InvestmentSimulator";
import ActivateAccount from "./screens/ActivateAccount";
import Support from "./screens/Support";

function PageTitle() {
  const location = useLocation();
  const params = useParams();

  const titleMap = {
    "/": "UTLAM | Dashboard",
    "/portfolio": "UTLAM | Portfolio",
    "/profile": "UTLAM | Profile",
    "/invest/:portfolioId": `UTLAM | Invest`,
    "/invest/mutual_fund": "UTLAM | Mutual Funds",
    "/invest/fixed_income": "UTLAM | Fixed Income",
    "/invest/investment_simulator": "UTLAM | Simulator",
    "/portfolio/:portfolioName": `UTLAM | Portfolio`,
    "/portfolio/:portfolioName/statement": `UTLAM | Portfolio`,
    "/portfolio/:portfolioName/withdraw": `UTLAM | Portfolio`,
    "/transactions": "UTLAM | Transactions",
    "/profile/personal-details": "UTLAM | Personal Details",
    "/profile/bank-details": "UTLAM | Bank Details",
    "/profile/referral": "UTLAM | Referral",
    "/profile/kyc": "UTLAM | KYC Verification",
    "/profile/change-password": "UTLAM | Change Password",
    "/profile/contact-manager": "UTLAM | Contact Manager",
    "/profile/pin": "UTLAM | PIN Management",
    "/404": "UTLAM | Page Not Found",
    "/login": "UTLAM | Login",
    "/existing-user-registration": "UTLAM | Existing User Registration",
    "/forgot_password": "UTLAM | Reset Password",
    "/account/activate": "UTLAM | Activate Account",
    "/account/2fa": "UTLAM | 2FA",
    "/register": "UTLAM | Register",
  };

  // Helper to match routes with parameters
  const getTitle = () => {
    let path = location.pathname;
    // Handle dynamic routes
    for (const [route, title] of Object.entries(titleMap)) {
      const regex = new RegExp(`^${route.replace(/:[^\s/]+/g, "[^/]+")}$`);
      if (regex.test(path)) {
        return title;
      }
    }
    return "UTLAM | Home"; // Default title
  };

  return (
    <Helmet>
      <title>{getTitle()}</title>
    </Helmet>
  );
}

const Layout = () => {
  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen overflow-hidden md:flex-row">
        <div className="bg-gray-50 shadow-xl absolute h-15 w-full z-50 top-0 px-6 hidden md:block">
          <div className="h-full flex items-center">
            <img
              src="/images/logo.svg"
              alt="logo"
            />
          </div>
        </div>
        <Toaster position="top-right" />
        <ResponsiveSidebar />
        <main className="overflow-y-auto w-full bg-gray-50">
          <div className="px-5 py-8 w-full flex-1 mx-auto md:max-w-[800px] lg:max-w-[980px] md:py-20">
            <PageTitle />
            <BreadCrumbs />
            <Outlet />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

function App() {
  return (
    <Router>
      <HelmetProvider>
        <AuthProvider>
          <Toaster position="top-right" />
          <Routes>
            <Route
              path="/"
              element={<Layout />}
            >
              <Route
                index
                element={<HomeScreen />}
              />
              <Route
                path="portfolio"
                element={<Portfolio />}
              />
              <Route
                path="profile"
                element={<Profile />}
              />
              <Route
                path="/invest/:portfolioId"
                element={<ProductDetails />}
              />
              <Route
                path="/invest/mutual_fund"
                element={<MutualFunds />}
              />
              <Route
                path="/invest/fixed_income"
                element={<FixedIncome />}
              />
              <Route
                path="/invest/investment_simulator"
                element={<InvestmentSimulator />}
              />
              <Route
                path="/portfolio/:portfolioName"
                element={<PortfolioDetails />}
              />
              <Route
                path="/portfolio/:portfolioName/statement"
                element={<MutualFundStatement />}
              />
              <Route
                path="/portfolio/:portfolioName/withdraw"
                element={<FixedIncomeWithdrawal />}
              />
              <Route
                path="/transactions"
                element={<Transactions />}
              />
              <Route
                path="/profile/personal-details"
                element={<PersonalDetails />}
              />
              <Route
                path="/profile/bank-details"
                element={<BankDetails />}
              />
              <Route
                path="/profile/referral"
                element={<Referral />}
              />
              <Route
                path="/profile/kyc"
                element={<KYC_1 />}
              />
              <Route
                path="/profile/change-password"
                element={<ChangePassword />}
              />
              <Route
                path="/profile/contact-manager"
                element={<ContactRelationShipManager />}
              />
              <Route
                path="/profile/help_and_support"
                element={<Support />}
              />
              <Route
                path="/profile/pin"
                element={<Pin />}
              />
            </Route>
            <Route
              index
              path="login"
              element={
                <PublicRoute>
                  <Helmet>
                    <title>UTLAM | Login</title>
                  </Helmet>
                  <Login />
                </PublicRoute>
              }
              replace
            />
            <Route
              index
              path="existing-user-registration"
              element={
                <PublicRoute>
                  <Helmet>
                    <title>UTLAM | Register Existing User</title>
                  </Helmet>
                  <RegisterExistingUser />
                </PublicRoute>
              }
              replace
            />
            <Route
              index
              path="/forgot_password"
              element={
                <PublicRoute>
                  <Helmet>
                    <title>UTLAM | Reset Password</title>
                  </Helmet>
                  <ResetPassword />
                </PublicRoute>
              }
              replace
            />
            <Route
              path="/account/activate"
              element={
                <PublicRoute>
                  <Helmet>
                    <title>UTLAM | Activate Account</title>
                  </Helmet>
                  <Otp />
                </PublicRoute>
              }
            />
            <Route
              path="/account/2fa"
              element={
                <PublicRoute>
                  <Helmet>
                    <title>UTLAM | Two-Factor Authentication</title>
                  </Helmet>
                  <Otp />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Helmet>
                    <title>UTLAM | Register</title>
                  </Helmet>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/404"
              element={<NotFound />}
            />
            <Route
              path="*"
              element={
                <Navigate
                  to={"/404"}
                  replace
                />
              }
            />
          </Routes>
        </AuthProvider>
      </HelmetProvider>
    </Router>
  );
}

export default App;
