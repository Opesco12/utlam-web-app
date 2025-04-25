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
import TransactionDetails from "./screens/TransactionDetails";
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

const Layout = () => {
  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen overflow-hidden  md:flex-row">
        <Toaster position="top-right" />
        <ResponsiveSidebar />
        <main className="overflow-y-auto w-full bg-white ">
          <div className=" px-[15px] py-[25px] w-full flex-1 mx-auto  md:px-[30px]  lg:px-[45px] md:max-w-[800px] lg:max-w-[940px]">
            <Outlet />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

function App() {
  const [count, setCount] = useState(0);

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
              path="/transaction/details"
              element={<TransactionDetails />}
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
