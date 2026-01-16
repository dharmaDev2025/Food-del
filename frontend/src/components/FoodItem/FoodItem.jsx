import React, { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'

const FoodItem = ({ _id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext)

  // safety check: do not render if _id is missing
  if (!_id) return null

  return (
    <div className='food-item'>
      <div className="food-item-img-container">
        <img
          className='food-item-image'
          src={image ? url + "/images/" + image : ""}
          alt={name || "food"}
        />

        {!cartItems?.[_id] ? (
          <img
            className='add'
            onClick={() => addToCart(_id)}
            src={assets.add_icon_white}
            alt="add"
          />
        ) : (
          <div className='food-item-counter'>
            <img
              onClick={() => removeFromCart(_id)}
              src={assets.remove_icon_red}
              alt="remove"
            />
            <p>{cartItems[_id]}</p>
            <img
              onClick={() => addToCart(_id)}
              src={assets.add_icon_green}
              alt="add"
            />
          </div>
        )}
      </div>

      <div className='food-item-info'>
        <div className="food-item-rating">
          <p>{name || "Item"}</p>
          <img src={assets.rating_starts} alt="rating" />
        </div>
        <p className='food-item-desc'>{description || ""}</p>
        <p className="food-item-price">${price ?? 0}</p>
      </div>
    </div>
  )
}

export default FoodItem
