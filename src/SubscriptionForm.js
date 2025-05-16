

import { v4 as uuidv4 } from 'uuid';
// const generateCustomerId = () => 'cust-' + uuidv4();
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Utility function to generate a random customer ID
const generateCustomerId = () => {
  return 'cust' + Math.floor(100000 + Math.random() * 900000).toString(); // e.g., cust123456
};

const SubscriptionForm = () => {
  const [formData, setFormData] = useState({
    subscriptionId: 'sub001',
    customerId: '',
    customerName: '',
    email: '',
    phoneNumber: '',
    amount: 10000, // in halalas (100.00 SAR)
    paymentStatus: 'pending'
  });

  const [showForm, setShowForm] = useState(false);

  // Generate customerId on initial render
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      customerId: generateCustomerId()
    }));
  }, []);

  const handleSubscriptionSelect = () => {
    // Update the URL with subscription details
    const params = new URLSearchParams({
      subscriptionId: formData.subscriptionId,
      customerId: formData.customerId,
      amount: formData.amount,
    });
    window.history.pushState({}, '', '?' + params.toString());
    setShowForm(true);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://localhost:7165/api/payment/create', formData);
      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
      alert('Failed to create payment. Please try again.');
    }
  };

  const cardStyle = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    margin: '20px auto',
    maxWidth: '400px',
    textAlign: 'center',
    backgroundColor: '#fff'
  };

  const buttonStyle = {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {!showForm && (
        <div style={cardStyle}>
          <h2>Subscription Details</h2>
          <p><strong>Subscription ID:</strong> {formData.subscriptionId}</p>
          <p><strong>Customer ID:</strong> {formData.customerId}</p>
          <p><strong>Price:</strong> SAR {(formData.amount / 100).toFixed(2)}</p>
          <button style={buttonStyle} onClick={handleSubscriptionSelect}>Select Subscription</button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '20px auto', textAlign: 'center' }}>
          <h2>Enter Your Details</h2>
          <input
            type="text"
            name="customerName"
            placeholder="Name"
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', margin: '10px 0' }}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', margin: '10px 0' }}
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', margin: '10px 0' }}
          />
          <button type="submit" style={{ ...buttonStyle, width: '100%', marginTop: '10px' }}>Pay Now</button>
        </form>
      )}
    </div>
  );
};

export default SubscriptionForm;
