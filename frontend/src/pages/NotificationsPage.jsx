import React, { useState, useEffect } from 'react';
import { FaBell, FaCheck } from 'react-icons/fa';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './NotificationsPage.css';

const notifIcons = {
  booking_request: '📋',
  booking_confirmed: '✅',
  booking_cancelled: '❌',
  review: '⭐',
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/auth/notifications');
      setNotifications(data.notifications);
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markRead = async (notifId) => {
    try {
      await api.put(`/auth/notifications/${notifId}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notifId ? { ...n, isRead: true } : n))
      );
    } catch {}
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="notifications-page">
      <div className="container">
        <div className="notif-header">
          <h1><FaBell /> Notifications</h1>
          {unreadCount > 0 && (
            <span className="badge badge-warning">{unreadCount} unread</span>
          )}
        </div>

        {loading ? (
          <div className="spinner" />
        ) : notifications.length === 0 ? (
          <div className="empty-state">
            <FaBell />
            <h3>No notifications yet</h3>
            <p>You'll be notified about booking requests and updates here.</p>
          </div>
        ) : (
          <div className="notif-list">
            {notifications.map((n) => (
              <div key={n._id} className={`notif-item ${!n.isRead ? 'unread' : ''}`}>
                <span className="notif-icon">{notifIcons[n.type] || '🔔'}</span>
                <div className="notif-content">
                  <p>{n.message}</p>
                  <span className="notif-time">
                    {new Date(n.createdAt).toLocaleString('en-IN')}
                  </span>
                </div>
                {!n.isRead && (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => markRead(n._id)}
                    title="Mark as read"
                  >
                    <FaCheck />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
