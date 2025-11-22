// types/notification.ts
export type NotificationType =
  | "outbound.transaction"
  | "inbound.transaction"
  | "payment.received"
  | "payment.sent"; // Add more types as needed

export interface NotificationData {
  transaction_id?: string;
  // Add other data fields as needed
  [key: string]: any;
}

export interface BackendNotification {
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  data: NotificationData;
}

export interface NotificationEvent {
  pattern: string;
  data: BackendNotification;
}

// Firebase notification wrapper
export interface NotificationPayload {
  notification?: {
    title?: string;
    body?: string;
  };
  data?: {
    [key: string]: string;
  };
}
