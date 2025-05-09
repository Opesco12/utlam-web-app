import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as _ from "lodash";

import HeaderText from "../components/HeaderText";
import ContentBox from "../components/ContentBox";
import StyledText from "../components/StyledText";
import { Colors } from "../constants/Colors";
import LargeLoadingSpinner from "../components/LargeLoadingSpinner";

import { amountFormatter } from "../helperFunctions/amountFormatter";
import { getMutualFundStatement, getProducts } from "../api";

const MutualFundStatement = () => {
  const [loading, setLoading] = useState(false);
  const [statement, setStatement] = useState([]);
  const navigate = useNavigate();
  const { portfolioName } = useParams();
  const location = useLocation();
  const balance = location.state.balance;

  const findProduct = async () => {
    setLoading(true);

    const products = await getProducts();

    const foundProduct = await products?.find(
      (p) => _.kebabCase(p?.portfolioName) === portfolioName
    );

    if (!foundProduct) {
      navigate("/404", { replace: true });
    } else {
      console.log(foundProduct);
      const statement = await getMutualFundStatement(foundProduct?.portfolioId);
      console.log(statement.object);
      setStatement(statement?.object);
    }

    setLoading(false);
  };
  useEffect(() => {
    findProduct();
  }, []);

  if (loading) {
    return (
      <div className="h-[100vh] flex items-center justify-center">
        <LargeLoadingSpinner color={Colors.lightPrimary} />
      </div>
    );
  }

  return (
    <div>
      <HeaderText>Mutual fund statement</HeaderText>

      <ContentBox>
        {statement?.length > 0 &&
          statement.slice(0, -1).map((transaction, index) => (
            <StatementItem
              statement={transaction}
              key={index}
            />
          ))}
        <StatementItem
          statement={{ ...statement[statement.length - 1], amount: balance }}
        />
      </ContentBox>
    </div>
  );
};

export default MutualFundStatement;

const StatementItem = ({ statement }) => {
  const date = new Date(statement?.transDate).toDateString();
  return (
    <div className="flex justify-between py-[15px] border-b border-gray-300">
      <div className="flex flex-col">
        <StyledText
          variant="semibold"
          color={Colors.primary}
          className="block"
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "70%",
            display: "inline-block",
          }}
        >
          {statement?.narration}
        </StyledText>
        <StyledText color={Colors.light}>{`${
          statement?.units ? statement?.units : 0
        } units @ ${amountFormatter.format(statement?.price)}`}</StyledText>
      </div>
      <div className="flex flex-col items-end">
        <StyledText
          type="label"
          color={Colors.light}
        >
          {date && date}
        </StyledText>
        <StyledText
          variant="semibold"
          color={Colors.primary}
        >
          {amountFormatter.format(statement?.amount ? statement?.amount : 0)}
        </StyledText>
      </div>
    </div>
  );
};
