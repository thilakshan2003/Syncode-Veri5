"use client";

import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const sriLankaBounds = [
    [5.9, 79.5],
    [9.9, 81.9]
];

const defaultCenter = [7.8731, 80.7718];
const defaultZoom = 8;

export default function ClinicMap({ clinics }) {
    const markers = useMemo(() => {
        return (clinics || [])
            .map((clinic) => {
                const lat = clinic.lat !== null && clinic.lat !== undefined ? Number(clinic.lat) : null;
                const lng = clinic.lng !== null && clinic.lng !== undefined ? Number(clinic.lng) : null;
                if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
                return { ...clinic, lat, lng };
            })
            .filter(Boolean);
    }, [clinics]);

    return (
        <MapContainer
            center={defaultCenter}
            zoom={defaultZoom}
            minZoom={7}
            maxBounds={sriLankaBounds}
            maxBoundsViscosity={1.0}
            preferCanvas
            scrollWheelZoom
            className="w-full h-full rounded-3xl"
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markers.map((clinic) => (
                <Marker key={clinic.id} position={[clinic.lat, clinic.lng]} icon={markerIcon}>
                    <Popup>
                        <div className="space-y-1">
                            <div className="font-semibold text-slate-900">{clinic.name}</div>
                            <div className="text-xs text-slate-500">{clinic.address}</div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}