import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { runAiTriage, generateMaintenanceSummary } from "./aiThunk";

const initialState = {
    triageResult: null,
    summaryResult: null,
    loading: false,
    error: null,
};

const aiSlice = createSlice({
    name: "ai",
    initialState,
    reducers: {
        clearAiState: (state) => {
            state.error = null;
        },
        clearTriageResult: (state) => {
            state.triageResult = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(runAiTriage.fulfilled, (state, action) => {
                state.loading = false;
                state.triageResult = action.payload?.data || action.payload;
            })
            .addCase(generateMaintenanceSummary.fulfilled, (state, action) => {
                state.loading = false;
                state.summaryResult = action.payload?.data || action.payload;
            })
            .addMatcher(
                isAnyOf(runAiTriage.pending, generateMaintenanceSummary.pending),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                isAnyOf(runAiTriage.rejected, generateMaintenanceSummary.rejected),
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload?.message || action.error.message;
                }
            );
    },
});

export const { clearAiState, clearTriageResult } = aiSlice.actions;
export default aiSlice.reducer;
