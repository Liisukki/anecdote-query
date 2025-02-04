import { useNotification } from '../NotificationContext';

const Notification = () => {
  const { notification } = useNotification();

  if (!notification) return null;

  return (
    <div style={{ border: 'solid', padding: 10, borderWidth: 1, marginBottom: 5 }}>
      {notification}
    </div>
  );
};

export default Notification;
