import { createContext, useContext, useState } from "react";

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  // Puedes iniciar con 0 o traerlos de un backend
  const [notificationsCount, setNotificationsCount] = useState(0);

  const addNotification = () => setNotificationsCount((prev) => prev + 1);
  const clearNotifications = () => setNotificationsCount(0);

  return (
    <NotificationsContext.Provider value={{ notificationsCount, addNotification, clearNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);
