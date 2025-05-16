import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const InvoiceStatus = () => {
  const location = useLocation();
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [invoiceId, setInvoiceId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const invoice = queryParams.get('id'); // assuming Moyasar returns ?id=invoiceId
    setInvoiceId(invoice);

    if (invoice) {
      axios.get(`https://localhost:7165/api/Payment/invoice/status/${invoice}`)
        .then((res) => {
          setStatus(res.data.status);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching invoice status:', err);
          setError('Something went wrong while checking payment status.');
          setLoading(false);
        });
    } else {
      setError('Invoice ID not found in the URL.');
      setLoading(false);
    }
  }, [location]);

  return (
    <div style={styles.container}>
      <h2>Payment Status</h2>
      {loading ? (
        <p style={styles.loading}>Checking payment status...</p>
      ) : error ? (
        <p style={styles.error}>{error}</p>
      ) : status === 'paid' ? (
        <p style={styles.success}>✅ Payment Successful!</p>
      ) : status === 'failed' ? (
        <p style={styles.failed}>❌ Payment Failed</p>
      ) : (
        <p>Status: {status}</p>
      )}
    </div>
  );
};

export default InvoiceStatus;

const styles = {
  container: {
    margin: '50px auto',
    maxWidth: '500px',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#f7f7f7',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
  },
  loading: {
    color: '#555',
  },
  success: {
    color: 'green',
    fontWeight: 'bold',
  },
  failed: {
    color: 'red',
    fontWeight: 'bold',
  },
  error: {
    color: 'crimson',
  }
};
