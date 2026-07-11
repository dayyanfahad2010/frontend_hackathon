import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
    createMaintenance,
    fetchMaintenanceByIssue,
    updateMaintenance,
} from "./maintenanceThunk";

const initialState = {
    records: [],
    loading: false,
    actionLoading: false,
    error: null,
    message: null,
};

const maintenanceSlice = createSlice({
    name: "maintenance",
    initialState,
    reducers: {
        clearMaintenanceState: (state) => {
            state.error = null;
            state.message = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMaintenanceByIssue.fulfilled, (state, action) => {
                state.loading = false;
                const data = action.payload?.data || action.payload || [];
                state.records = Array.isArray(data) ? data : [data];
            })
            .addCase(createMaintenance.fulfilled, (state, action) => {
                state.actionLoading = false;
                const created = action.payload?.data || action.payload;
                if (created) state.records.unshift(created);
                state.message = action.payload?.message || "Maintenance record created";
            })
            .addCase(updateMaintenance.fulfilled, (state, action) => {
                state.actionLoading = false;
                const updated = action.payload?.data || action.payload;
                if (updated) {
                    const idx = state.records.findIndex(
                        (r) => (r._id || r.id) === (updated._id || updated.id)
                    );
                    if (idx !== -1) state.records[idx] = updated;
                }
                state.message = action.payload?.message || "Maintenance record updated";
            })

            .addMatcher(isAnyOf(fetchMaintenanceByIssue.pending), (state) => {
                state.loading = true;
                state.error = null;
            })
            .addMatcher(isAnyOf(fetchMaintenanceByIssue.rejected), (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.error.message;
            })
            .addMatcher(
                isAnyOf(createMaintenance.pending, updateMaintenance.pending),
                (state) => {
                    state.actionLoading = true;
                    state.error = null;
                    state.message = null;
                }
            )
            .addMatcher(
                isAnyOf(createMaintenance.rejected, updateMaintenance.rejected),
                (state, action) => {
                    state.actionLoading = false;
                    state.error = action.payload?.message || action.error.message;
                }
            );
    },
});

export const { clearMaintenanceState } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;
