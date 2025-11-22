// redux/slices/notificationSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  BackendNotification,
  NotificationType,
} from "../../types/notifications";

interface NotificationState {
  currentNotification: BackendNotification | null;
  lastNotification: BackendNotification | null;
  notificationCount: number;
  notificationHistory: BackendNotification[];
}

const initialState: NotificationState = {
  currentNotification: null,
  lastNotification: null,
  notificationCount: 0,
  notificationHistory: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    notificationReceived: (
      state,
      action: PayloadAction<BackendNotification>,
    ) => {
      state.currentNotification = action.payload;
      state.lastNotification = action.payload;
      state.notificationCount += 1;
      state.notificationHistory.unshift(action.payload);

      // Keep only last 50 notifications
      if (state.notificationHistory.length > 50) {
        state.notificationHistory = state.notificationHistory.slice(0, 50);
      }
    },
    notificationOpened: (
      state,
      action: PayloadAction<BackendNotification>,
    ) => {
      state.currentNotification = action.payload;
      state.lastNotification = action.payload;
    },
    clearNotification: (state) => {
      state.currentNotification = null;
    },
    clearAllNotifications: (state) => {
      state.currentNotification = null;
      state.lastNotification = null;
      state.notificationCount = 0;
      state.notificationHistory = [];
    },
  },
});

export const {
  notificationReceived,
  notificationOpened,
  clearNotification,
  clearAllNotifications,
} = notificationSlice.actions;

// Selectors
export const selectCurrentNotification = (
  state: { notification: NotificationState },
) => state.notification.currentNotification;

export const selectNotificationsByType = (
  state: { notification: NotificationState },
  type: NotificationType,
) =>
  state.notification.notificationHistory.filter(
    (notification) => notification.type === type,
  );

export const selectTransactionNotifications = (
  state: { notification: NotificationState },
) =>
  state.notification.notificationHistory.filter(
    (notification) =>
      notification.type === "outbound.transaction" ||
      notification.type === "inbound.transaction",
  );

export default notificationSlice.reducer;
