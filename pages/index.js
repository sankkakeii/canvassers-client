import React, { useState, useEffect } from 'react';
import branches from '@/components/branches';
import BranchDropdown from '@/components/branchesComponent';
import { FaInfoCircle } from 'react-icons/fa';

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
    deviceModel: '',
    customerRemark: '',
    axaInsuranceCardSerial: ''
  });
  const [lastFetchDate, setLastFetchDate] = useState(new Date().toDateString());
  // const [selectedBranch, setSelectedBranch] = useState(localStorage.getItem('selectedBranch') || '');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [showTutorial, setShowTutorial] = useState(false);

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

  const handleCheckIn = async () => {
    try {
      const token = localStorage.getItem('token');
      const checkinLocation = JSON.stringify(location);

      const response = await fetch(`${API_URL}/check-in/check-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ location: checkinLocation, branch: selectedBranch })
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
        customerEmail: 'customer_email',
        deviceModel: 'device_model',
        location: location, // Directly include location object
        axaInsuranceCardSerial: formData.axaInsuranceCardSerial,
        customerRemark: formData.customerRemark
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
      setFormData({ email: '', password: '', name: '', phone: '', deviceModel: '', axaInsuranceCardSerial: '' });
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
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {isRegistering ? 'Register' : 'Sign In'}
        </button>
        <button
          type="button"
          onClick={() => setIsRegistering(!isRegistering)}
          className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
        >
          {isRegistering ? 'Already have an account?' : 'Create an account'}
        </button>
      </div>
    </form>
  );

  const renderCheckInOutButton = () => (
    <div className="mb-4">
      {isCheckedIn ? (
        <button
          onClick={handleCheckOut}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Check Out
        </button>
      ) : (
        <button
          onClick={handleCheckIn}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Check In
        </button>
      )}
    </div>
  );



  const renderSalesForm = () => (
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
          Customer Phone
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="Customer Phone"
          className="appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="axaInsuranceCardSerial">
          AXA Insurance Card Serial
        </label>
        <input
          type="text"
          name="axaInsuranceCardSerial"
          value={formData.axaInsuranceCardSerial}
          onChange={handleInputChange}
          placeholder="AXA Insurance Card Serial"
          className="appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="customerRemark">
          Customer Remark
        </label>
        <input
          type="text"
          name="customerRemark"
          value={formData.customerRemark}
          onChange={handleInputChange}
          placeholder="Customer Remark"
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
  );

  const renderSalesList = () => (
    <div className="flex flex-col gap-3">
      <div className="max-w-sm w-full bg-gray-100 p-6 rounded-md shadow-md max-h-[80vh] overflow-y-auto">
        <h1 className="text-lg font-semibold text-center">SLOT LOCATION</h1>
        <h1 className="text-md font-bold text-center">{user?.slotLocation}</h1>
      </div>
      <div className="max-w-sm w-full bg-gray-100 p-6 rounded-md shadow-md max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Today&apos;s Sales: {sales.length}</h2>
        {sales.map((sale, index) => (
          <div key={index} className="mb-4 p-4 bg-white rounded-md shadow-sm">
            <p className="font-medium">Sale at {new Date(sale.createdAt).toLocaleString()}</p>
            <p>Customer: {sale.customerName}</p>
            <p>Phone: {sale.customerPhone}</p>
            <p>AXA Insurance Card: {sale.axaInsuranceCardSerial}</p>
          </div>
        ))}
      </div>
    </div>
  );


  const renderTutorialModal = () => (
    <div className={`fixed z-10 inset-0 overflow-y-auto ${showTutorial ? '' : 'hidden'}`}>
      <div className="flex items-center justify-center min-h-screen px-4 py-6">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <FaInfoCircle className="text-blue-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Canvasser App Tutorial
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Welcome to the Canvasser App! Here are some steps to get you started:
                  </p>
                  <ul className="list-disc pl-5 mt-2 text-sm text-gray-500">
                    <li>Register a new account or sign in with your existing credentials.</li>
                    <li>Check in to your current location before starting your work.</li>
                    <li>Record sales by filling in the customer&apos;s details and device information.</li>
                    <li>Check out at the end of the day to save your work and reset sales for the next day.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={() => setShowTutorial(false)}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-800 p-4 gap-6 sm:flex-row">
      <FaInfoCircle
        className="absolute top-3 left-3 text-red-500 text-2xl cursor-pointer"
        onClick={() => setShowTutorial(true)}
      />
      {renderTutorialModal()}
      <div className="max-w-sm w-full bg-white rounded-md shadow-md overflow-y-auto">
        <div className="px-6 py-4 bg-gray-900 text-white">
          <h1 className="text-lg font-bold text-center">Insurance Card Activation Report Form</h1>
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
            <div>
              {/* <BranchDropdown selectedBranch={selectedBranch} setSelectedBranch={setSelectedBranch} /> */}
              <button
                onClick={handleCheckIn}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full mt-4 focus:outline-none focus:shadow-outline"
                disabled={!location}
              >
                {location ? 'Check In' : 'Getting location...'}
              </button>
            </div>
          ) : (
            <>
              {renderSalesForm()}

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

      {isCheckedIn && renderSalesList()}
    </div>
  );

};

export default CanvasserApp;