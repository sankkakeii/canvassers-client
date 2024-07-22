import React from 'react'

export default function Register() {
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

      
      
    return (
        <div>Register</div>
    )
}
