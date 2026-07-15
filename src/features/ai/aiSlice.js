import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "@/api/axiosClient";

export const runIssueTriage = createAsyncThunk(
  "ai/runIssueTriage",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post("/ai/triage", payload);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const runMaintenanceSummary = createAsyncThunk(
  "ai/runMaintenanceSummary",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post("/ai/maintenance-summary", payload);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  triage: null,
  triageStatus: "idle", // idle | loading | succeeded | failed
  triageError: null,
  summary: null,
  summaryStatus: "idle",
  summaryError: null,
};

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    clearTriage(state) {
      state.triage = null;
      state.triageStatus = "idle";
      state.triageError = null;
    },
    clearSummary(state) {
      state.summary = null;
      state.summaryStatus = "idle";
      state.summaryError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(runIssueTriage.pending, (state) => {
        state.triageStatus = "loading";
        state.triageError = null;
      })
      .addCase(runIssueTriage.fulfilled, (state, action) => {
        state.triageStatus = "succeeded";
        state.triage = action.payload;
      })
      .addCase(runIssueTriage.rejected, (state, action) => {
        state.triageStatus = "failed";
        state.triageError = action.payload;
      })

      .addCase(runMaintenanceSummary.pending, (state) => {
        state.summaryStatus = "loading";
        state.summaryError = null;
      })
      .addCase(runMaintenanceSummary.fulfilled, (state, action) => {
        state.summaryStatus = "succeeded";
        state.summary = action.payload.summary;
      })
      .addCase(runMaintenanceSummary.rejected, (state, action) => {
        state.summaryStatus = "failed";
        state.summaryError = action.payload;
      });
  },
});

export const { clearTriage, clearSummary } = aiSlice.actions;
export default aiSlice.reducer;
