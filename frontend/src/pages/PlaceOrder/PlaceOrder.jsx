import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import "./PlaceOrder.css";
import { useNavigate } from "react-router-dom";

export default function PlaceOrder() {
  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext);

  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const placeorder = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      const orderItems = food_list
        .filter(item => cartItems[item._id] > 0)
        .map(item => ({
          _id: item._id,
          name: item.name,
          price: item.price,
          quantity: cartItems[item._id],
        }));

      const orderData = {
        address: data,
        items: orderItems,
        amount: getTotalCartAmount() + 2,
      };

      const response = await axios.post(
        `${url}/api/order/place`,
        orderData,
        { headers: { token } }
      );

      if (response.data.success) {
        // redirect to Stripe checkout
        window.location.href = response.data.session_url;
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Order failed");
    }
  };
const navigate=useNavigate();
useEffect(()=>{
  if(!token){
    navigate('/cart');

  }
  else if(getTotalCartAmount()===0){
    navigate('/cart');
  }

},[token])
  return (
    <form onSubmit={placeorder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        <div className="multi-fields">
          <input required name="firstname" onChange={onChangeHandler} placeholder="First Name" />
          <input required name="lastname" onChange={onChangeHandler} placeholder="Last Name" />
        </div>

        <input required name="email" onChange={onChangeHandler} placeholder="Email" />
        <input required name="street" onChange={onChangeHandler} placeholder="Street" />

        <div className="multi-fields">
          <input required name="city" onChange={onChangeHandler} placeholder="City" />
          <input required name="state" onChange={onChangeHandler} placeholder="State" />
        </div>

        <div className="multi-fields">
          <input required name="zipcode" onChange={onChangeHandler} placeholder="Zip code" />
          <input required name="country" onChange={onChangeHandler} placeholder="Country" />
        </div>

        <input required name="phone" onChange={onChangeHandler} placeholder="Phone" />
      </div>

      <div className="cart-total">
        <h2>Cart Totals</h2>
        <p>Subtotal: ${getTotalCartAmount()}</p>
        <p>Delivery: $2</p>
        <b>Total: ${getTotalCartAmount() + 2}</b>
        <button type="submit">PROCEED TO PAYMENT</button>
      </div>
    </form>
  );
}
