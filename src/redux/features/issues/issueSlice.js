import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
    fetchIssues,
    fetchIssueById,
    fetchMyIssues,
    assignIssue,
    updateIssueStatus,
} from "./issueThunk";

const initialState = {
    items: [],
    myIssues: [],
    current: null,
    loading: false,
    actionLoading: false,
    error: null,
    message: null,
};

const getId = (i) => i?._id || i?.id;

const issueSlice = createSlice({
    name: "issues",
    initialState,
    reducers: {
        clearIssueState: (state) => {
            state.error = null;
            state.message = null;
        },
        clearCurrentIssue: (state) => {
            state.current = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchIssues.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload?.data || action.payload || [];
            })
            .addCase(fetchMyIssues.fulfilled, (state, action) => {
                state.loading = false;
                state.myIssues = action.payload?.data || action.payload || [];
            })
            .addCase(fetchIssueById.fulfilled, (state, action) => {
                state.loading = false;
                state.current = action.payload?.data || action.payload;
            })

            .addCase(assignIssue.fulfilled, (state, action) => {
                state.actionLoading = false;
                const updated = action.payload?.data || action.payload;
                if (updated) {
                    state.current = updated;
                    const idx = state.items.findIndex((i) => getId(i) === getId(updated));
                    if (idx !== -1) state.items[idx] = updated;
                }
                state.message = action.payload?.message || "Technician assigned successfully";
            })

            .addCase(updateIssueStatus.fulfilled, (state, action) => {
                state.actionLoading = false;
                const updated = action.payload?.data || action.payload;
                if (updated) {
                    state.current = updated;
                    const idx = state.items.findIndex((i) => getId(i) === getId(updated));
                    if (idx !== -1) state.items[idx] = updated;
                    const midx = state.myIssues.findIndex((i) => getId(i) === getId(updated));
                    if (midx !== -1) state.myIssues[midx] = updated;
                }
                state.message = action.payload?.message || "Issue status updated";
            })

            .addMatcher(
                isAnyOf(
                    fetchIssues.pending,
                    fetchIssueById.pending,
                    fetchMyIssues.pending
                ),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                isAnyOf(
                    fetchIssues.rejected,
                    fetchIssueById.rejected,
                    fetchMyIssues.rejected
                ),
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload?.message || action.error.message;
                }
            )
            .addMatcher(
                isAnyOf(assignIssue.pending, updateIssueStatus.pending),
                (state) => {
                    state.actionLoading = true;
                    state.error = null;
                    state.message = null;
                }
            )
            .addMatcher(
                isAnyOf(assignIssue.rejected, updateIssueStatus.rejected),
                (state, action) => {
                    state.actionLoading = false;
                    state.error = action.payload?.message || action.error.message;
                }
            );
    },
});

export const { clearIssueState, clearCurrentIssue } = issueSlice.actions;
export default issueSlice.reducer;
