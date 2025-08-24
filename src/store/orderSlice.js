import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api";

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.post("orders", orderData, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      return res.data; // { order, items }
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const getOrders = createAsyncThunk(
  "order/getOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("orders");
      return res.data; // list of orders
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    order: null, // last created order
    orders: [],  // list of all orders
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order; // save last created order
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload; // all orders list
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
