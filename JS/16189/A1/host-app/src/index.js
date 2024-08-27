import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const ListingApp = React.lazy(() => import("ListingApp/Listing"));
const CheckoutApp = React.lazy(() => import("CheckoutApp/Checkout"));

const App = () => (
  <div>
    <Suspense fallback={<div>Loading...</div>}>
      <ListingApp />
      <CheckoutApp />
    </Suspense>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
