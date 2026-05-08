import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaTimes, FaMapMarkerAlt, FaShippingFast } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationPicker = ({ setLocation }) => {
  useMapEvents({
    click(e) {
      setLocation(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const ScheduleDistributionModal = ({ isOpen, onClose, donationId, onRefresh }) => {
  const [formData, setFormData] = useState({
    deliveryAddress: '',
    location: null
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          location: { lng: longitude, lat: latitude }
        }));
        reverseGeocode(latitude, longitude);
      });
    }
  }, [isOpen]);

  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      if (data.display_name) {
        setFormData(prev => ({ ...prev, deliveryAddress: data.display_name }));
      }
    } catch (err) {
      console.error('Reverse geocoding failed');
    }
  };

  const handleLocationChange = (lat, lng) => {
    setFormData(prev => ({
      ...prev,
      location: { lng, lat }
    }));
    reverseGeocode(lat, lng);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/ngo/schedule-delivery/${donationId}`, {
        deliveryAddress: formData.deliveryAddress,
        deliveryLocation: formData.location
      });
      toast.success('Distribution scheduled!');
      onRefresh();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to schedule distribution');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-dark-light border border-white/10 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-secondary/10 to-transparent">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <FaShippingFast className="text-secondary" /> Schedule Distribution
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors"><FaTimes /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Select Destination on Map</label>
              <div className="h-64 w-full rounded-2xl overflow-hidden border border-white/10 mb-4">
                {formData.location ? (
                  <MapContainer 
                    center={[formData.location.lat, formData.location.lng]} 
                    zoom={13} 
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[formData.location.lat, formData.location.lng]} />
                    <LocationPicker setLocation={handleLocationChange} />
                  </MapContainer>
                ) : (
                  <div className="h-full flex items-center justify-center bg-dark/50 text-gray-500">Detecting location...</div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Delivery Destination Address</label>
              <textarea
                required
                value={formData.deliveryAddress}
                onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                placeholder="e.g. City Orphanage, Downtown Shelter"
                rows="3"
                className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-all"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary hover:bg-secondary-dark py-4 rounded-xl font-bold transition-all transform active:scale-95 disabled:opacity-50 shadow-lg shadow-secondary/20"
            >
              {loading ? 'Scheduling...' : 'Set Destination & Find Volunteer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleDistributionModal;
