import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginForm = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

 //  these are going add in the date i su 
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');


    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('auth', 'true');
        setIsAuthenticated(true);
        setSuccess('Login successful!');
        setTimeout(() => navigate('/Home'), 1000);
      } else {
        setError(data.message || 'Invalid username or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to connect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRedirect = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Welcome Back</h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Email"
            required
          />
        </div>

        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Password"
            required
          />
        </div>

        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        {success && <p className="text-sm text-green-500 mt-1">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 text-white font-semibold rounded-md transition ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <div className="flex justify-between mt-4 text-sm text-gray-600">
        <Link to="/forgot-password" className="text-indigo-600 hover:underline">Forgot your password?</Link>
        <Link to="/signup" className="text-indigo-600 hover:underline">Sign Up</Link>
      </div>

      <div className="mt-6">
        <p className="text-center text-gray-500 mb-2 text-sm">Or log in with</p>
        <button
          onClick={handleGoogleRedirect}
          className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium text-gray-700">Login with Google</span>
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
