import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SubscriptionStatus = ({ invoiceId }) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { data } = await axios.get(
          `https://localhost:7165/api/payment/invoice/status/${invoiceId}`
        );
        setStatus(data.status);
        if (data.endDate) {
          setEndDate(new Date(data.endDate).toLocaleDateString());
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load subscription status.');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, [invoiceId]); // ✅ No fetchStatus dependency issue

  if (loading) return <p>Loading status…</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  if (status === 'paid') {
    return (
      <p>Your subscription is active until {endDate || '—'}.</p>
    );
  }

  return (
    <div>
      <p>Your subscription is <strong>{status}</strong>.</p>
      <button onClick={() => window.location.reload()}>
        Retry Payment
      </button>
    </div>
  );
};

export default SubscriptionStatus;

