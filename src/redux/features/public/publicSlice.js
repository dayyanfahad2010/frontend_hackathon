import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { fetchPublicAsset, reportPublicIssue } from "./publicThunk";

const initialState = {
    asset: null,
    reportedIssue: null,
    loading: false,
    submitting: false,
    error: null,
    message: null,
};

const publicSlice = createSlice({
    name: "public",
    initialState,
    reducers: {
        clearPublicState: (state) => {
            state.error = null;
            state.message = null;
        },
        resetReportedIssue: (state) => {
            state.reportedIssue = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPublicAsset.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPublicAsset.fulfilled, (state, action) => {
                state.loading = false;
                state.asset = action.payload?.data || action.payload;
            })
            .addCase(fetchPublicAsset.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.error.message;
            })

            .addCase(reportPublicIssue.pending, (state) => {
                state.submitting = true;
                state.error = null;
                state.message = null;
            })
            .addCase(reportPublicIssue.fulfilled, (state, action) => {
                state.submitting = false;
                state.reportedIssue = action.payload?.data || action.payload;
                state.message = action.payload?.message || "Issue reported successfully";
            })
            .addCase(reportPublicIssue.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload?.message || action.error.message;
            });
    },
});

export const { clearPublicState, resetReportedIssue } = publicSlice.actions;
export default publicSlice.reducer;
