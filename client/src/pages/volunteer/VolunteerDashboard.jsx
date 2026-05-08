import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { FaTruck, FaMapPin, FaCheckCircle, FaHandshake, FaRoute } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import MapComponent from '../../components/MapComponent';

const VolunteerDashboard = () => {
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [availableTasks, setAvailableTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      const assigned = await api.get('/volunteer/tasks');
      const available = await api.get('/volunteer/available');
      setAssignedTasks(assigned.data);
      setAvailableTasks(available.data);
    } catch (err) {
      console.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAccept = async (id) => {
    try {
      await api.put(`/volunteer/accept/${id}`);
      toast.success('Task accepted! It is now in your active list.');
      fetchTasks();
    } catch (err) {
      toast.error('Failed to accept task');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/volunteer/update/${id}`, { status });
      toast.success(`Status updated to ${status}`);
      fetchTasks();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const getAllMapMarkers = () => {
    const markers = [];
    
    // Add markers for assigned tasks
    assignedTasks.forEach(task => {
      if (task.donationId?.location) {
        markers.push({
          id: `${task._id}-pickup`,
          position: [task.donationId.location.coordinates[1], task.donationId.location.coordinates[0]],
          title: task.donationId.foodName,
          subtitle: 'Donor Pickup',
          type: 'pickup'
        });
      }
      if (task.deliveryLocation) {
        markers.push({
          id: `${task._id}-delivery`,
          position: [task.deliveryLocation.coordinates[1], task.deliveryLocation.coordinates[0]],
          title: task.donationId.foodName,
          subtitle: 'NGO Destination',
          type: 'delivery'
        });
      }
    });

    // Add markers for available tasks
    availableTasks.forEach(task => {
      if (task.donationId?.location) {
        markers.push({
          id: `${task._id}-avail-pickup`,
          position: [task.donationId.location.coordinates[1], task.donationId.location.coordinates[0]],
          title: task.donationId.foodName,
          subtitle: 'Available Pickup',
          type: 'pickup'
        });
      }
      if (task.deliveryLocation) {
        markers.push({
          id: `${task._id}-avail-delivery`,
          position: [task.deliveryLocation.coordinates[1], task.deliveryLocation.coordinates[0]],
          title: task.donationId.foodName,
          subtitle: 'Planned Destination',
          type: 'delivery'
        });
      }
    });

    return markers;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Volunteer Dashboard</h1>
          <p className="text-gray-400">Help redistribute surplus food and save the planet</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-primary/10 text-primary px-6 py-3 rounded-2xl border border-primary/20 flex flex-col items-center">
            <span className="text-2xl font-bold">{assignedTasks.filter(t => t.status === 'delivered').length}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Deliveries</span>
          </div>
        </div>
      </div>

      {/* Mission Map */}
      <div className="mb-12">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
          <FaRoute className="text-primary" /> Active Missions & Pickup Points
        </h2>
        <MapComponent markers={getAllMapMarkers()} zoom={12} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Active Tasks */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <FaTruck className="text-secondary" /> Your Active Tasks
          </h2>
          <div className="space-y-6">
            {assignedTasks.filter(t => t.status !== 'delivered').map((task) => (
              <div key={task._id} className="bg-dark-light rounded-2xl border border-white/5 overflow-hidden flex flex-col hover:border-secondary/30 transition-all">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
                        <FaTruck className="text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{task.donationId?.foodName}</h3>
                        <span className="text-[10px] font-bold text-secondary uppercase">{task.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 my-6 bg-white/5 p-4 rounded-xl">
                    <div className="flex gap-3">
                      <FaMapPin className="text-primary mt-1 shrink-0" />
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold">From: Pickup Point</div>
                        <div className="text-sm text-white">{task.donationId?.pickupAddress}</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <FaCheckCircle className="text-green-500 mt-1 shrink-0" />
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold">To: Destination</div>
                        <div className="text-sm text-white">{task.deliveryAddress}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-white/5 border-t border-white/5 grid grid-cols-2 gap-3">
                  {task.status === 'assigned' && (
                    <button 
                      onClick={() => updateStatus(task._id, 'picked-up')}
                      className="col-span-2 bg-primary hover:bg-primary-dark py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
                    >
                      I have picked up the food
                    </button>
                  )}
                  {task.status === 'picked-up' && (
                    <button 
                      onClick={() => updateStatus(task._id, 'delivered')}
                      className="col-span-2 bg-green-500 hover:bg-green-600 py-4 rounded-xl font-bold transition-all shadow-lg shadow-green-500/20"
                    >
                      Confirm Safe Delivery
                    </button>
                  )}
                </div>
              </div>
            ))}
            {assignedTasks.filter(t => t.status !== 'delivered').length === 0 && (
              <div className="bg-dark-light rounded-2xl border border-white/5 p-12 text-center text-gray-500">
                No active tasks. Accept one from the available list!
              </div>
            )}
          </div>
        </section>

        {/* Available Tasks */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <FaHandshake className="text-primary" /> Available Missions
          </h2>
          <div className="space-y-6">
            {availableTasks.map((task) => (
              <div key={task._id} className="bg-dark-light rounded-3xl border border-white/5 p-6 hover:bg-white/[0.02] transition-all group">
                <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors mb-4">{task.donationId?.foodName}</h3>
                <div className="space-y-3 mb-6">
                  <p className="text-xs text-gray-400 flex items-center gap-2">
                    <FaMapPin className="text-primary" /> From: {task.donationId?.pickupAddress}
                  </p>
                  <p className="text-xs text-gray-400 flex items-center gap-2">
                    <FaCheckCircle className="text-green-500" /> To: {task.deliveryAddress}
                  </p>
                </div>
                <button 
                  onClick={() => handleAccept(task._id)}
                  className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-white py-4 rounded-xl font-bold transition-all border border-primary/20"
                >
                  Accept Mission
                </button>
              </div>
            ))}
            {availableTasks.length === 0 && (
              <div className="bg-dark-light rounded-2xl border border-white/5 p-12 text-center text-gray-500">
                No new missions available right now.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
