import React, { useContext, useEffect, useState } from 'react';
import "./MyOrders.css";
import axios from "axios";
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { token } }
      );
      setData(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error("Fetch orders error:", error);
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>

      <div className="container">
        {data.length === 0 && <p>No orders found</p>}

        {data.map((order) => (
          <div className="my-orders-order" key={order._id}>
            <img src={assets.parcel_icon} alt="Order" />

            <p>
              {order.items
                .map(item => `${item.name} X${item.quantity}`)
                .join(", ")}
            </p>

            <p>Total: ${order.amount}</p>
            <p>Items: {order.items.length}</p>
            <p>Status: {order.status}</p>
            <p>Payment: {order.payment ? "Paid ✅" : "Pending ❌"}</p>

            {/* Track Order Button */}
            <button className="track-btn" onClick={fetchOrders}>
              Track Order
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
