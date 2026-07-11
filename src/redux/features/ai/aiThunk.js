import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/api";

export const runAiTriage = createAsyncThunk(
    "ai/triage",
    async (data, thunkAPI) => {
        try {
            const response = await api.post("/ai/triage", data);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
);

export const generateMaintenanceSummary = createAsyncThunk(
    "ai/maintenanceSummary",
    async (data, thunkAPI) => {
        try {
            const response = await api.post("/ai/maintenance-summary", data);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
);
