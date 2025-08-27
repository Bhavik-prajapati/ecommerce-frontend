import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api";

export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await api.get(`reviews/${productId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message || "Failed to fetch reviews");
    }
  }
);

export const addReview = createAsyncThunk(
  "reviews/addReview",
  async ({ productId, rating, comment, token }, { rejectWithValue }) => {
    try {
      const res = await api.post(
        "reviews",
        { product_id: productId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.review;
    } catch (err) {
      return rejectWithValue(err.response.data.message || "Failed to add review");
    }
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(addReview.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default reviewSlice.reducer;
