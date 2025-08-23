import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api";

// Add to Cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ product_id, quantity }, { rejectWithValue }) => {
    try {
      debugger;
      const res = await api.post("cart", { product_id, quantity });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Error adding to cart");
    }
  }
);

// Fetch Cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("cart");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Error fetching cart");
    }
  }
);

// Update Cart Item
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      const res = await api.put(`cart/${id}`, { quantity });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Error updating cart");
    }
  }
);

// Remove Cart Item
export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.delete(`cart/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Error removing item");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // -------- Add --------
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.items = action.payload;
        } else {
          const newItem = action.payload;
          const index = state.items.findIndex((i) => i.id === newItem.id);
          if (index !== -1) {
            state.items[index] = newItem;
          } else {
            state.items.push(newItem);
          }
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -------- Fetch --------
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload)
          ? action.payload
          : action.payload.items || [];
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -------- Update --------
      .addCase(updateCartItem.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          state.items = action.payload;
        } else {
          const updatedItem = action.payload;
          const index = state.items.findIndex((i) => i.id === updatedItem.id);
          if (index !== -1) {
            state.items[index] = updatedItem;
          }
        }
      })

      // -------- Remove --------
      .addCase(removeCartItem.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          state.items = action.payload;
        } else {
          const removedId = action.payload.id;
          state.items = state.items.filter((i) => i.id !== removedId);
        }
      });
  },
});

export default cartSlice.reducer;
