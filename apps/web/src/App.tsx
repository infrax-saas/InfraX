import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/loginpage';
import AuthCallback from './pages/authcallbackpage';
import Dashboard from './pages/dashboardpage';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
