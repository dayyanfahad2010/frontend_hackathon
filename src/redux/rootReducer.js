import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./features/auth/authSlice";
import assetSlice from "./features/assets/assetSlice";
import issueSlice from "./features/issues/issueSlice";
import maintenanceSlice from "./features/maintenance/maintenanceSlice";
import historySlice from "./features/history/historySlice";
import dashboardSlice from "./features/dashboard/dashboardSlice";
import publicSlice from "./features/public/publicSlice";
import aiSlice from "./features/ai/aiSlice";

const rootReducer = combineReducers({
    auth: authSlice,
    assets: assetSlice,
    issues: issueSlice,
    maintenance: maintenanceSlice,
    history: historySlice,
    dashboard: dashboardSlice,
    public: publicSlice,
    ai: aiSlice,
});

export default rootReducer;
