import React, { useState } from "react";
import { X } from "lucide-react";
import { amountFormatter } from "../helperFunctions/amountFormatter";

export default function TransactionSummaryModal({
  isOpen,
  onClose,
  transaction,
}) {
  if (!isOpen) return null;
  const date = new Date(transaction?.valueDate).toDateString();
  return (
    <div className="fixed inset-0 bg-gray-900/40 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-md w-full max-w-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-medium text-gray-800 mb-6">
          Transaction Summary
        </h2>

        <div className="space-y-4">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Portfolio:</span>
            <span className="font-medium">{transaction?.portfolio}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Amount:</span>
            <span className="font-medium">
              {amountFormatter.format(
                transaction?.amount || transaction?.netAmount
              )}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500 mr-2">Description:</span>
            <span className="font-medium">{transaction?.description}</span>
          </div>
          {transaction?.schemeId && (
            <>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 mr-2">
                  Beneficiary Account Number:
                </span>
                <span className="font-medium">
                  {transaction?.beneficiaryAccountNo}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 mr-2">Benficiary Name:</span>
                <span className="font-medium">
                  {transaction?.beneficiaryName}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 mr-2">Reference Number:</span>
                <span className="font-medium">{transaction?.referenceNo}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 mr-2">Status:</span>
                <span className="font-medium">{transaction?.status}</span>
              </div>
            </>
          )}

          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Date:</span>
            <span className="font-medium">{date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
