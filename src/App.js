// import React from 'react';
// import SubscriptionForm from './SubscriptionForm';

// function App() {
//   return (
//     <div className="App">
//       <SubscriptionForm />
//     </div>
//   );
// }

// export default App;


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SubscriptionForm from './SubscriptionForm';
// import PaymentSuccess from './PaymentSuccess';
import PaymentSuccess from './PaymentSuccess';
import ConfirmPayment from './confirmPayment';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SubscriptionForm />} />
        {/* <Route path="/payment-success" element={<PaymentSuccess />} /> */}
        <Route path="/payment-status" element={<PaymentSuccess />} />
        <Route path="/payment/success" element={<ConfirmPayment />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
