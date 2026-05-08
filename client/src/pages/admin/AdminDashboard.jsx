import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaUsers, FaChartBar, FaRecycle, FaTrash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/analytics');
        setStats(res.data);
      } catch (err) {
        // Mock data for demo if API fails
        setStats({
          totalUsers: 245,
          totalDonations: 86,
          deliveredDonations: 52,
          availableDonations: 14,
          wasteReductionStats: { mealsServed: 430, co2Saved: 215 }
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading Admin Panel...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Admin Command Center</h1>
        <p className="text-gray-400">Monitor system performance and environmental impact</p>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-gradient-to-br from-primary/20 to-transparent p-6 rounded-3xl border border-primary/20">
          <FaUsers className="text-primary text-3xl mb-4" />
          <div className="text-3xl font-bold">{stats.totalUsers}</div>
          <div className="text-sm text-gray-400 font-medium">Total Registered Users</div>
        </div>
        <div className="bg-gradient-to-br from-secondary/20 to-transparent p-6 rounded-3xl border border-secondary/20">
          <FaChartBar className="text-secondary text-3xl mb-4" />
          <div className="text-3xl font-bold">{stats.totalDonations}</div>
          <div className="text-sm text-gray-400 font-medium">Total Food Listings</div>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-transparent p-6 rounded-3xl border border-green-500/20">
          <FaRecycle className="text-green-500 text-3xl mb-4" />
          <div className="text-3xl font-bold">{stats.wasteReductionStats.mealsServed}</div>
          <div className="text-sm text-gray-400 font-medium">Meals Served to Hungry</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500/20 to-transparent p-6 rounded-3xl border border-blue-500/20">
          <div className="text-blue-500 text-3xl font-bold mb-4">CO2</div>
          <div className="text-3xl font-bold">{stats.wasteReductionStats.co2Saved}kg</div>
          <div className="text-sm text-gray-400 font-medium">Carbon Emissions Saved</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* System Distribution Card */}
        <div className="bg-dark-light rounded-3xl border border-white/5 p-8">
          <h2 className="text-xl font-bold mb-8">System Distribution</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Success Rate</span>
                <span className="text-primary">{(stats.deliveredDonations / stats.totalDonations * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-dark rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${(stats.deliveredDonations / stats.totalDonations * 100)}%` }}
                ></div>
              </div>
            </div>
            {/* Add more metrics as needed */}
          </div>
        </div>

        {/* Action Panel */}
        <div className="bg-dark-light rounded-3xl border border-white/5 p-8">
          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-dark border border-white/10 rounded-2xl hover:border-primary transition-all text-left group">
              <div className="text-gray-400 group-hover:text-primary mb-2 text-sm">Manage Users</div>
              <div className="font-bold">24 Users Waiting Approval</div>
            </button>
            <button className="p-4 bg-dark border border-white/10 rounded-2xl hover:border-red-500/50 transition-all text-left group">
              <div className="text-gray-400 group-hover:text-red-500 mb-2 text-sm">Flagged Entries</div>
              <div className="font-bold">3 Potential Fakes</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
