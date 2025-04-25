import { useLocation, useNavigate } from "react-router-dom";

import ContentBox from "../components/ContentBox";
import HeaderText from "../components/HeaderText";
import { useEffect, useState } from "react";
import StyledText from "../components/StyledText";
import { amountFormatter } from "../helperFunctions/amountFormatter";
import { Colors } from "../constants/Colors";

const TransactionDetails = () => {
  const [transaction, setTransaction] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const transaction = location.state;
    console.log(transaction);
    setTransaction(transaction);

    if (!transaction) navigate("/transactions");
  }, []);

  const date = new Date(transaction?.valueDate).toDateString();
  return (
    <div>
      <HeaderText>Transaction Details</HeaderText>

      <ContentBox>
        <div className="flex items-center flex-col my-[20px]">
          <StyledText
            variant="semibold"
            type="title"
            className={"text-center"}
          >
            {transaction?.description}
          </StyledText>
          <StyledText
            variant="medium"
            color={Colors.light}
            className={"my-[10px]"}
          >
            {date}
          </StyledText>
          <br />
          <StyledText
            variant="medium"
            type="heading"
          >
            {amountFormatter.format(transaction?.amount)}
          </StyledText>
          <br />
          <StyledText variant="medium">{transaction?.portfolio}</StyledText>
        </div>
      </ContentBox>
    </div>
  );
};

export default TransactionDetails;
