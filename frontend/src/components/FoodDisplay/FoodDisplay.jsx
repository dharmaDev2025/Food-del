import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

export default function FoodDisplay({ category }) {
  const { food_list } = useContext(StoreContext)

  // Filtered food items based on category
  const filteredFood = food_list.filter(
    (item) => item._id && (category === "All" || category === item.category)
  )

  return (
    <div className='food-display' id='food-display'>
      <h2>Top dishes near you</h2>

      <div className='food-display-list'>
        {filteredFood.length === 0 && <p>No food items found</p>}

        {filteredFood.map((item) => (
          <FoodItem
            key={item._id}
            _id={item._id}
            name={item.name}
            description={item.description}
            price={item.price}
            image={item.image}
          />
        ))}
      </div>
    </div>
  )
}
