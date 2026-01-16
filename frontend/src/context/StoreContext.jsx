import { createContext, useEffect, useState } from "react"
import axios from "axios"

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({})
  const [food_list, setFoodList] = useState([])
  const [token, setToken] = useState("")
  const url = "http://localhost:4000"

  // Add item to cart safely
  const addToCart = async (itemId) => {
    if (!itemId) return // safety check

    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] ? prev[itemId] + 1 : 1
    }))

    if (token) {
      try {
        await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } })
      } catch (error) {
        console.error("Add to cart failed:", error)
      }
    }
  }

  // Remove item from cart safely
  const removeFromCart = async (itemId) => {
    if (!itemId || !cartItems[itemId]) return // safety check

    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] - 1
    }))

    if (token) {
      try {
        await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } })
      } catch (error) {
        console.error("Remove from cart failed:", error)
      }
    }
  }

  // Calculate total cart amount
  const getTotalCartAmount = () => {
    let totalAmount = 0
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = food_list.find((product) => product._id === item)
        if (itemInfo) totalAmount += itemInfo.price * cartItems[item]
      }
    }
    return totalAmount
  }

  // Fetch food list from backend
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list")
      setFoodList(response.data.data || [])
    } catch (error) {
      console.error("Fetch food list failed:", error)
      setFoodList([])
    }
  }

  // Load cart data for logged-in user
  const loadCartData = async (token) => {
    try {
      const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } })
      setCartItems(response.data.cartData || {})
    } catch (error) {
      console.error("Load cart data failed:", error)
      setCartItems({})
    }
  }

  // Load food list and cart on mount
  useEffect(() => {
    async function loadData() {
      await fetchFoodList()
      const storedToken = localStorage.getItem("token")
      if (storedToken) {
        setToken(storedToken)
        await loadCartData(storedToken)
      }
    }
    loadData()
  }, [])

  const contextValue = {
    food_list,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken
  }

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  )
}

export default StoreContextProvider
