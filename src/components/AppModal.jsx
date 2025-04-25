import React from "react";
import { CloseCircle } from "iconsax-react";
import { Colors } from "../constants/Colors";

const AppModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-black opacity-55"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* This element centers the modal content */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        {/* Modal panel */}
        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl z-50 relative sm:my-8 sm:align-middle sm:max-w-lg sm:w-full md:max-w-xl lg:max-w-2xl w-full">
          <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3
                  className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center pb-[5px]"
                  id="modal-title"
                >
                  {title}
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
                    aria-label="Close"
                  >
                    <CloseCircle
                      size={24}
                      color={Colors.black}
                    />
                  </button>
                </h3>
                <hr />
                <div className="mt-2">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppModal;
