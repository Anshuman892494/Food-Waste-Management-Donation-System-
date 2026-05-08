import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'donor',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(formData);
      toast.success('Registration successful!');
      navigate(`/${user.role}`);
    } catch (error) {
      console.error('Registration failed:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.[0]?.msg || 
                          'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-dark-light/50 backdrop-blur-xl p-8 rounded-3xl border border-white/10 w-full max-w-2xl shadow-2xl">
        <h2 className="text-3xl font-bold mb-2 text-center">Join FoodBridge</h2>
        <p className="text-gray-400 text-center mb-8">Choose your role and start making an impact</p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-2">Role</label>
            <div className="grid grid-cols-3 gap-4">
              {['donor', 'ngo', 'volunteer'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setFormData({ ...formData, role })}
                  className={`py-3 rounded-xl border font-medium capitalize transition-all ${
                    formData.role === role 
                      ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                      : 'bg-dark border-white/10 text-gray-400 hover:border-primary/50'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
            <input 
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
            <input 
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
            <input 
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
              placeholder="+1 234 567 890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
            <input 
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
              placeholder="••••••••"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-2">Office/Home Address</label>
            <textarea 
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
              placeholder="Enter your complete address"
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="md:col-span-2 bg-primary hover:bg-primary-dark py-4 rounded-xl font-bold transition-all transform active:scale-95 disabled:opacity-50 mt-4"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-400">
          Already have an account? {' '}
          <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
