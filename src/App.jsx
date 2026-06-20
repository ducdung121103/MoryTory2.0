import { Routes, Route } from 'react-router-dom';
import { ToastProvider } from './store/ToastContext';
import { AuthProvider } from './store/AuthContext';
import { DesignProvider } from './store/DesignContext';
import { CartProvider } from './store/CartContext';
import HomePage from './components/HomePage';
import DesignPage from './components/DesignPage';
import ARRoute from './components/ARRoute';
import OrderStatusPage from './components/OrderStatusPage';
import ProfilePage from './components/ProfilePage';
import CartIcon from './components/CartIcon';
import CartModal from './components/CartModal';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <DesignProvider>
            <CartIcon />
            <CartModal />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/design" element={<DesignPage />} />
              <Route path="/ar" element={<ARRoute />} />
              <Route path="/order-status" element={<OrderStatusPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </DesignProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
