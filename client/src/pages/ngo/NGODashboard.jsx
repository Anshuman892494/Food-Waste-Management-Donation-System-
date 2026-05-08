import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { FaMapMarkerAlt, FaHandshake, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import MapComponent from '../../components/MapComponent';

const NGODashboard = () => {
  const [nearbyDonations, setNearbyDonations] = useState([]);
  const [history, setHistory] = useState([]);
  const [impact, setImpact] = useState({ accepted: 0, distributed: 0 });
  const [loading, setLoading] = useState(true);

  const fetchNearby = useCallback(async () => {
    try {
      const res = await api.get('/donations');
      setNearbyDonations(res.data.filter(d => d.status === 'available'));
    } catch (err) {
      toast.error('Failed to fetch nearby donations');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await api.get('/ngo/accepted');
      setHistory(res.data);
    } catch (err) {
      console.error('Failed to fetch history');
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/ngo/stats');
      setImpact(res.data);
    } catch (err) {
      console.error('Failed to fetch stats');
    }
  }, []);

  useEffect(() => {
    fetchNearby();
    fetchHistory();
    fetchStats();
  }, [fetchNearby, fetchHistory, fetchStats]);

  const handleAccept = async (id) => {
    try {
      await api.put(`/ngo/accept/${id}`);
      toast.success('Donation accepted!');
      fetchNearby();
      fetchHistory();
      fetchStats();
    } catch (err) {
      toast.error('Failed to accept donation');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white">NGO Dashboard</h1>
          <p className="text-gray-400">Discover and accept surplus food donations in your area</p>
        </div>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl border border-primary/20 flex items-center gap-2 font-bold animate-pulse">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          LIVE TRACKING ACTIVE
        </div>
      </div>

      {/* Real-time Map View */}
      <div className="mb-12">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
          <FaMapMarkerAlt className="text-primary" /> Real-time Donation Map
        </h2>
        <MapComponent 
          donations={nearbyDonations} 
          center={nearbyDonations.length > 0 && nearbyDonations[0].location ? [nearbyDonations[0].location.coordinates[1], nearbyDonations[0].location.coordinates[0]] : [20.5937, 78.9629]}
          zoom={nearbyDonations.length > 0 ? 12 : 5}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-12">
          {/* Nearby List */}
          <section>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
              <FaMapMarkerAlt className="text-primary" /> Available Near You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {nearbyDonations.map((donation) => (
                <div key={donation._id} className="bg-dark-light rounded-2xl border border-white/5 p-6 hover:border-primary/50 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{donation.foodName}</h3>
                    <span className="bg-primary/10 text-primary text-[10px] px-2 py-1 rounded-md uppercase font-bold border border-primary/20">
                      {donation.category}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{donation.pickupAddress}</p>
                  <div className="flex justify-between items-center text-sm mb-6 bg-white/5 p-3 rounded-xl">
                    <span className="text-gray-400">Qty: <span className="text-white font-bold">{donation.quantity}</span></span>
                    <span className="text-secondary font-bold">Exp: {new Date(donation.expiryTime).toLocaleTimeString()}</span>
                  </div>
                  <button 
                    onClick={() => handleAccept(donation._id)}
                    className="w-full bg-primary hover:bg-primary-dark py-4 rounded-xl font-bold transition-all transform active:scale-95 shadow-lg shadow-primary/20"
                  >
                    Accept Donation
                  </button>
                </div>
              ))}
              {nearbyDonations.length === 0 && !loading && (
                <div className="col-span-2 bg-dark-light rounded-2xl border border-white/5 p-12 text-center text-gray-500">
                  No donations available at the moment.
                </div>
              )}
            </div>
          </section>

          {/* History Section */}
          <section>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white border-t border-white/5 pt-12">
              <FaCheckCircle className="text-green-500" /> Redistribution History
            </h2>
            <div className="bg-dark-light rounded-2xl border border-white/5 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 text-gray-400 text-sm uppercase">
                    <th className="px-6 py-4">Food Item</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Accepted At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {history.map((item) => (
                    <tr key={item._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{item.foodName}</div>
                        <div className="text-xs text-gray-500">{item.pickupAddress}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase border ${
                          item.status === 'delivered' ? 'border-green-500/50 text-green-500 bg-green-500/10' : 'border-secondary/50 text-secondary bg-secondary/10'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {new Date(item.acceptedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {history.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  No distribution history yet.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* NGO Stats Side Panel */}
        <div className="space-y-6">
          <div className="bg-dark-light rounded-2xl border border-white/5 p-6">
            <h3 className="font-bold mb-6 text-white border-b border-white/5 pb-4">Your Impact</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FaHandshake className="text-primary" />
                  </div>
                  <span className="text-gray-400">Accepted</span>
                </div>
                <span className="font-bold text-white text-xl">{impact.accepted}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <FaCheckCircle className="text-green-500" />
                  </div>
                  <span className="text-gray-400">Distributed</span>
                </div>
                <span className="font-bold text-white text-xl">{impact.distributed}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NGODashboard;
