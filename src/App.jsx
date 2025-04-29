import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { Toaster } from "sonner";
import {
  Outlet,
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

import ResponsiveSidebar from "./components/AppSidebar";
import HomeScreen from "./screens/HomeScreen";
import Invest from "./screens/Invest";
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
import StyledText from "./components/StyledText";

import { Colors } from "./constants/Colors";

import {
  PublicRoute,
  ProtectedRoute,
  AuthProvider,
} from "./context/AuthProvider";
import Referral from "./screens/Referral";

const Layout = () => {
  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen overflow-hidden  md:flex-row">
        <div className="bg-gray-50 shadow-xl absolute h-15 w-full z-10 top-0 px-6 hidden md:block">
          <div className="h-full flex items-center ">
            <img
              src="/images/logo.svg"
              alt="logo"
            />
          </div>
        </div>
        <Toaster position="top-right" />
        <ResponsiveSidebar />
        <main className="overflow-y-auto w-full bg-gray-50 ">
          <div className="px-5 py-8 w-full flex-1 mx-auto md:max-w-[800px] lg:max-w-[980px] md:py-20">
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
              path="invest"
              element={<Invest />}
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
              path="/invest/:productId"
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
              path="/kyc/1"
              element={<KYC_1 />}
            />

            <Route
              path="/change-password"
              element={<ChangePassword />}
            />

            <Route
              path="/404"
              element={<NotFound />}
            />
          </Route>
          <Route
            index
            path="login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
            replace
          />

          <Route
            index
            path="/forgot_password"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
            replace
          />

          <Route
            path="/account/activate"
            element={
              <PublicRoute>
                <Otp />
              </PublicRoute>
            }
          />
          <Route
            path="/account/2fa"
            element={
              <PublicRoute>
                <Otp />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
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
    </Router>
  );
}

export default App;
