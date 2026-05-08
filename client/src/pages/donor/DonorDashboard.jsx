import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { FaPlus, FaUtensils, FaClock, FaCheckCircle, FaLeaf } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import AddDonationModal from '../../components/AddDonationModal';

const DonorDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [impact, setImpact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchDonations = useCallback(async () => {
    try {
      const res = await api.get('/donations?mine=true');
      setDonations(res.data);
    } catch (err) {
      toast.error('Failed to fetch donations');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchImpact = useCallback(async () => {
    try {
      const res = await api.get('/sustainability/me');
      setImpact(res.data);
    } catch (err) {
      console.error('Impact data not available');
    }
  }, []);

  useEffect(() => {
    fetchDonations();
    fetchImpact();
  }, [fetchDonations, fetchImpact]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white">Donor Dashboard</h1>
          <p className="text-gray-400">Track your contributions and add new donations</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-primary-dark px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
        >
          <FaPlus /> Add Donation
        </button>
      </div>

      <AddDonationModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        onRefresh={fetchDonations}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-dark-light p-6 rounded-2xl border border-white/5 hover:border-primary/30 transition-all">
          <FaUtensils className="text-primary text-3xl mb-4" />
          <div className="text-2xl font-bold">{donations.length}</div>
          <div className="text-gray-400">Total Donations</div>
        </div>
        <div className="bg-dark-light p-6 rounded-2xl border border-white/5 hover:border-secondary/30 transition-all">
          <FaClock className="text-secondary text-3xl mb-4" />
          <div className="text-2xl font-bold">
            {donations.filter(d => d.status === 'available' || d.status === 'accepted').length}
          </div>
          <div className="text-gray-400">Active Listings</div>
        </div>
        <div className="bg-dark-light p-6 rounded-2xl border border-white/5 hover:border-green-500/30 transition-all">
          <FaCheckCircle className="text-green-500 text-3xl mb-4" />
          <div className="text-2xl font-bold">
            {donations.filter(d => d.status === 'delivered').length}
          </div>
          <div className="text-gray-400">Successful</div>
        </div>
        <div className="bg-dark-light p-6 rounded-2xl border border-white/5 hover:border-primary/30 transition-all">
          <div className="flex items-center gap-2 text-primary text-3xl mb-4">
            <FaLeaf />
          </div>
          <div className="text-2xl font-bold">
            {impact ? impact.carbonSaved.toFixed(1) : '0.0'} kg
          </div>
          <div className="text-gray-400">CO2 Offset</div>
        </div>
      </div>

      {/* Recent Donations List */}
      <div className="bg-dark-light rounded-3xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-bold">Your Recent Donations</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-gray-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Food Item</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {donations.map((donation) => (
                <tr key={donation._id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{donation.foodName}</div>
                    {donation.aiReport && (
                      <div className="text-[10px] text-primary flex items-center gap-1 mt-1 font-bold">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                        AI ANALYZED
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-300">{donation.quantity}</div>
                    <div className="text-xs text-gray-500">{donation.weight} kg</div>
                  </td>
                  <td className="px-6 py-4">
                    {donation.aiReport ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-1000 ${
                                donation.aiReport.safetyScore > 80 ? 'bg-green-500' :
                                donation.aiReport.safetyScore > 50 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${donation.aiReport.safetyScore}%` }}
                            ></div>
                          </div>
                          <span className="text-[10px] font-bold">{donation.aiReport.safetyScore}% Safety</span>
                        </div>
                        <div className="text-[10px] text-gray-400 italic">
                          Sug: {donation.aiReport.recommendation.destination.toUpperCase()}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-600 italic">Analyzing...</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      donation.status === 'available' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                      donation.status === 'delivered' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                      'bg-secondary/10 text-secondary border border-secondary/20'
                    }`}>
                      {donation.status}
                    </span>
                  </td>
                </tr>
              ))}
              {donations.length === 0 && !loading && (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                    No donations found. Start by adding your first donation!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
