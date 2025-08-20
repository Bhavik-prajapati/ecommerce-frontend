import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api";

export const userSlice = createAsyncThunk(
    "users/profie",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get(user / profile);
            return res.data;
        } catch (error) {
            return rejectWithValue(err.response?.data?.error || err.message);
        }
    }
)

const userSlice=createSlice({
    name:"user",
    initialState:{
        user:null,
        loading:false,
        error:null
    },
    reducers:
})
