import { useState } from "react";

import HeaderText from "../components/HeaderText";
import { sendMessageToClientManager } from "../api";
import { toast } from "sonner";
import SmallLoadingSpinner from "../components/SmallLoadingSpinner";
import { Colors } from "../constants/Colors";

const ContactRelationShipManager = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const response = await sendMessageToClientManager(text);
    if (response) {
      toast.success("Message successfully sent");
      setText("");
    }
    setLoading(false);
  };

  return (
    <div className="h-full w-full">
      <HeaderText>Contact Account Manager</HeaderText>

      <div className="">
        <textarea
          id="textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write out a detailed message..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary resize-vertical"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-primary text-white w-full py-3 px-4 mt-5 rounded-md hover:bg-light-primary focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors"
      >
        {loading ? (
          <SmallLoadingSpinner color={Colors.white} />
        ) : (
          "Send Message"
        )}
      </button>
    </div>
  );
};

export default ContactRelationShipManager;
