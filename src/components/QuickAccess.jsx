import { StatusUp, FavoriteChart, ReceiptText, Reserve } from "iconsax-react";

import SmallContentBox from "./SmallContentBox";
import { Colors } from "../constants/Colors";

const QuickAccessItems = ({ navigate }) => {
  const quickAccessItems = [
    {
      icon: (
        <StatusUp
          variant="Bold"
          size={35}
          color={Colors.secondary}
        />
      ),
      title: "Mutual Funds",
      subtitle: "Grow your wealth with diverse investment options",
      navigateTo: "/invest/mutual_fund",
    },
    {
      icon: (
        <StatusUp
          variant="Bold"
          size={35}
          color={Colors.secondary}
        />
      ),
      title: "Fixed Income",
      subtitle: "Enjoy stable returns with predictable income.",
      navigateTo: "/invest/fixed_income",
    },
    {
      icon: (
        <FavoriteChart
          variant="Bold"
          size={35}
          color={Colors.secondary}
        />
      ),
      title: "My Portfolio",
      subtitle: "Track and manage your investment holdings",
      navigateTo: "/portfolio",
    },
    {
      icon: (
        <ReceiptText
          variant="Bold"
          size={35}
          color={Colors.secondary}
        />
      ),
      title: "My Transactions",
      subtitle: "View your account activity and financial history.",
      navigateTo: "/transactions",
    },
    {
      icon: (
        <Reserve
          variant="Bold"
          size={35}
          color={Colors.secondary}
        />
      ),
      title: "Help Desk",
      subtitle: "Get help from excellent customer care service",
      navigateTo: "/help",
    },
  ];

  return (
    <div className="grid gap-[15px] md:grid-cols-2">
      {quickAccessItems.map((item, index) => (
        <SmallContentBox
          key={index}
          icon={item.icon}
          title={item.title}
          subtitle={item.subtitle}
          navigateTo={item.navigateTo}
          navigate={navigate}
        />
      ))}
    </div>
  );
};

export default QuickAccessItems;
