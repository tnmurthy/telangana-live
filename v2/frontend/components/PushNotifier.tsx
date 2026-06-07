'use client';

import { useState, useEffect } from 'react';
import { useArea } from '@/lib/AreaContext';
import CivicCard from './ui/CivicCard';

export default function PushNotifier() {
  const { selectedArea } = useArea();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const subscribeToPush = async () => {
    if (!('serviceWorker' in navigator) || !selectedArea) return;

    const res = await Notification.requestPermission();
    setPermission(res);

    if (res === 'granted') {
      try {
        const registration = await navigator.serviceWorker.ready;
        // In a real app, generate VAPID keys and use them here
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY 
        });

        // Send to backend
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/civic/push/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            area_id: selectedArea.id,
            subscription: subscription.toJSON()
          })
        });

        setIsSubscribed(true);
        console.log('✅ Push Subscription active for:', selectedArea.name);
      } catch (err) {
        console.error('❌ Push Subscription failed:', err);
      }
    }
  };

  if (permission === 'granted' || isSubscribed) return null;

  return (
    <CivicCard className="p-5 bg-blue-600 text-white shadow-xl animate-in slide-in-from-right-4 duration-500 max-w-sm fixed bottom-24 right-6 z-[150]">
      <div className="space-y-3 text-center">
        <div className="text-2xl">🔔</div>
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest">Enable Ward Alerts</h3>
          <p className="text-[10px] text-blue-100 mt-1 uppercase tracking-tight font-medium">
            Get instant notifications for water arrival and safety alerts in {selectedArea?.name || 'your area'}.
          </p>
        </div>
        <button 
          onClick={subscribeToPush}
          className="w-full py-2 bg-white text-blue-600 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 transition-all shadow-md active:scale-95"
        >
          Subscribe Now
        </button>
      </div>
    </CivicCard>
  );
}
