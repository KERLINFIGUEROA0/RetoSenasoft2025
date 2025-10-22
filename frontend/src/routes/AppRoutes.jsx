import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import SeatSelectionPage from '../pages/SeatSelectionPage';
import PassengerRegistrationPage from '../pages/PassengerRegistrationPage';
import PaymentPage from '../pages/PaymentPage';
import ConfirmationPage from '../pages/ConfirmationPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/seats/:vueloId" element={<SeatSelectionPage />} />
      <Route path="/passengers" element={<PassengerRegistrationPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/confirmation" element={<ConfirmationPage />} />
    </Routes>
  );
};

export default AppRoutes;