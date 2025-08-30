import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// 🔹 Fetch products with pagination (limit + offset)
export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async ({ limit = 8, offset = 0 }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${VITE_BACKEND_URL}products?limit=${limit}&offset=${offset}`
      );
      return res.data; // { products, total }
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// 🔹 Fetch single product by ID
export const fetchProductById = createAsyncThunk(
  "product/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${VITE_BACKEND_URL}products/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],   // list of products (paged)
    total: 0,       // total count from backend
    product: null,  // single product details
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetProducts: (state) => {
      state.products = [];
      state.product = null;
      state.total = 0;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    // 🔹 All products (with pagination)
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;

        // ✅ Append new products instead of replacing
        state.products = [...state.products, ...action.payload.products];
        state.total = action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // 🔹 Single product
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetProducts } = productSlice.actions;
export default productSlice.reducer;
