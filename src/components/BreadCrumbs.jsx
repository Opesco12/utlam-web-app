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
  referral: "Referral",
  "kyc/1": "KYC",
  "change-password": "Change Password",
  statement: "Statement",
  withdraw: "Withdraw",
};

const sidebarRoutes = [
  "",
  "/invest/mutual_fund",
  "/invest/fixed_income",
  "/portfolio",
  "/profile",
  "/transactions",
];

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
    const products = await getProducts();
    const product = products.find(
      (item) => item?.portfolioId === Number(productId)
    );
    return _.startCase(_.toLower(product?.portfolioName));
  };

  useEffect(() => {
    if (location.pathname.includes("/invest/")) {
      const isFromMutualFund = location.state?.from === "/mutual_fund";
      const isFromFixedIncome = location.state?.from === "/fixed_income";

      if (isFromMutualFund) {
        setReferringRoute("/mutual_fund");
      } else if (isFromFixedIncome) {
        setReferringRoute("/fixed_income");
      }
    }

    const buildBreadcrumbs = () => {
      const pathSegments = location.pathname
        .split("/")
        .filter((segment) => segment);

      const hiddenRoutes = [
        "/",
        "/invest/mutual_fund",
        "/invest/fixed_income",
        ...sidebarRoutes,
      ];

      if (hiddenRoutes.includes(location.pathname)) {
        setShouldShow(false);
        return;
      }

      setShouldShow(true);

      const breadcrumbItems = [];

      pathSegments.forEach((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join("/")}`;

        if (segment === "invest") return;

        if (index > 0 && pathSegments[index - 1] === "invest") {
          const productId = segment;
          const productName = getProductName(productId);

          breadcrumbItems.push({
            label: "Invest",
            path: referringRoute || "/",
            isSpecial: true,
          });

          breadcrumbItems.push({
            label: productName,
            path,
          });

          return;
        }

        let label =
          routeNameMap[segment] ||
          segment.charAt(0).toUpperCase() + segment.slice(1);

        if (
          index > 0 &&
          pathSegments[index - 1] === "portfolio" &&
          !routeNameMap[segment]
        ) {
          label = segment.charAt(0).toUpperCase() + segment.slice(1);
        }

        breadcrumbItems.push({ label, path });
      });

      setBreadcrumbs(breadcrumbItems);
    };

    buildBreadcrumbs();
  }, [location, referringRoute]);

  // Do not render if not needed
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
