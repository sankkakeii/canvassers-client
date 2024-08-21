import React, { useState, useEffect } from 'react';
import { FaInfoCircle } from 'react-icons/fa';

const CanvasserApp = () => {
    const [user, setUser] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [location, setLocation] = useState(null);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        phone: '',
    });
    const [lastFetchDate, setLastFetchDate] = useState(new Date().toDateString());
    const [selectedBranch, setSelectedBranch] = useState('');
    const [showTutorial, setShowTutorial] = useState(false);
    const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);
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
                try {
                    const response = await fetch(`${API_URL}/supa/check-in`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const data = await response.json();
                    if (data.isCheckedIn) {
                        setIsCheckedIn(true);
                    }
                } catch (error) {
                    console.error('Error checking login status:', error);
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

            return response.json();
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const handleRegister = async e => {
        e.preventDefault();
        try {
            const response = await registerUser(formData);
            setMessage(response.message);
            setIsRegistering(false);
        } catch (error) {
            setMessage('Registration failed. Please try again.');
        }
    };

    const handleSignIn = async e => {
        e.preventDefault();
        try {
            const response = await loginUser(formData);
            setUser(response.user);
            localStorage.setItem('token', response.token);
            setMessage(`Welcome, ${response.user.name}!`);
        } catch (error) {
            setMessage(`Login failed. ${error.message}`);
        }
    };

    const handleCheckIn = async () => {
        try {
            const token = localStorage.getItem('token');
            const checkinLocation = JSON.stringify(location);

            const response = await fetch(`${API_URL}/supa/check-in`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ location: checkinLocation, branch: selectedBranch }),
            });

            if (!response.ok) {
                console.error('Check-in error:', response);
                throw new Error('Check-in failed');
            }

            const data = await response.json();
            setIsCheckedIn(true);
            setMessage(data.message);
        } catch (error) {
            console.error('Check-in error:', error);
            setMessage('Check-in failed. Please try again.');
        }
    };

    const handleCheckOut = async () => {
        if (!isFeedbackSubmitted) {
            setMessage('Please provide feedback before checking out.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/supa/check-out`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Check-out failed');
            }

            const data = await response.json();
            setIsCheckedIn(false);
            setMessage(data.message || 'Checked out successfully.');
        } catch (error) {
            console.error('Check-out error:', error);
            setMessage('Check-out failed. Please try again.');
        }
    };

    const handleFeedbackChange = e => {
        setFeedback(e.target.value);
    };


    const handleSubmitFeedback = async (e) => {
        e.preventDefault();
        if (!feedback.trim()) {
            setMessage('Please provide feedback before checking out.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const feedbackData = {
                feedback: feedback,
            };
            const response = await fetch(`${API_URL}/supa/record-feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(feedbackData)
            });

            if (!response.ok) {
                throw new Error('Failed to record feedback');
            }

            setMessage('Feedback recorded successfully!');
            setFeedback('');
            setIsFeedbackSubmitted(true);
        } catch (error) {
            console.error('Error recording feedback:', error);
            setMessage('Failed to record feedback. Please try again.');
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

    const renderFeedbackForm = () => (
        <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="feedback">
                Feedback
            </label>
            <textarea
                id="feedback"
                value={feedback}
                onChange={handleFeedbackChange}
                placeholder="Please provide your feedback before checking out..."
                className="appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
            />
        </div>
    );

    return (
        <div className="flex flex-col items-center justify-center w-full h-screen p-4 gap-6 sm:flex-row">
            <FaInfoCircle
                className="absolute top-3 left-3 text-red-500 text-2xl cursor-pointer"
                onClick={() => setShowTutorial(true)}
            />
            {showTutorial && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                </div>
            )}
            {!user && (
                <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-1/2 lg:w-1/3">
                    <h1 className="text-2xl font-bold mb-4">Login/Register</h1>
                    {renderAuthForm()}
                    {message && <p className="text-red-500 mt-2">{message}</p>}
                </div>
            )}
            {user && (
                <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-1/2 lg:w-1/3">
                    <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h1>
                    {!isCheckedIn ? (
                        <>
                            <button
                                onClick={handleCheckIn}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                            >
                                Check In
                            </button>
                        </>
                    ) : (
                        <>
                            {renderFeedbackForm()}
                            <button
                                onClick={handleSubmitFeedback}
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mt-4"
                            >
                                Submit Feedback
                            </button>
                            <button
                                onClick={handleCheckOut}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mt-4"
                            >
                                Check Out
                            </button>
                        </>
                    )}
                    {message && <p className="text-green-500 mt-2">{message}</p>}
                </div>
            )}
        </div>
    );
};

export default CanvasserApp;






















// NEW FORM BELOW 

// import React, { useState, useEffect } from 'react';
// import AuthForm from '@/components/main-components/Auth';
// import FeedbackForm from '@/components/main-components/FeedbackForm';
// import UserGuideModal from '@/components/main-components/UserGuide';

// const CanvasserApp = () => {
//   const [user, setUser] = useState(null);
//   const [isRegistering, setIsRegistering] = useState(false);
//   const [isCheckedIn, setIsCheckedIn] = useState(false);
//   const [feedback, setFeedback] = useState('');
//   const [location, setLocation] = useState(null);
//   const [message, setMessage] = useState('');
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     name: '',
//     phone: '',
//   });
//   const [selectedBranch, setSelectedBranch] = useState('');
//   const [showTutorial, setShowTutorial] = useState(false);
//   const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);
//   const API_URL = '/api';

//   useEffect(() => {
//     if ('geolocation' in navigator) {
//       navigator.geolocation.getCurrentPosition(position => {
//         setLocation({
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//         });
//       });
//     }
//   }, []);

//   useEffect(() => {
//     const checkLoginStatus = async () => {
//       const token = localStorage.getItem('token');
//       if (token) {
//         try {
//           const response = await fetch(`${API_URL}/supa/check-in`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           const data = await response.json();
//           if (data.isCheckedIn) {
//             setIsCheckedIn(true);
//           }
//         } catch (error) {
//           console.error('Error checking login status:', error);
//         }
//       }
//     };
//     checkLoginStatus();
//   }, []);

//   const handleInputChange = e => {
//     const { name, value } = e.target;
//     setFormData(prevState => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const registerUser = async userData => {
//     const response = await fetch(`${API_URL}/supa/register`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(userData),
//     });
//     if (!response.ok) {
//       throw new Error('Registration failed');
//     }
//     return response.json();
//   };

//   const loginUser = async credentials => {
//     try {
//       const response = await fetch(`${API_URL}/supa/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(credentials),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Login failed');
//       }

//       return response.json();
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     }
//   };

//   const handleRegister = async e => {
//     e.preventDefault();
//     try {
//       const response = await registerUser(formData);
//       setMessage(response.message);
//       setIsRegistering(false);
//     } catch (error) {
//       setMessage('Registration failed. Please try again.');
//     }
//   };

//   const handleSignIn = async e => {
//     e.preventDefault();
//     try {
//       const response = await loginUser(formData);
//       setUser(response.user);
//       localStorage.setItem('token', response.token);
//       setMessage('Login successful!');
//     } catch (error) {
//       setMessage(error.message);
//     }
//   };

//   const handleCheckIn = async () => {
//     if (!user) {
//       setMessage('Please log in to check in.');
//       return;
//     }

//     try {
//       const response = await fetch(`${API_URL}/supa/check-in`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ location, selectedBranch }),
//       });

//       if (!response.ok) {
//         throw new Error('Check-in failed');
//       }

//       const data = await response.json();
//       setIsCheckedIn(true);
//       setMessage('Check-in successful!');
//     } catch (error) {
//       setMessage('Check-in failed. Please try again.');
//     }
//   };

//   const handleFeedbackChange = e => {
//     setFeedback(e.target.value);
//   };

//   const handleSubmitFeedback = async () => {
//     if (!isCheckedIn) {
//       setMessage('Please check in before submitting feedback.');
//       return;
//     }

//     try {
//       const response = await fetch(`${API_URL}/supa/submit-feedback`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ feedback }),
//       });

//       if (!response.ok) {
//         throw new Error('Feedback submission failed');
//       }

//       setIsFeedbackSubmitted(true);
//       setMessage('Feedback submitted successfully!');
//     } catch (error) {
//       setMessage('Feedback submission failed. Please try again.');
//     }
//   };

//   const handleCheckOut = async () => {
//     if (!isCheckedIn || !isFeedbackSubmitted) {
//       setMessage('You must submit feedback before checking out.');
//       return;
//     }

//     try {
//       const response = await fetch(`${API_URL}/supa/check-out`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Check-out failed');
//       }

//       setIsCheckedIn(false);
//       setIsFeedbackSubmitted(false);
//       setFeedback('');
//       setMessage('Check-out successful!');
//     } catch (error) {
//       setMessage('Check-out failed. Please try again.');
//     }
//   };

//   const toggleRegistering = () => {
//     setIsRegistering(prevState => !prevState);
//     setMessage('');
//   };

//   return (
//     <div className="flex flex-col w-full h-screen items-center justify-center mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Canvasser Application</h1>
//       <UserGuideModal showTutorial={showTutorial} setShowTutorial={setShowTutorial} />
//       {message && <div className="mb-4 text-red-500">{message}</div>}
//       {!user ? (
//         <AuthForm
//           isRegistering={isRegistering}
//           formData={formData}
//           handleInputChange={handleInputChange}
//           handleRegister={handleRegister}
//           handleSignIn={handleSignIn}
//           toggleRegistering={toggleRegistering}
//         />
//       ) : (
//         <>
//           <div className="mb-4 bg-white p-6 rounded-lg shadow-lg w-full sm:w-1/2 lg:w-1/3">
//             <h2 className="text-xl font-bold mb-2">Welcome, {user.name}!</h2>
//             <button
//               onClick={handleCheckIn}
//               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mt-4"
//               disabled={isCheckedIn}
//             >
//               Check In
//             </button>
//           </div>
//           {isCheckedIn && !isFeedbackSubmitted && (
//             <FeedbackForm
//               feedback={feedback}
//               handleFeedbackChange={handleFeedbackChange}
//               handleSubmitFeedback={handleSubmitFeedback}
//             />
//           )}
//           {isCheckedIn && isFeedbackSubmitted && (
//             <button
//               onClick={handleCheckOut}
//               className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mt-4"
//             >
//               Check Out
//             </button>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default CanvasserApp;


