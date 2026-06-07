'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import CivicCard from './ui/CivicCard';

// Fix for default marker icons in Leaflet + Next.js
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  title: string;
  type: 'work' | 'meeseva' | 'health';
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

export default function CivicMap({ points }: { points: MapPoint[] }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="h-[400px] bg-slate-100 animate-pulse rounded-xl" />;

  const center: [number, number] = points.length > 0 ? [points[0].lat, points[0].lng] : [17.3850, 78.4867];

  return (
    <CivicCard title="Civic Eyes: Interactive Map" subtitle="Live Geospatial Transparency" className="w-full h-[500px]">
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%', borderRadius: '8px' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={center} />
        {points.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]}>
            <Popup>
              <div className="p-1">
                <p className="text-[10px] font-black uppercase text-blue-600 leading-none mb-1">{p.type}</p>
                <p className="text-xs font-bold text-slate-900 leading-tight">{p.title}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </CivicCard>
  );
}
