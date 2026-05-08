import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Embedded SVG icons for reliability
const createIcon = (color) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;
  return L.divIcon({
    html: svg,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

const icons = {
  pickup: createIcon('#10b981'), // Emerald-500
  delivery: createIcon('#f59e0b'), // Amber-500
  default: createIcon('#3b82f6') // Blue-500
};

function AutoFitBounds({ markers }) {
  const map = useMap();
  
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => m.position));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [markers, map]);
  
  return null;
}

const MapComponent = ({ markers = [], donations = [], center = [20.5937, 78.9629], zoom = 5 }) => {
  // Support both legacy 'donations' prop and new 'markers' prop
  const allMarkers = [
    ...markers,
    ...donations.map(d => ({
      id: d._id,
      position: [d.location.coordinates[1], d.location.coordinates[0]],
      title: d.foodName,
      subtitle: d.quantity,
      type: 'pickup'
    }))
  ];

  return (
    <div className="h-[450px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative z-0">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%' }}
      >
        <AutoFitBounds markers={allMarkers} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {allMarkers.map((marker, idx) => (
          marker.position && marker.position[0] && marker.position[1] && (
            <Marker 
              key={marker.id || idx} 
              position={marker.position}
              icon={icons[marker.type] || icons.default}
            >
              <Popup>
                <div className="p-3 min-w-[150px]">
                  <div className={`text-[10px] font-bold uppercase mb-1 ${marker.type === 'pickup' ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {marker.type === 'pickup' ? '↑ Pickup Point' : '↓ Delivery Point'}
                  </div>
                  <h3 className="font-bold text-dark text-sm">{marker.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{marker.subtitle}</p>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
