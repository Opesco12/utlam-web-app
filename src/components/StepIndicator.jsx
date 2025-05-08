import { Colors } from "../constants/Colors";

const StepIndicator = ({ currentStep }) => {
  return (
    <div className="flex justify-center items-center my-6">
      <div className="flex items-center">
        {/* Step 1 Circle */}
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full ${
            currentStep === 1
              ? "bg-primary text-white"
              : "bg-primary text-white"
          }`}
        >
          1
        </div>

        {/* Connecting Line */}
        <div
          className="w-16 h-1 mx-2"
          style={{
            backgroundColor: currentStep === 2 ? Colors.primary : "#D1D5DB",
          }}
        ></div>

        {/* Step 2 Circle */}
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full ${
            currentStep === 2
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          2
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
