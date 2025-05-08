import { useEffect, useRef } from "react";
import axios from "axios";

const SmileIDCamera = ({ themeColor }) => {
  const cameraRef = useRef(null);

  const postContent = async (data) => {
    try {
      const response = await axios.post("http://192.168.50.42:4000/", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Response from server: ", response);
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  useEffect(() => {
    const smartCameraElement = cameraRef.current;

    if (!smartCameraElement) return;

    const handlePublish = async (e) => {
      try {
        const response = await postContent(e.detail);
        console.log(response);
      } catch (e) {
        console.error(e);
      }
    };

    smartCameraElement.addEventListener(
      "smart-camera-web.publish",
      handlePublish
    );

    return () => {
      smartCameraElement.removeEventListener(
        "smart-camera-web.publish",
        handlePublish
      );
    };
  }, []);

  return (
    <smart-camera-web
      ref={cameraRef}
      capture-id
      theme-color={themeColor}
    ></smart-camera-web>
  );
};

export default SmileIDCamera;
