import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/api";

export const createMaintenance = createAsyncThunk(
    "maintenance/create",
    async (data, thunkAPI) => {
        try {
            const response = await api.post("/maintenance", data);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
);

export const fetchMaintenanceByIssue = createAsyncThunk(
    "maintenance/fetchByIssue",
    async (issueId, thunkAPI) => {
        try {
            const response = await api.get(`/maintenance/${issueId}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
);

export const updateMaintenance = createAsyncThunk(
    "maintenance/update",
    async ({ id, data }, thunkAPI) => {
        try {
            const response = await api.patch(`/maintenance/${id}`, data);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
);
