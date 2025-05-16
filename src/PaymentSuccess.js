
// import { useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import axios from 'axios';

// const PaymentStatusPage = () => {
//   const location = useLocation();

//   useEffect(() => {
//     const queryParams = new URLSearchParams(location.search);
//     const id = queryParams.get('id');
//     const status = queryParams.get('status');
//     const message = queryParams.get('message');
//     const invoice_id = queryParams.get('invoice_id');

//     const customerId = location.pathname.split('/').pop(); // cust001

//     // Call the backend API
//     axios.post(`https://localhost:7165/api/Payment/status/${customerId}`, {
//       id,
//       status,
//       message,
//       invoice_id,
//     })
//     .then((res) => {
//       console.log('Payment status saved:', res.data);
//     })
//     .catch((err) => {
//       console.error('Error saving payment status:', err);
//     });
//   }, [location]);

//   return <div>Processing your payment...</div>;
// };

// export default PaymentStatusPage;








import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import SubscriptionStatus from './SubscriptionStatus';

const PaymentStatusPage = () => {
  const location = useLocation();
  const [invoiceId, setInvoiceId] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    const status = queryParams.get('status');
    const message = queryParams.get('message');
    const invoice_id = queryParams.get('invoice_id');

    const customerId = location.pathname.split('/').pop(); // example: cust001

    setInvoiceId(id); // 📌 Use this to render SubscriptionStatus

    // Call the backend API to confirm/update payment
    axios.post(`https://localhost:7165/api/Payment/status/${customerId}`, {
      id,
      status,
      message,
      invoice_id,
    })
    .then((res) => {
      console.log('Payment status saved:', res.data);
    })
    .catch((err) => {
      console.error('Error saving payment status:', err);
    });
  }, [location]);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>🔄 Processing your payment...</h2>
      {invoiceId && (
        <>
          <p>Tracking invoice <strong>{invoiceId}</strong></p>
          <SubscriptionStatus invoiceId={invoiceId} />
        </>
      )}
    </div>
  );
};

export default PaymentStatusPage;
