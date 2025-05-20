import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MonthYearSelector from "../components/MonthYearSelector";
import Pagination from "../components/Pagination";
import StyledText from "../components/StyledText";
import LargeLoadingSpinner from "../components/LargeLoadingSpinner";
import { amountFormatter } from "../helperFunctions/amountFormatter";
import { Colors } from "../constants/Colors";

import { getTransactions, getPendingWithdrawals } from "../api";
import HeaderText from "../components/HeaderText";
import TransactionSummaryModal from "../components/TransactionSummaryModal";

const Tab = ({ active, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 rounded-md py-1 font-medium ${
        active ? `bg-white text-primary` : `text-gray-500 hover:text-gray-700`
      } transition-colors`}
    >
      {children}
    </button>
  );
};

const Transactions = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [startdate, setStartdate] = useState(null);
  const [enddate, setEnddate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [activeTab, setActiveTab] = useState("transactions");

  useEffect(() => {
    const currentDate = new Date();
    handleMonthYearChange(
      currentDate.getMonth() + 1,
      currentDate.getFullYear()
    );
  }, []);

  const fetchTransactionsForDateRange = async (start, end) => {
    try {
      const allTransactions = await getTransactions(start, end);
      setTotalPages(Math.ceil(allTransactions.length / itemsPerPage));

      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedTransactions = allTransactions?.slice(
        startIndex,
        endIndex
      );
      setTransactions(paginatedTransactions);

      const pendingTransactions = await getPendingWithdrawals();
      setPendingWithdrawals(pendingTransactions);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
    setLoading(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchTransactionsForDateRange(startdate, enddate);
  };
  const handleMonthYearChange = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);
    end.setDate(end.getDate() - 1);

    const formattedStart = start.toISOString().split("T")[0];
    const formattedEnd = end.toISOString().split("T")[0];

    setStartdate(formattedStart);
    setEnddate(formattedEnd);
    setCurrentPage(1);
    fetchTransactionsForDateRange(formattedStart, formattedEnd);
  };

  if (loading) {
    return (
      <div className="h-[100vh] flex items-center justify-center">
        <LargeLoadingSpinner color={Colors.lightPrimary} />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <HeaderText>Transaction History</HeaderText>

      <div className="bg-gray-200 rounded-lg w-fit p-2 mb-5">
        <div className="flex">
          <Tab
            active={activeTab === "transactions"}
            onClick={() => setActiveTab("transactions")}
          >
            Transactions
          </Tab>
          <Tab
            active={activeTab === "pendingTransactions"}
            onClick={() => setActiveTab("pendingTransactions")}
          >
            Pending Transactions
          </Tab>
        </div>
      </div>

      {activeTab === "transactions" ? (
        <div className="flex-1 rounded-xl bg-white p-5 md:p-3 lg:p-5 shadow-md">
          <MonthYearSelector
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onChange={handleMonthYearChange}
          />
          <div className="">
            {transactions?.map((transaction, index) => (
              <TransactionItem
                transaction={transaction}
                key={index}
                onClick={() => {
                  setSelectedTransaction(transaction);
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      ) : (
        <div className="flex-1 rounded-xl bg-white p-5 md:p-3 lg:p-5 shadow-md">
          <div className="">
            {pendingWithdrawals?.map((transaction, index) => (
              <TransactionItem
                transaction={{ ...transaction, amount: transaction?.netAmount }}
                key={index}
                onClick={() => {
                  setSelectedTransaction(transaction);
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      )}

      <TransactionSummaryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transaction={selectedTransaction}
      />
    </div>
  );
};

const TransactionItem = ({ transaction, onClick }) => {
  const date = new Date(transaction?.valueDate).toDateString();
  const navigate = useNavigate();
  return (
    <div
      onClick={onClick}
      className="flex justify-between border-b border-gray-200 py-[15px]"
    >
      <div className="flex w-[60%] flex-col">
        <StyledText
          variant="medium"
          color={Colors.primary}
          className="block"
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
            display: "inline-block",
          }}
        >
          {`${transaction?.description} - ${
            transaction?.portfolio || transaction?.referenceNo
          }`}
        </StyledText>
        <StyledText
          type="label"
          color={Colors.light}
        >
          {date && date}
        </StyledText>
      </div>
      <div className="flex flex-col items-end">
        <StyledText
          variant="semibold"
          color={Colors.primary}
        >
          {amountFormatter.format(transaction?.amount)}
        </StyledText>
      </div>
    </div>
  );
};

export default Transactions;
