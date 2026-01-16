import React, { useEffect, useState } from "react";
import "./Orders.css";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list");
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Failed to load orders");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };
 const statusHandler=async(event,orderId)=>{
  const response =await axios.post(url+"/api/order/status",{
    orderId,status:event.target.value
  })
  if(response.data.success){
    await fetchAllOrders();
  }

 }
  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="orders-page">
      <h2>Order Page</h2>

      {orders.map((order) => (
        <div className="order-card" key={order._id}>

          {/* LEFT ICON */}
          <div className="order-icon">
            <img src={assets.parcel_icon} alt="parcel" />
          </div>

          {/* ORDER DETAILS */}
          <div className="order-details">
            <p className="order-items">
              {order.items
                .map(item => `${item.name} x ${item.quantity}`)
                .join(", ")}
            </p>

            <div className="order-address">
              <p>{order.address.street}</p>
              <p>
                {order.address.city}, {order.address.state},{" "}
                {order.address.country} {order.address.zipcode}
              </p>
              <p>{order.address.phone}</p>
            </div>
          </div>

          {/* ORDER META */}
          <div className="order-meta">
            <p><b>Items:</b> {order.items.length}</p>
            <p><b>${order.amount}</b></p>

            <select onChange={(event)=>statusHandler(event,order._id)} value={order.status} >

              <option>Food Processing</option>
              <option>Out for delivery</option>
              <option>Delivered</option>
            </select>
          </div>

        </div>
      ))}
    </div>
  );
};

export default Orders;
