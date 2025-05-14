import { useState } from "react";

import HeaderText from "../components/HeaderText";
import SmallLoadingSpinner from "../components/SmallLoadingSpinner";
import { toast } from "sonner";
import { sendMessageToClientManager } from "../api";

const ContactRelationShipManager = () => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await sendMessageToClientManager(message);
      if (response) {
        toast.success("Message sent successfully!");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full w-full">
      <HeaderText>Contact Account Manager</HeaderText>

      <div>
        <textarea
          id="complaint"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={4}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          placeholder="Please describe your message in detail..."
        />

        <button
          type="submit"
          className="bg-primary w-full text-white py-2 px-4 rounded-md hover:bg-lightPrimary transition-colors mt-6"
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? (
            <SmallLoadingSpinner color={Colors.white} />
          ) : (
            "Send Message"
          )}
        </button>
      </div>
    </div>
  );
};

export default ContactRelationShipManager;
