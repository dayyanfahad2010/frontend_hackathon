import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/api";

export const fetchIssues = createAsyncThunk(
    "issues/fetchAll",
    async (params, thunkAPI) => {
        try {
            const response = await api.get("/issue", { params });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
);

export const fetchIssueById = createAsyncThunk(
    "issues/fetchOne",
    async (id, thunkAPI) => {
        try {
            const response = await api.get(`/issue/${id}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
);

export const fetchMyIssues = createAsyncThunk(
    "issues/fetchMine",
    async (_, thunkAPI) => {
        try {
            const response = await api.get("/issue/technician/me");
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
);

export const assignIssue = createAsyncThunk(
    "issues/assign",
    async ({ id, technicianId }, thunkAPI) => {
        try {
            const response = await api.patch(`/issue/${id}/assign`, { technicianId });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
);

export const updateIssueStatus = createAsyncThunk(
    "issues/updateStatus",
    async ({ id, status }, thunkAPI) => {
        try {
            const response = await api.patch(`/issue/${id}/status`, { status });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
);
