import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import productReducer from "./productSlice";
import cartReducer from "./cartSlice";
import shippingReducer from "./shippingSlice";
import orderReducer from "./orderSlice";


const store=configureStore({
    reducer:{
        auth:authReducer,
        product:productReducer,
        cart: cartReducer,
        shipping:shippingReducer,
        order: orderReducer
    }
})

export default store;