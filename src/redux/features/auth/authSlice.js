import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { forgotPassword, login, resetPassword, signup, logout } from "./authThunk";

const initialState = {
    loading: false,
    user: null,
    token: localStorage.getItem("token") || null,
    error: null,
    message: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearAuthState: (state) => {
            state.error = null;
            state.message = null;
        },
        logoutLocal: (state) => {
            state.user = null;
            state.token = null;
            state.error = null;
            state.message = null;

            localStorage.removeItem("token");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(logout.fulfilled, (state, action) => {
                state.loading = false;
                state.user = null;
                state.token = null;
                state.error = null;
                state.message = action.payload.message;

                localStorage.removeItem("token");
            })

            .addMatcher(
                isAnyOf(
                    login.pending,
                    signup.pending,
                    forgotPassword.pending,
                    resetPassword.pending,
                    logout.pending
                ),
                (state) => {
                    state.loading = true;
                    state.error = null;
                    state.message = null;
                }
            )

            .addMatcher(
                isAnyOf(login.fulfilled, signup.fulfilled),
                (state, action) => {
                    state.loading = false;

                    state.user = action.payload.data;
                    state.token = action.payload.token;

                    state.message = action.payload.message;

                    if (action.payload.token) {
                        localStorage.setItem("token", action.payload.token);
                    }
                }
            )

            .addMatcher(
                isAnyOf(
                    forgotPassword.fulfilled,
                    resetPassword.fulfilled
                ),
                (state, action) => {
                    state.loading = false;
                    state.message = action.payload.message;
                }
            )

            .addMatcher(
                isAnyOf(
                    login.rejected,
                    signup.rejected,
                    forgotPassword.rejected,
                    resetPassword.rejected,
                    logout.rejected
                ),
                (state, action) => {
                    state.loading = false;
                    state.user = null;
                    state.token = null;
                    state.error =
                        action.payload?.message || action.error.message;
                }
            );
    },
});

export const {
    clearAuthState,
    logoutLocal,
} = authSlice.actions;

export default authSlice.reducer;