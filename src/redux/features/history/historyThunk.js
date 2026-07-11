import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/api";

export const fetchAssetHistory = createAsyncThunk(
    "history/fetchByAsset",
    async (assetId, thunkAPI) => {
        try {
            const response = await api.get(`/history/${assetId}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
);

// Org-wide activity feed across all assets — used on the Admin History page.
export const fetchAllHistory = createAsyncThunk(
    "history/fetchAll",
    async (params, thunkAPI) => {
        try {
            const response = await api.get("/history", { params });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
);

