import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { fetchAdminSummary, fetchTechnicianSummary } from "./dashboardThunk";

const initialState = {
    adminSummary: null,
    technicianSummary: null,
    loading: false,
    error: null,
};

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        clearDashboardState: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminSummary.fulfilled, (state, action) => {
                state.loading = false;
                state.adminSummary = action.payload?.data || action.payload;
            })
            .addCase(fetchTechnicianSummary.fulfilled, (state, action) => {
                state.loading = false;
                state.technicianSummary = action.payload?.data || action.payload;
            })
            .addMatcher(
                isAnyOf(fetchAdminSummary.pending, fetchTechnicianSummary.pending),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                isAnyOf(fetchAdminSummary.rejected, fetchTechnicianSummary.rejected),
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload?.message || action.error.message;
                }
            );
    },
});

export const { clearDashboardState } = dashboardSlice.actions;
export default dashboardSlice.reducer;
