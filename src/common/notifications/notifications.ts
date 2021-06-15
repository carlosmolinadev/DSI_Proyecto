import { store } from "react-notifications-component";

export const notificationFunction = (
  title: string,
  message: string,
  type: "warning" | "info" | "success" | "danger",
  duration: number = 3000
) => {
  store.addNotification({
    title: title,
    message: message,
    type: type,
    insert: "top",
    container: "top-center",
    dismiss: {
      duration: duration,
      onScreen: true,
    },
  });
};
