import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/api";

export const fetchPublicAsset = createAsyncThunk(
    "public/fetchAsset",
    async (assetCode, thunkAPI) => {
        try {
            const response = await api.get(`/public/assets/${assetCode}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
);

export const reportPublicIssue = createAsyncThunk(
    "public/reportIssue",
    async ({ assetCode, data }, thunkAPI) => {
        try {
            const response = await api.post(`/public/assets/${assetCode}/report`, data);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
);
