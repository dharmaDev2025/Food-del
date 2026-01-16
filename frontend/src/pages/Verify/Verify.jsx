import { useNavigate, useSearchParams } from "react-router-dom";
import "./Verify.css";
import React, { useContext, useEffect } from 'react';
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const session_id = searchParams.get("session_id");

  const { url } = useContext(StoreContext);
  const navigate = useNavigate();

  const verifyPayment = async () => {
    if (!session_id) {
      console.warn("No session_id found");
      navigate("/");
      return;
    }

    try {
      const response = await axios.post(url + "/api/order/verify", { session_id });
      console.log("Verify response:", response.data);

      if (response.data.success) {
        navigate("/myorders");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("VERIFY ERROR:", error);
      navigate("/");
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []);

  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
