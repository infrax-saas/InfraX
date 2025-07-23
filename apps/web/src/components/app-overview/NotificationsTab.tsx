import React, { useState } from 'react';
import { Bell, Mail, MessageSquare, Webhook, Plus, Save } from 'lucide-react';

interface NotificationSetting {
  id: string;
  type: 'email' | 'sms' | 'webhook';
  enabled: boolean;
  endpoint?: string;
  events: string[];
}

const NotificationsTab: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: 'email',
      type: 'email',
      enabled: true,
      events: ['user_signup', 'payment_received', 'error_occurred']
    },
    {
      id: 'sms',
      type: 'sms',
      enabled: false,
      events: ['critical_error', 'security_alert']
    },
    {
      id: 'webhook',
      type: 'webhook',
      enabled: true,
      endpoint: 'https://api.example.com/webhook',
      events: ['user_signup', 'subscription_changed']
    }
  ]);

  const availableEvents = [
    'user_signup',
    'user_login',
    'payment_received',
    'subscription_changed',
    'error_occurred',
    'critical_error',
    'security_alert',
    'data_export',
    'integration_connected'
  ];

  const toggleNotification = (id: string) => {
    setNotifications(notifications =>
      notifications.map(notification =>
        notification.id === id
          ? { ...notification, enabled: !notification.enabled }
          : notification
      )
    );
  };

  const updateEndpoint = (id: string, endpoint: string) => {
    setNotifications(notifications =>
      notifications.map(notification =>
        notification.id === id
          ? { ...notification, endpoint }
          : notification
      )
    );
  };

  const toggleEvent = (notificationId: string, event: string) => {
    setNotifications(notifications =>
      notifications.map(notification =>
        notification.id === notificationId
          ? {
            ...notification,
            events: notification.events.includes(event)
              ? notification.events.filter(e => e !== event)
              : [...notification.events, event]
          }
          : notification
      )
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'email':
        return Mail;
      case 'sms':
        return MessageSquare;
      case 'webhook':
        return Webhook;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'email':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'sms':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'webhook':
        return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white">Notifications</h3>
          <p className="text-gray-400 mt-1">Configure how you receive notifications about your application</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center shadow-lg hover:shadow-blue-500/25">
          <Plus className="w-4 h-4 mr-2" />
          Add Channel
        </button>
      </div>

      {/* Notification Channels */}
      <div className="space-y-6">
        {notifications.map((notification) => {
          const Icon = getNotificationIcon(notification.type);
          const colorClass = getNotificationColor(notification.type);

          return (
            <div
              key={notification.id}
              className="bg-gray-900/50 rounded-xl border border-gray-800 hover:border-gray-700 transition-all backdrop-blur-sm"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center border mr-4 ${colorClass}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg capitalize">
                        {notification.type} Notifications
                      </h4>
                      <p className="text-gray-400 text-sm">
                        {notification.type === 'email' && 'Receive notifications via email'}
                        {notification.type === 'sms' && 'Receive notifications via SMS'}
                        {notification.type === 'webhook' && 'Send notifications to external endpoints'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`text-sm font-medium ${notification.enabled ? 'text-green-400' : 'text-gray-400'}`}>
                      {notification.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                    <button
                      onClick={() => toggleNotification(notification.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${notification.enabled ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notification.enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </div>
                </div>

                {notification.enabled && (
                  <div className="space-y-6 border-t border-gray-800 pt-6">
                    {/* Webhook Endpoint */}
                    {notification.type === 'webhook' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Webhook Endpoint
                        </label>
                        <input
                          type="url"
                          value={notification.endpoint || ''}
                          onChange={(e) => updateEndpoint(notification.id, e.target.value)}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="https://your-api.com/webhook"
                        />
                      </div>
                    )}

                    {/* Event Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-4">
                        Select Events ({notification.events.length} selected)
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {availableEvents.map((event) => {
                          const isSelected = notification.events.includes(event);
                          return (
                            <button
                              key={event}
                              onClick={() => toggleEvent(notification.id, event)}
                              className={`p-3 rounded-lg border transition-all text-left ${isSelected
                                  ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                                  : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-700/50'
                                }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium capitalize">
                                  {event.replace('_', ' ')}
                                </span>
                                {isSelected && (
                                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center justify-end pt-4 border-t border-gray-800">
                      <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center text-sm">
                        <Save className="w-4 h-4 mr-2" />
                        Save Configuration
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Global Settings */}
      <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 backdrop-blur-sm">
        <h4 className="text-lg font-semibold text-white mb-4">Global Settings</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-white font-medium">Rate Limiting</span>
              <p className="text-gray-400 text-sm">Limit notification frequency to prevent spam</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6 transition-transform" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-white font-medium">Quiet Hours</span>
              <p className="text-gray-400 text-sm">Disable non-critical notifications during specified hours</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsTab;

