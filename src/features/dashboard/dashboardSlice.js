import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "@/api/axiosClient";

export const fetchAdminSummary = createAsyncThunk(
  "dashboard/fetchAdminSummary",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get("/dashboard/admin/summary");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchTechnicianSummary = createAsyncThunk(
  "dashboard/fetchTechnicianSummary",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get("/dashboard/technician/summary");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  adminSummary: null,
  technicianSummary: null,
  status: "idle",
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminSummary.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAdminSummary.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.adminSummary = action.payload;
      })
      .addCase(fetchAdminSummary.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(fetchTechnicianSummary.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTechnicianSummary.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.technicianSummary = action.payload;
      })
      .addCase(fetchTechnicianSummary.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
