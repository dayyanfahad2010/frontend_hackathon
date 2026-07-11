import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/api";

export const fetchAdminSummary = createAsyncThunk(
    "dashboard/adminSummary",
    async (_, thunkAPI) => {
        try {
            const response = await api.get("/dashboard/admin/summary");
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
);

export const fetchTechnicianSummary = createAsyncThunk(
    "dashboard/technicianSummary",
    async (_, thunkAPI) => {
        try {
            const response = await api.get("/dashboard/technician/summary");
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
);
