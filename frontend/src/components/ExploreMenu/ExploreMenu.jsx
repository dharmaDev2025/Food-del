import React from 'react'
import './ExploreMenu.css'
import { menu_list } from '../../assets/assets'
export default function ExploreMenu( {category,setCategory}) {
  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Explore our menu</h1>
      <p className='explore-menu-text'> Choose from a diverse menu featuring a dectable array of odisha.Our mission is to satisfy your cravings abd elevate your dining experience.one delicious meal at a atime</p>
      <div className="explore-menu-list-item">
        {menu_list.map((item,index)=>{
          return(
            <div onClick={()=>setCategory(prev=>prev===item.menu_name?"All":item.menu_name)} key={index} className="explore-menu-item">
              <img className={category===item.menu_name?"active":""} src={item.menu_image} alt=""/>
              <p>{item.menu_name}</p>
            </div>
          )
        })}
      </div>
      <hr/>

      
    </div>
  )
}
