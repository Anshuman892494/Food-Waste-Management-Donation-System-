import React from 'react';
import { Link } from 'react-router-dom';
import { FaUtensils, FaUsers, FaMapMarkedAlt, FaTruck } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const getStartedLink = () => {
    if (!user) return '/register';
    return `/${user.role}`;
  };

  const volunteerLink = () => {
    if (!user) return '/login';
    return `/${user.role}`;
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 bg-dark">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Connect Surplus Food <br />
            <span className="text-primary">With Those Who Need It</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            FoodBridge is a unified platform connecting restaurants, NGOs, and volunteers to eliminate food waste and fight hunger in our communities.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to={getStartedLink()} className="bg-primary hover:bg-primary-dark px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-lg shadow-primary/20">
              {user ? 'Go to Dashboard' : 'Start Donating'}
            </Link>
            {!user && (
              <Link to={volunteerLink()} className="bg-dark-light hover:bg-slate-800 px-8 py-4 rounded-xl text-lg font-bold border border-white/10 transition-all">
                Join as Volunteer
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-dark-light/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">5,000+</div>
              <div className="text-gray-400 uppercase text-sm tracking-wider">Meals Saved</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">200+</div>
              <div className="text-gray-400 uppercase text-sm tracking-wider">Donors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-gray-400 uppercase text-sm tracking-wider">NGO Partners</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1,200kg</div>
              <div className="text-gray-400 uppercase text-sm tracking-wider">CO2 Prevented</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16">How FoodBridge Works</h2>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="bg-dark-light p-8 rounded-2xl border border-white/5 hover:border-primary/30 transition-all group">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FaUtensils className="text-primary text-2xl" />
            </div>
            <h3 className="text-xl font-bold mb-4">Donors List Surplus</h3>
            <p className="text-gray-400">Restaurants and event organizers list extra food with expiry details and location.</p>
          </div>
          <div className="bg-dark-light p-8 rounded-2xl border border-white/5 hover:border-primary/30 transition-all group">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FaMapMarkedAlt className="text-primary text-2xl" />
            </div>
            <h3 className="text-xl font-bold mb-4">NGOs Find & Claim</h3>
            <p className="text-gray-400">Nearby NGOs receive alerts and claim donations based on their local demand.</p>
          </div>
          <div className="bg-dark-light p-8 rounded-2xl border border-white/5 hover:border-primary/30 transition-all group">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FaTruck className="text-primary text-2xl" />
            </div>
            <h3 className="text-xl font-bold mb-4">Volunteers Deliver</h3>
            <p className="text-gray-400">Dedicated volunteers pick up the food and ensure safe delivery to the shelters.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
