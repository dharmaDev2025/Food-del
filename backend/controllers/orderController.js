import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Place Order
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5174";

  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Save order in DB with payment default false
    const newOrder = new orderModel({
      userId: req.user.id,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      payment: false,
    });
    await newOrder.save();

    // Clear user's cart
    await userModel.findByIdAndUpdate(req.user.id, { cartData: {} });

    // Stripe line items (USD)
    const line_items = req.body.items.map(item => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: Math.round((item.price / 80) * 100), // Convert INR to USD
      },
      quantity: item.quantity,
    }));

    // Delivery charge
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Delivery Charges" },
        unit_amount: Math.round((2 / 80) * 100),
      },
      quantity: 1,
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      client_reference_id: newOrder._id.toString(),
      success_url: `${frontend_url}/verify?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontend_url}/verify?session_id={CHECKOUT_SESSION_ID}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("PLACE ORDER ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify payment
const verifyOrder = async (req, res) => {
  const { session_id } = req.body;
  if (!session_id)
    return res.status(400).json({ success: false, message: "Missing session_id" });

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      // Update order payment to true
      await orderModel.findByIdAndUpdate(session.client_reference_id, { payment: true });
      return res.json({ success: true, message: "Payment succeeded" });
    } else {
      // Delete order if payment failed
      await orderModel.findByIdAndDelete(session.client_reference_id);
      return res.json({ success: false, message: "Payment failed" });
    }
  } catch (error) {
    console.error("VERIFY ORDER ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Fetch user's orders
const userOrders = async (req, res) => {
  try {
    const userId = req.user.id; // get from auth middleware
    const orders = await orderModel.find({ userId }).sort({ date: -1 }); // latest orders first
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log("USER ORDERS ERROR:", error);
    res.json({ success: false, message: "Error fetching orders" });
  }
};

//Listing orders for admin pannel
const listOrders=async(req,res)=>{
  try{
    const orders=await orderModel.find({});
    res.json({success:true,data:orders});



  }
  catch(error){
    console.log(error);
    res.json({success:false,message:"Error"})

  }
}

const updateStatus=async(req,res)=>{
  try{
    await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
    res.json({success:true,})

  }catch(error){
    console.log(error);
    res.json({success:false,message:"Error"});
    
  }

}

export { placeOrder, verifyOrder, userOrders,listOrders ,updateStatus};
