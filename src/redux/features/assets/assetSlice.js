import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
    fetchAssets,
    fetchAssetById,
    createAsset,
    updateAsset,
    deleteAsset,
} from "./assetThunk";

const initialState = {
    items: [],
    current: null,
    loading: false,
    actionLoading: false,
    error: null,
    message: null,
};

const getId = (a) => a?._id || a?.id || a?.code;

const assetSlice = createSlice({
    name: "assets",
    initialState,
    reducers: {
        clearAssetState: (state) => {
            state.error = null;
            state.message = null;
        },
        clearCurrentAsset: (state) => {
            state.current = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAssets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAssets.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload?.data || action.payload || [];
            })
            .addCase(fetchAssets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.error.message;
            })

            .addCase(fetchAssetById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAssetById.fulfilled, (state, action) => {
                state.loading = false;
                state.current = action.payload?.data || action.payload;
            })
            .addCase(fetchAssetById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.error.message;
            })

            .addCase(createAsset.fulfilled, (state, action) => {
                state.actionLoading = false;
                const newAsset = action.payload?.data || action.payload;
                if (newAsset) state.items.unshift(newAsset);
                state.message = action.payload?.message || "Asset created successfully";
            })

            .addCase(updateAsset.fulfilled, (state, action) => {
                state.actionLoading = false;
                const updated = action.payload?.data || action.payload;
                if (updated) {
                    const idx = state.items.findIndex((a) => getId(a) === getId(updated));
                    if (idx !== -1) state.items[idx] = updated;
                    if (state.current && getId(state.current) === getId(updated)) {
                        state.current = updated;
                    }
                }
                state.message = action.payload?.message || "Asset updated successfully";
            })

            .addCase(deleteAsset.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.items = state.items.filter((a) => getId(a) !== action.payload.id);
                state.message = action.payload?.message || "Asset deleted successfully";
            })

            .addMatcher(
                isAnyOf(createAsset.pending, updateAsset.pending, deleteAsset.pending),
                (state) => {
                    state.actionLoading = true;
                    state.error = null;
                    state.message = null;
                }
            )
            .addMatcher(
                isAnyOf(createAsset.rejected, updateAsset.rejected, deleteAsset.rejected),
                (state, action) => {
                    state.actionLoading = false;
                    state.error = action.payload?.message || action.error.message;
                }
            );
    },
});

export const { clearAssetState, clearCurrentAsset } = assetSlice.actions;
export default assetSlice.reducer;
