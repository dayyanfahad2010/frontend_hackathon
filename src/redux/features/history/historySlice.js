import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { fetchAssetHistory, fetchAllHistory } from "./historyThunk";

const initialState = {
    items: [],
    allItems: [],
    loading: false,
    error: null,
};

const historySlice = createSlice({
    name: "history",
    initialState,
    reducers: {
        clearHistoryState: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAssetHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload?.data || action.payload || [];
            })
            .addCase(fetchAllHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.allItems = action.payload?.data || action.payload || [];
            })
            .addMatcher(
                isAnyOf(fetchAssetHistory.pending, fetchAllHistory.pending),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                isAnyOf(fetchAssetHistory.rejected, fetchAllHistory.rejected),
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload?.message || action.error.message;
                }
            );
    },
});

export const { clearHistoryState } = historySlice.actions;
export default historySlice.reducer;
