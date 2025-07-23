import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/loginpage';
import AuthCallback from './pages/authcallbackpage';
import Dashboard from './pages/dashboardpage';
import AppDetails from './pages/AppDetails';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/app" element={<AppDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
