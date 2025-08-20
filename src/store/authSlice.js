import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiwithoutauth from "./apiwithoutauth";
import api from "./api";

// ========== THUNKS ==========

export const fetchUserProfile = createAsyncThunk(
  "user/profile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("users/profile");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);


export const signupUser = createAsyncThunk(
  "auth/register",
  async (userdata, { rejectWithValue }) => {
    try {
      const res = await apiwithoutauth.post('auth/register',userdata);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (userdata, { rejectWithValue }) => {
    try {
      const res = await apiwithoutauth.post(
        "http://localhost:5000/api/auth/login",
        userdata,
        { headers: { "Content-Type": "application/json" } }
      );

      localStorage.setItem("accessToken", res.data.accessToken);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// ========== SLICE ==========
const authSlice = createSlice({
  name: "auth",
  initialState: {
    signup: { user: null, loading: false, error: null },
    login: { user: null, loading: false, error: null },
    token: localStorage.getItem("accessToken") || null,
    profile: { data: null, loading: false, error: null },
  },
  reducers: {
    logout: (state) => {
      state.signup.user = null;
      state.signup.error = null;
      state.signup.loading = false;

      state.login.user = null;
      state.login.error = null;
      state.login.loading = false;
      localStorage.removeItem("accessToken"); 

      state.profile = { data: null, loading: false, error: null };

    },
  },
  extraReducers: (builder) => {
    // ✅ SIGNUP
    builder
      .addCase(signupUser.pending, (state) => {
        state.signup.loading = true;
        state.signup.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.signup.loading = false;
        state.signup.user = action.payload;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.signup.loading = false;
        state.signup.error = action.payload;
      });
      
    builder
      .addCase(loginUser.pending, (state) => {
        state.login.loading = true;
        state.login.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.login.loading = false;
        state.login.user = action.payload;
        state.token = action.payload.accessToken; 
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.login.loading = false;
        state.login.error = action.payload;
      });

       builder.addCase(fetchUserProfile.pending, (state) => {
        state.profile.loading = true;
        state.profile.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profile.data = action.payload;
        state.profile.loading = false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.profile.loading = false;
        state.profile.error = action.payload;
      })
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
