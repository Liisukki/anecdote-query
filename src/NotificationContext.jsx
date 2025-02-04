// NotificationContext.jsx
import { createContext, useReducer, useContext } from 'react';

const NotificationContext = createContext();

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.payload;
    case 'CLEAR_NOTIFICATION':
      return '';
    default:
      return state;
  }
};

export const NotificationProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, '');

  const setNotification = (message, timeout = 5000) => {
    dispatch({ type: 'SET_NOTIFICATION', payload: message });
    setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION' });
    }, timeout);
  };

  return (
    <NotificationContext.Provider value={{ notification, setNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
