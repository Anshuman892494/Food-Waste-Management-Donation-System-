import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaTimes, FaCamera, FaLeaf, FaSnowflake, FaSun } from 'react-icons/fa';
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

const AddDonationModal = ({ isOpen, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    foodName: '',
    quantity: '',
    weight: '',
    category: 'veg',
    storageConditions: 'ambient',
    expiryTime: '',
    pickupAddress: '',
    description: '',
    location: null
  });

  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      if (data.display_name) {
        setFormData(prev => ({ ...prev, pickupAddress: data.display_name }));
      }
    } catch (err) {
      console.error('Reverse geocoding failed');
    }
  };

  useEffect(() => {
    if (isOpen && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          location: { type: 'Point', coordinates: [longitude, latitude] }
        }));
        reverseGeocode(latitude, longitude);
      });
    }
  }, [isOpen]);

  const handleLocationChange = (lat, lng) => {
    setFormData(prev => ({
      ...prev,
      location: { type: 'Point', coordinates: [lng, lat] }
    }));
    reverseGeocode(lat, lng);
  };
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // AI Prediction Trigger
    if (name === 'foodName' && value.length > 3) {
      const timer = setTimeout(async () => {
        try {
          const res = await api.post('/donations/predict', { foodName: value });
          setFormData(prev => ({ 
            ...prev, 
            category: res.data.category || prev.category,
            storageConditions: res.data.storageConditions || prev.storageConditions
          }));
          toast.success('AI Suggested settings!', { icon: '🤖', duration: 2000 });
        } catch (err) {
          console.error('Prediction failed');
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'location' && formData[key]) {
          data.append(key, JSON.stringify(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      });
      if (image) data.append('image', image);

      await api.post('/donations', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Donation added successfully!');
      onRefresh();
      onClose();
      setFormData({
        foodName: '',
        quantity: '',
        weight: '',
        category: 'veg',
        storageConditions: 'ambient',
        expiryTime: '',
        pickupAddress: '',
        description: ''
      });
      setImage(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-dark/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-dark-light border border-white/10 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-primary/10 to-transparent">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <FaLeaf className="text-primary" /> Add New Donation
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Food Name</label>
              <input
                name="foodName"
                required
                value={formData.foodName}
                onChange={handleChange}
                placeholder="e.g. Fresh Vegetable Biryani"
                className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Quantity</label>
              <input
                name="quantity"
                required
                value={formData.quantity}
                onChange={handleChange}
                placeholder="e.g. 10 Plates"
                className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Weight (kg)</label>
              <input
                name="weight"
                type="number"
                step="0.1"
                required
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g. 5.5"
                className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all"
              >
                <option value="veg">Vegetarian</option>
                <option value="non-veg">Non-Vegetarian</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Storage Conditions</label>
              <select
                name="storageConditions"
                value={formData.storageConditions}
                onChange={handleChange}
                className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all"
              >
                <option value="ambient">Ambient (Room Temp)</option>
                <option value="refrigerated">Refrigerated</option>
                <option value="frozen">Frozen</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Expiry Time</label>
              <input
                name="expiryTime"
                type="datetime-local"
                required
                value={formData.expiryTime}
                onChange={handleChange}
                className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Pickup Address</label>
              <textarea
                name="pickupAddress"
                required
                value={formData.pickupAddress}
                onChange={handleChange}
                rows="2"
                placeholder="Enter complete pickup address"
                className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all"
              ></textarea>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Mark Pickup Location</label>
              <div className="h-64 w-full rounded-2xl overflow-hidden border border-white/10 mb-4 relative">
                {formData.location ? (
                  <MapContainer 
                    center={[formData.location.coordinates[1], formData.location.coordinates[0]]} 
                    zoom={15} 
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[formData.location.coordinates[1], formData.location.coordinates[0]]} />
                    <LocationPicker setLocation={handleLocationChange} />
                  </MapContainer>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-dark/50 text-gray-500 text-sm">
                    Detecting your location...
                  </div>
                )}
              </div>
              <p className="text-[10px] text-gray-500 italic">Click on the map if you want to adjust the pickup point.</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Food Image</label>
              <div className="relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="food-image"
                />
                <label 
                  htmlFor="food-image"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-2xl hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all"
                >
                  {image ? (
                    <span className="text-primary font-medium">{image.name}</span>
                  ) : (
                    <>
                      <FaCamera className="text-2xl text-gray-400 mb-2 group-hover:text-primary transition-colors" />
                      <span className="text-gray-400 group-hover:text-primary transition-colors">Click to upload photo</span>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary hover:bg-primary-dark px-6 py-4 rounded-xl font-bold transition-all transform active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Post Donation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDonationModal;
