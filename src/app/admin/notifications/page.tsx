'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { Bell, Send, Mail, MessageSquare, Smartphone } from 'lucide-react';

export default function AdminNotificationsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    type: 'email',
    to: '',
    subject: '',
    content: '',
  });

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await api.notifications.send({
        type: formData.type as 'email' | 'push' | 'sms',
        to: formData.to,
        subject: formData.subject,
        content: formData.content,
      });
      setSuccess('Notification sent successfully!');
      setFormData({
        type: 'email',
        to: '',
        subject: '',
        content: '',
      });
    } catch (err) {
      console.error('Failed to send notification:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to send notification'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/admin')}
          className="rounded-xl"
        >
          ← Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold text-neutral-900 font-display">
          Send Notifications
        </h1>
      </div>

      <div className="bg-white rounded-[32px] border border-neutral-100 shadow-soft p-8">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-neutral-100">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-900">
            <Bell size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900">
              Manual Notification
            </h2>
            <p className="text-neutral-500">
              Send alerts to users for testing or announcements
            </p>
          </div>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-neutral-700">
                Notification Type
              </label>
              <div className="relative">
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-200 focus:border-stone-400 transition-all appearance-none"
                >
                  <option value="email">Email</option>
                  <option value="push">Push Notification</option>
                  <option value="sms">SMS</option>
                </select>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
                  {formData.type === 'email' && <Mail size={18} />}
                  {formData.type === 'push' && <Smartphone size={18} />}
                  {formData.type === 'sms' && <MessageSquare size={18} />}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-neutral-700">
                Recipient (User ID or Email)
              </label>
              <input
                type="text"
                name="to"
                value={formData.to}
                onChange={handleChange}
                placeholder="user@example.com"
                required
                className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-200 focus:border-stone-400 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-neutral-700">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Notification Subject"
              required={formData.type === 'email'}
              className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-200 focus:border-stone-400 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-neutral-700">
              Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Type your message here..."
              required
              rows={6}
              className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-200 focus:border-stone-400 transition-all resize-none"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              {loading ? <Spinner /> : <Send size={18} />}
              Send Notification
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
