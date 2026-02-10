"use client";

<<<<<<< HEAD
import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const markerIcon = new L.Icon({
=======
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Next.js
const defaultIcon = L.icon({
>>>>>>> main
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

<<<<<<< HEAD
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
=======
// Custom teal marker for clinics
const clinicIcon = L.divIcon({
    className: 'custom-clinic-marker',
    html: `<div style="
        background-color: #14b8a6;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
    ">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
        </svg>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

L.Marker.prototype.options.icon = defaultIcon;

export default function ClinicMap({ clinics, selectedClinic, onSelectClinic }) {
    const [mapReady, setMapReady] = useState(false);

    // Default center (Colombo, Sri Lanka)
    const defaultCenter = [6.9271, 79.8612];
    
    // Calculate center based on clinics with coordinates
    const getMapCenter = () => {
        const clinicsWithCoords = clinics.filter(c => c.lat && c.lng);
        if (clinicsWithCoords.length === 0) return defaultCenter;
        
        const avgLat = clinicsWithCoords.reduce((sum, c) => sum + parseFloat(c.lat), 0) / clinicsWithCoords.length;
        const avgLng = clinicsWithCoords.reduce((sum, c) => sum + parseFloat(c.lng), 0) / clinicsWithCoords.length;
        return [avgLat, avgLng];
    };

    // Open Google Maps for directions
    const openGoogleMapsDirections = (clinic) => {
        if (clinic.lat && clinic.lng) {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${clinic.lat},${clinic.lng}&destination_place_id=${encodeURIComponent(clinic.name)}`;
            window.open(url, '_blank');
        } else {
            // Fallback to address-based search
            const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(clinic.address)}`;
            window.open(url, '_blank');
        }
    };

    useEffect(() => {
        setMapReady(true);
    }, []);

    if (!mapReady) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-slate-100">
                <div className="text-slate-500">Loading map...</div>
            </div>
        );
    }

    return (
        <MapContainer
            center={getMapCenter()}
            zoom={13}
            className="w-full h-full rounded-3xl z-0"
            style={{ minHeight: '500px' }}
>>>>>>> main
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
<<<<<<< HEAD
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
=======
            
            {clinics.map((clinic) => {
                // Only render markers for clinics with valid coordinates
                if (!clinic.lat || !clinic.lng) return null;
                
                return (
                    <Marker
                        key={clinic.id}
                        position={[parseFloat(clinic.lat), parseFloat(clinic.lng)]}
                        icon={clinicIcon}
                        eventHandlers={{
                            click: () => onSelectClinic?.(clinic)
                        }}
                    >
                        <Popup>
                            <div className="p-2 min-w-[200px]">
                                <h3 className="font-bold text-slate-900 text-sm mb-1">{clinic.name}</h3>
                                <p className="text-xs text-slate-500 mb-2 flex items-start">
                                    <MapPin className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                                    {clinic.address}
                                </p>
                                {clinic.availableTime && (
                                    <p className="text-xs text-slate-500 mb-3 flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {clinic.availableTime}
                                    </p>
                                )}
                                <Button
                                    size="sm"
                                    className="w-full bg-veri5-teal hover:bg-teal-600 text-white text-xs"
                                    onClick={() => openGoogleMapsDirections(clinic)}
                                >
                                    <Navigation className="w-3 h-3 mr-1" />
                                    Get Directions
                                </Button>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}
>>>>>>> main
