import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NiceModal from '@ebay/nice-modal-react';
import Layout from './components/Layout';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import UnitDetailPage from './pages/UnitDetailPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import PrivateRoute from './components/PrivateRoute';
import DashboardPage from './pages/DashboardPage';
import AccountSettingsPage from './pages/AccountSettingsPage';
import BillsPage from './pages/BillsPage';

function App() {
  return (
    <NiceModal.Provider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Layout>
                  <Routes>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/properties" element={<PropertiesPage />} />
                    <Route path="/account-settings" element={<AccountSettingsPage />}/>
                    <Route path="/properties/:id" element={<PropertyDetailPage />} />
                    <Route path="/units/:id" element={<UnitDetailPage />} />
                    <Route path="/bills/tenant/:tenantId" element={<BillsPage />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </NiceModal.Provider>
  );
}

export default App;
