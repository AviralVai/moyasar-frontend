import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SubscriptionStatus = ({ invoiceId }) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const res = await axios.get(
        `https://localhost:7165/api/payment/invoice/status/${invoiceId}`
      );
      setStatus(res.data.status);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // optional: poll every minute
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, [invoiceId]);

  if (loading) return <p>Loading status…</p>;
  if (status === 'paid') {
    return <p>Your subscription is active until { /* show EndDate from another endpoint */ }</p>;
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
