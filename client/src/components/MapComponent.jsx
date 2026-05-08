import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const MapComponent = ({ donations, center = [20.5937, 78.9629], zoom = 5 }) => {
  return (
    <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%' }}
      >
        <ChangeView center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {donations.map((donation) => (
          donation.location && donation.location.coordinates && (
            <Marker 
              key={donation._id} 
              position={[donation.location.coordinates[1], donation.location.coordinates[0]]}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-dark">{donation.foodName}</h3>
                  <p className="text-xs text-gray-600">{donation.quantity}</p>
                  <div className="mt-2 text-[10px] bg-primary/10 text-primary px-2 py-1 rounded font-bold uppercase">
                    {donation.category}
                  </div>
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
