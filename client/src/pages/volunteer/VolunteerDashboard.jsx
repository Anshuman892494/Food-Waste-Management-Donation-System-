import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaTruck, FaMapPin, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const VolunteerDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/volunteer/tasks');
        setTasks(res.data);
      } catch (err) {
        // toast.error('Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/volunteer/update/${id}`, { status });
      toast.success(`Status updated to ${status}`);
      setTasks(tasks.map(t => t._id === id ? { ...t, status } : t));
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Volunteer Dashboard</h1>
        <p className="text-gray-400">Manage your assigned pickups and deliveries</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div key={task._id} className="bg-dark-light rounded-2xl border border-white/5 overflow-hidden flex flex-col">
            <div className="p-6 flex-grow">
              <div className="flex items-center gap-3 mb-4">
                <FaTruck className="text-secondary" />
                <span className="text-sm font-bold text-secondary uppercase tracking-widest">{task.status}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{task.donationId?.foodName || 'Food Delivery'}</h3>
              <div className="space-y-4 my-6">
                <div className="flex gap-3">
                  <FaMapPin className="text-primary mt-1 shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-bold">Pickup Address</div>
                    <div className="text-sm">{task.donationId?.pickupAddress || 'Address not available'}</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <FaCheckCircle className="text-green-500 mt-1 shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-bold">NGO (Destination)</div>
                    <div className="text-sm">{task.ngoId?.name}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-white/5 border-t border-white/5 grid grid-cols-2 gap-2">
              {task.status === 'assigned' && (
                <button 
                  onClick={() => updateStatus(task._id, 'picked-up')}
                  className="col-span-2 bg-primary hover:bg-primary-dark py-3 rounded-xl font-bold transition-all"
                >
                  Confirm Pickup
                </button>
              )}
              {task.status === 'picked-up' && (
                <button 
                  onClick={() => updateStatus(task._id, 'delivered')}
                  className="col-span-2 bg-green-500 hover:bg-green-600 py-3 rounded-xl font-bold transition-all"
                >
                  Mark as Delivered
                </button>
              )}
            </div>
          </div>
        ))}
        {tasks.length === 0 && !loading && (
          <div className="col-span-full bg-dark-light rounded-2xl border border-white/5 p-12 text-center text-gray-500">
            No active tasks assigned to you. Enjoy your break!
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerDashboard;
