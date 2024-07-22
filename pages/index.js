import React, { useState, useEffect } from 'react';

const CanvasserApp = () => {
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [sales, setSales] = useState([]);
  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    deviceModel: ''
  });
  const [lastFetchDate, setLastFetchDate] = useState(new Date().toDateString());

  // const API_URL = 'http://localhost:5001/api';
  const API_URL = 'https://canvassers-api.onrender.com/api';

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      });
    }
  }, []);

  useEffect(() => {
    if (isCheckedIn) {
      fetchTodaySales();
    }
  }, [isCheckedIn]);

  useEffect(() => {
    const interval = setInterval(() => {
      const today = new Date().toDateString();
      if (today !== lastFetchDate) {
        fetchTodaySales();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [lastFetchDate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const registerUser = async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    return response.json();
  };

  const loginUser = async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!response.ok) {
      throw new Error('Login failed');
    }
    return response.json();
  };

  const fetchTodaySales = async () => {
    const today = new Date().toDateString();
    if (today !== lastFetchDate) {
      setSales([]); // Reset sales if it's a new day
      setLastFetchDate(today);
    }

    if (isCheckedIn) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/sales`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch sales');
        }
        const data = await response.json();
        setSales(data);
      } catch (error) {
        console.error('Error fetching sales:', error);
        setMessage('Error fetching today\'s sales');
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(formData);
      setMessage(response.message);
      setIsRegistering(false);
    } catch (error) {
      setMessage('Registration failed. Please try again.');
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      setMessage(`Welcome, ${response.user.name}!`);
    } catch (error) {
      setMessage('Sign in failed. Please try again.');
    }
  };

  const checkIfCheckedIn = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/check-in/check-status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch check-in status');
      }

      const data = await response.json();
      if (data.isCheckedIn) {
        setIsCheckedIn(true);
        fetchTodaySales();
      }
    } catch (error) {
      console.error('Error checking status:', error);
    }
  };

  const handleCheckIn = async () => {
    try {
      const token = localStorage.getItem('token');
      // const location = "your_location_string"; // Ensure this is a string

      let checkinLocation = JSON.stringify(location);

      const response = await fetch(`${API_URL}/check-in/check-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ location: checkinLocation })
      });

      if (!response.ok) {
        console.error('Check-in error:', response);
        throw new Error('Check-in failed');
      }

      const data = await response.json();
      setIsCheckedIn(true);
      setMessage(data.message);
      fetchTodaySales();
    } catch (error) {
      console.error('Check-in error:', error);
      setMessage('Check-in failed. Please try again.');
    }
  };


  const handleCheckOut = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/check-in/check-out`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Check-out failed');
      }

      const data = await response.json();
      setIsCheckedIn(false);
      setSales([]);
      setMessage(data.message || 'Checked out. Sales reset.');
    } catch (error) {
      console.error('Check-out error:', error);
      setMessage('Check-out failed. Please try again.');
    }
  };






  const handleSaleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const saleData = {
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        deviceModel: formData.deviceModel,
        location: location // Directly include location object
      };
      const response = await fetch(`${API_URL}/sales`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(saleData)
      });

      if (!response.ok) {
        throw new Error('Failed to record sale');
      }

      await fetchTodaySales(); // Refresh the sales after successful submission
      setMessage('Sale recorded successfully!');
      setFormData({ email: '', password: '', name: '', phone: '', deviceModel: '' });
    } catch (error) {
      console.error('Error recording sale:', error);
      setMessage('Failed to record sale. Please try again.');
    }
  };


const renderAuthForm = () => (
  <form onSubmit={isRegistering ? handleRegister : handleSignIn} className="mb-4">
    <div className="mb-4">
      <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
        Email Address
      </label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Email Address"
        className="appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required
      />
    </div>
    <div className="mb-4">
      <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
        Password
      </label>
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        placeholder="Password"
        className="appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required
      />
    </div>
    {isRegistering && (
      <>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Full Name"
            className="appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="phone">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Phone Number"
            className="appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
      </>
    )}
    <button
      type="submit"
      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
    >
      {isRegistering ? 'Register' : 'Sign In'}
    </button>
  </form>
);

return (
  <div className="flex flex-col items-center justify-center w-full h-screen px-4 gap-6 sm:flex-row sm:px-0">
    <div className="max-w-sm w-full bg-white rounded-md shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gray-900 text-white">
        <h1 className="text-lg font-bold text-center">Canvasser Tracking App</h1>
      </div>

      <div className="px-6 py-4">
        {message && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
            {message}
          </div>
        )}

        {!user ? (
          <>
            {renderAuthForm()}
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-full mt-4 focus:outline-none focus:shadow-outline"
            >
              {isRegistering ? 'Already have an account? Sign In' : 'New user? Register'}
            </button>
          </>
        ) : !isCheckedIn ? (
          <button
            onClick={handleCheckIn}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full mt-4 focus:outline-none focus:shadow-outline"
            disabled={!location}
          >
            {location ? 'Check In' : 'Getting location...'}
          </button>
        ) : (
          <>
            <form onSubmit={handleSaleSubmit} className="mb-4">
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
                  Customer Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Customer Name"
                  className="appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  className="appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  className="appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="deviceModel">
                  Device Model
                </label>
                <input
                  type="text"
                  name="deviceModel"
                  value={formData.deviceModel}
                  onChange={handleInputChange}
                  placeholder="Device Model"
                  className="appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
              >
                Record Sale
              </button>
            </form>

            <button
              onClick={handleCheckOut}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full mt-4 focus:outline-none focus:shadow-outline"
            >
              Check Out
            </button>
          </>
        )}
      </div>
    </div>

    {isCheckedIn && (
      <div className="max-w-sm w-full bg-gray-100 p-6 rounded-md shadow-md max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Today&apos;s Sales: {sales.length}</h2>
        {sales.map((sale, index) => (
          <div key={index} className="mb-4 p-4 bg-white rounded-md shadow-sm">
            <p className="font-medium">Sale at {new Date(sale.createdAt).toLocaleString()}</p>
            <p>Customer: {sale.customerName}</p>
            <p>Device: {sale.deviceModel}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);


};

export default CanvasserApp;
