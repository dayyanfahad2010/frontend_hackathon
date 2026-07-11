import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/api";

export const fetchAssets = createAsyncThunk(
    "asset/fetchAll",
    async (params, thunkAPI) => {
        try {
            const response = await api.get("/asset", { params });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
);

export const fetchAssetById = createAsyncThunk(
    "asset/fetchOne",
    async (id, thunkAPI) => {
        try {
            const response = await api.get(`/asset/${id}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
);

export const createAsset = createAsyncThunk(
    "asset/create",
    async (data, thunkAPI) => {
        try {
            const response = await api.post("/asset", data);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
);

export const updateAsset = createAsyncThunk(
    "asset/update",
    async ({ id, data }, thunkAPI) => {
        try {
            const response = await api.patch(`/asset/${id}`, data);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
);

export const deleteAsset = createAsyncThunk(
    "asset/delete",
    async (id, thunkAPI) => {
        try {
            const response = await api.delete(`/asset/${id}`);
            return { id, ...response.data };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
);
