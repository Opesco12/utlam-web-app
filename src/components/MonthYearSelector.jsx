import { useState } from "react";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MonthYearSelector = ({ selectedMonth, selectedYear, onChange }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 10 + i);

  return (
    <div className="mb-5 flex items-center space-x-4">
      {/* Month Selector */}
      <select
        className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:ring focus:ring-blue-300 focus:outline-none"
        value={selectedMonth}
        onChange={(e) => onChange(Number(e.target.value), selectedYear)}
      >
        {months.map((month, index) => (
          <option
            key={index}
            value={index + 1}
          >
            {month}
          </option>
        ))}
      </select>

      {/* Year Selector */}
      <select
        className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:ring focus:ring-blue-300 focus:outline-none"
        value={selectedYear}
        onChange={(e) => onChange(selectedMonth, Number(e.target.value))}
      >
        {years.map((year) => (
          <option
            key={year}
            value={year}
          >
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MonthYearSelector;
