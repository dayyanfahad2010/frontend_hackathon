import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/api";

export const login = createAsyncThunk(
    "auth/login",
    async (data, thunkAPI) => {
        try {
            const response = await api.post("/auth/login", data);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data
            )
        }
    }
)
export const signup = createAsyncThunk(
    "auth/signup",
    async (data, thunkAPI) => {
        try {
            const response = await api.post("/auth/signup", data);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data
            )
        }
    }
)
export const forgotPassword = createAsyncThunk(
    "auth/forgot-password",
    async (data, thunkAPI) => {
        try {
            const response = await api.post("/auth/forgot-password", data);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data
            )
        }
    }
)
export const resetPassword = createAsyncThunk(
    "auth/reset-password",
    async (data, thunkAPI) => {
        try {
            const response = await api.post("/auth/reset-password", data);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data
            )
        }
    }
)
export const logout = createAsyncThunk(
    "auth/logout",
    async (_, thunkAPI) => {
        try {
            const response = await api.post("/auth/logout");
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data
            )
        }
    }
)