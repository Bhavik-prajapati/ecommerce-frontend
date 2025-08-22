// src/store/shippingSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api"; // <-- your axios instance with baseURL & auth token

// ✅ Add Shipping Address
export const addShippingAddress = createAsyncThunk(
  "api/shipping",
  async (addressData, { rejectWithValue }) => {
    try {
      const res = await api.post("shipping", addressData);
      return res.data.address;
    } catch (err) { 
      return rejectWithValue(err.response?.data?.message || "Failed to add address");
    }
  }
);

// ✅ Get Shipping Addresses
export const getShippingAddresses = createAsyncThunk(
  "api/getshipping",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("shipping");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch addresses");
    }
  }
);

const shippingSlice = createSlice({
  name: "shipping",
  initialState: {
    addresses: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Add Shipping
    builder
      .addCase(addShippingAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addShippingAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses.push(action.payload);
      })
      .addCase(addShippingAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Shipping
    builder
      .addCase(getShippingAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getShippingAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(getShippingAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default shippingSlice.reducer;
