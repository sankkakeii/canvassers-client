import React, { useState, useEffect } from 'react';
import { Loader2, Info, X } from 'lucide-react';
import { motion } from 'framer-motion';

const CanvasserApp = () => {
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);
  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
  });
  const [selectedBranch, setSelectedBranch] = useState('');
  const [showTutorial, setShowTutorial] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const API_URL = '/api';

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    }
  }, []);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsLoading(true);
        try {
          const response = await fetch(`${API_URL}/supa/check-in`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          if (data.isCheckedIn) {
            setIsCheckedIn(true);
          }
        } catch (error) {
          setMessage('Error checking login status.');
        } finally {
          setIsLoading(false);
        }
      }
    };
    checkLoginStatus();
  }, []);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const registerUser = async userData => {
    const response = await fetch(`${API_URL}/supa/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    return response.json();
  };

  const loginUser = async credentials => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/supa/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      fetchBranches();
      return response.json();
    } catch (error) {
      setMessage(`Login failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await registerUser(formData);
      setMessage(response.message);
      setIsRegistering(false);
    } catch (error) {
      setMessage('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await loginUser(formData);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      setMessage(`Welcome, ${response.user.name}!`);
    } catch (error) {
      setMessage(`Login failed. ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const checkinLocation = JSON.stringify(location);

      const selectedBranch = branches.find(branch => branch.address === user.slot_location);
      if (!selectedBranch) throw new Error('No matching branch found for your slot location');

      const distance = getDistanceFromLatLonInMeters(location.latitude, location.longitude, selectedBranch.lat, selectedBranch.long);
      const isWithin400Meters = distance <= 400;

      const response = await fetch(`${API_URL}/supa/check-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          location: checkinLocation,
          branch: selectedBranch,
          isWithin400Meters,
          distanceToBranch: distance
        }),
      });

      if (!response.ok) throw new Error('Check-in failed');

      const data = await response.json();
      setIsCheckedIn(true);
      setMessage(data.message);
    } catch (error) {
      setMessage('Check-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!isFeedbackSubmitted) {
      setMessage('Please provide feedback before checking out.');
      return false;
    }

    try {
      const token = localStorage.getItem('token');

      // Find the branch with the matching address
      const selectedBranch = branches.find(branch => branch.address === user.slot_location);

      if (!selectedBranch) {
        throw new Error('No matching branch found for your slot location');
      }

      // Check if user's location is within 400 meters of the branch location
      const distance = getDistanceFromLatLonInMeters(location.latitude, location.longitude, selectedBranch.lat, selectedBranch.long);
      console.log(`Distance to branch: ${distance} meters`);

      let isWithin400Meters = false;
      if (distance <= 400) {
        isWithin400Meters = true;
      }

      const checkOutInformation = {
        check_out_time: new Date(),
        feedback: feedback,
        distance_to_branch: distance,
        is_within_400m: isWithin400Meters
      };

      const response = await fetch(`${API_URL}/supa/check-out`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          checkOutInformation: checkOutInformation
        }),
      });

      if (!response.ok) {
        throw new Error('Check-out failed');
      }

      const data = await response.json();
      setIsCheckedIn(false);
      setMessage(data.message || 'Checked out successfully.');

      // Log the check-out details
      console.log('Check-out successful:', {
        userLocation: location,
        branchLocation: selectedBranch,
        isWithin400Meters: isWithin400Meters
      });

      return isWithin400Meters;
    } catch (error) {
      console.error('Check-out error:', error);
      setMessage('Check-out failed. Please try again.');
      return false;
    }
  };

  const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Radius of the Earth in meters
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
  };

  const deg2rad = deg => deg * (Math.PI / 180);

  const handleFeedbackChange = e => setFeedback(e.target.value);

  const fetchBranches = async () => {
    try {
      const response = await fetch(`${API_URL}/supa/admin/fetch-all-branches`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch branches');
      const data = await response.json();
      setBranches(data);
    } catch (error) {
      setMessage('Error fetching branches');
    }
  };


  const handleSubmitFeedback = async (e) => {
    console.log(feedbackData);
    e.preventDefault();
    if (!feedbackData.sales.trim()) {
      setMessage('Please provide feedback before submitting.');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/supa/record-feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({feedbackData: feedbackData })
      });
  
      if (!response.ok) {
        throw new Error('Failed to record feedback');
      }
  
      setMessage('Feedback recorded successfully!');
      setFeedbackData({
        sales: '',
        reason: '',
        improvement: '',
        extraFeedback: '',
      });
      setIsFeedbackSubmitted(true);
    } catch (error) {
      console.error('Error recording feedback:', error);
      setMessage('Failed to record feedback. Please try again.');
    }
  };
  
  const renderAuthForm = () => (
    <motion.form 
      onSubmit={isRegistering ? handleRegister : handleSignIn}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-4"
    >
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
    </motion.form>
  );

  const [feedbackData, setFeedbackData] = useState({
    sales: '',
    reason: '',
    improvement: '',
    extraFeedback: '',
  });
  
  const renderFeedbackForm = () => {
    const target = 20; // Target value
  
    const handleFeedbackInputChange = (e) => {
      const { name, value } = e.target;
      setFeedbackData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    };
  
    return (
      <form onSubmit={handleSubmitFeedback} className="mb-2">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="sales">
            How many did you sell?
          </label>
          <p className="text-gray-500 mb-2">Target: {target}</p>
          <input
            type="number"
            name="sales"
            value={feedbackData.sales}
            onChange={handleFeedbackInputChange}
            placeholder="Enter number of sales"
            className="appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
  
        {feedbackData.sales > target && (
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="reason">
              Why did you sell above the target?
            </label>
            <textarea
              name="reason"
              value={feedbackData.reason}
              onChange={handleFeedbackInputChange}
              placeholder="Explain why you sold above target"
              className="appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
        )}
  
        {feedbackData.sales <= target && (
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="reason">
              Why did you sell below the target?
            </label>
            <textarea
              name="reason"
              value={feedbackData.reason}
              onChange={handleFeedbackInputChange}
              placeholder="Explain why you sold below target"
              className="appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
        )}
  
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="improvement">
            What will improve your sales?
          </label>
          <textarea
            name="improvement"
            value={feedbackData.improvement}
            onChange={handleFeedbackInputChange}
            placeholder="Suggestions for improvement"
            className="appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
  
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="extraFeedback">
            Any extra feedback?
          </label>
          <textarea
            name="extraFeedback"
            value={feedbackData.extraFeedback}
            onChange={handleFeedbackInputChange}
            placeholder="Additional feedback"
            className="appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
  
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mt-4"
        >
          Submit Feedback
        </button>
      </form>
    );
  };


  return (
        // <div className="flex flex-col items-center justify-center w-full h-screen p-4 gap-6 bg-gradient-to-r from-blue-100 to-purple-200 sm:flex-row">
    <div className="flex flex-col items-center justify-center w-full h-screen p-4 gap-6 bg-gradient-to-r from-blue-100 to-purple-200 sm:flex-row">
      <Info
        className="absolute top-3 left-3 text-purple-500 text-2xl cursor-pointer"
        onClick={() => setShowTutorial(true)}
      />

      <X
        className="absolute top-3 right-3 text-red-500 text-2xl cursor-pointer"
        onClick={() => handleCheckOut}
      />

      {showTutorial && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setShowTutorial(false)}
            >
              &times;
            </button>
            <h2 className="text-lg font-bold mb-4">User Guide</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Check-In:</strong> Click &quot;Check In&quot; to confirm your attendance.
              </li>
              <li>
                <strong>Provide Feedback:</strong> Please fill out the feedback form before checking out.
              </li>
              <li>
                <strong>Check-Out:</strong> You can only check out after submitting your feedback.
              </li>
            </ul>
          </div>
        </motion.div>
      )}
      {!user && (
        <motion.div 
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-1/2 lg:w-1/3"
        >
          <h1 className="text-2xl font-bold mb-4">Login/Register</h1>
          {renderAuthForm()}
          {message && <p className="text-red-500 mt-2">{message}</p>}
        </motion.div>
      )}
      {user && (
        <motion.div
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-1/2 lg:w-1/3"
        >
          <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h1>
          {!isCheckedIn ? (
            <>
              <button
                onClick={handleCheckIn}
                className="bg-blue-500 hover:bg-blue-700 text-white text-center font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : 'Check In'}
              </button>
            </>
          ) : (
            <>
              {renderFeedbackForm()}
              {/* <button
                onClick={handleSubmitFeedback}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mt-4"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : 'Submit Feedback'}
              </button>
              <button
                onClick={handleCheckOut}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mt-4"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : 'Check Out'}
              </button> */}
            </>
          )}
          {message && <p className="text-green-500 mt-2">{message}</p>}
        </motion.div>
      )}
    </div>
  );
};

export default CanvasserApp;
