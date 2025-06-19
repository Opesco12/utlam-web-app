import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { getProducts } from "../api";
import _ from "lodash";

const routeNameMap = {
  portfolio: "Portfolio",
  profile: "Profile",
  transactions: "Transactions",
  mutual_fund: "Mutual Funds",
  fixed_income: "Fixed Income",
  "personal-details": "Personal Details",
  "bank-details": "Bank Details",
  investment_simulator: "Investment Simulator",
  referral: "Referral",
  kyc: "KYC",
  "change-password": "Change Password",
  statement: "Statement",
  withdraw: "Withdraw",
  pin: "Pin",
  "contact-manager": "Contact Manager",
};

const BreadcrumbItem = ({ label, to, isLast, onClick }) => {
  return (
    <li className="flex items-center">
      {isLast ? (
        <span className="text-primary font-medium">{label}</span>
      ) : (
        <Link
          to={to}
          className="text-primary hover:text-light-primary hover:underline"
          onClick={onClick}
        >
          {label}
        </Link>
      )}
      {!isLast && <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />}
    </li>
  );
};

const Breadcrumbs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [shouldShow, setShouldShow] = useState(false);
  const [referringRoute, setReferringRoute] = useState(null);

  const getProductName = async (productId) => {
    try {
      const products = await getProducts();
      const product = products?.find(
        (item) => item?.portfolioId === Number(productId)
      );
      return product
        ? _.startCase(_.toLower(product.portfolioName))
        : "Product";
    } catch (error) {
      console.error("Failed to fetch product name:", error);
      return "Product";
    }
  };

  useEffect(() => {
    const buildBreadcrumbs = async () => {
      const pathSegments = location.pathname
        .split("/")
        .filter((segment) => segment);

      const hiddenRoutes = [
        "/404",
        "/",
        "/portfolio",
        "/profile",
        "/transactions",
        "/invest/mutual_fund",
        "/invest/fixed_income",
      ];

      if (hiddenRoutes.includes(location.pathname)) {
        setShouldShow(false);
        return;
      }

      setShouldShow(true);

      const isFromMutualFund = location.state?.from === "/mutual_fund";
      const isFromFixedIncome = location.state?.from === "/fixed_income";
      const newReferringRoute = isFromMutualFund
        ? "/mutual_fund"
        : isFromFixedIncome
        ? "/fixed_income"
        : null;

      setReferringRoute(newReferringRoute);

      const breadcrumbItems = [];
      let currentPath = "";

      for (let i = 0; i < pathSegments.length; i++) {
        const segment = pathSegments[i];
        currentPath = `${currentPath}/${segment}`;

        if (segment === "invest") {
          continue;
        }

        if (pathSegments[i - 1] === "invest" && !isNaN(segment)) {
          const productName = await getProductName(segment);
          breadcrumbItems.push({
            label: "Invest",
            path: newReferringRoute || "/invest/mutual_fund",
            isSpecial: true,
          });
          breadcrumbItems.push({
            label: productName,
            path: currentPath,
          });
          continue;
        }

        if (
          segment === "investment_simulator" &&
          pathSegments[i - 1] === "invest"
        ) {
          breadcrumbItems.push({
            label: "Invest",
            path: newReferringRoute || "/invest/mutual_fund",
            isSpecial: true,
          });
          breadcrumbItems.push({
            label: routeNameMap[segment],
            path: currentPath,
          });
          continue;
        }

        // Handle portfolio details routes
        if (
          pathSegments[i - 1] === "portfolio" &&
          !routeNameMap[segment] &&
          segment !== "portfolio"
        ) {
          breadcrumbItems.push({
            label: _.startCase(_.toLower(segment)),
            path: currentPath,
          });
          continue;
        }

        // Default case: use routeNameMap or capitalize segment
        const label =
          routeNameMap[segment] ||
          _.startCase(_.toLower(segment.replace(/-/g, " ")));

        breadcrumbItems.push({
          label,
          path: currentPath,
        });
      }

      setBreadcrumbs(breadcrumbItems);
    };

    buildBreadcrumbs();
  }, [location.pathname, location.state]);

  if (!shouldShow) return null;

  const handleInvestClick = (item, e) => {
    if (item.isSpecial && referringRoute) {
      e.preventDefault();
      navigate(referringRoute);
    }
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className="py-2 mb-4"
    >
      <ol className="flex flex-wrap items-center">
        {breadcrumbs.map((item, index) => (
          <BreadcrumbItem
            key={index}
            label={item.label}
            to={item.path}
            isLast={index === breadcrumbs.length - 1}
            onClick={
              item.isSpecial ? (e) => handleInvestClick(item, e) : undefined
            }
          />
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
