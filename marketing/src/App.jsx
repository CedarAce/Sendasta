import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import MarketingLayout from './components/MarketingLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import ForITAdmins from './pages/ForITAdmins'
import Pricing from './pages/Pricing'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import FAQ from './pages/FAQ'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import AuthCallback from './pages/auth/AuthCallback'
import { Navigate } from 'react-router-dom'
import AdminLayout from './components/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Users from './pages/admin/Users'
import Policies from './pages/admin/Policies'
import Billing from './pages/admin/Billing'
import Documentation from './pages/admin/Documentation'
import Downloads from './pages/admin/Downloads'
import Settings from './pages/admin/Settings'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Marketing — keeps Navbar + Footer */}
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/for-it-admins" element={<ForITAdmins />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
        </Route>

        {/* Auth — centered card, no nav chrome */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Admin — protected + sidebar */}
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/policies" element={<Policies />} />
          <Route path="/admin/billing" element={<Billing />} />
          <Route path="/admin/documentation" element={<Documentation />} />
          <Route path="/admin/downloads" element={<Downloads />} />
          <Route path="/admin/settings" element={<Settings />} />
          {/* Legacy redirects */}
          <Route path="/admin/alert-lists" element={<Navigate to="/admin/policies" replace />} />
          <Route path="/admin/warning-list" element={<Navigate to="/admin/policies" replace />} />
          <Route path="/admin/bypass-list" element={<Navigate to="/admin/policies" replace />} />
          <Route path="/admin/languages" element={<Navigate to="/admin/policies" replace />} />
        </Route>
      </Routes>
    </>
  )
}
