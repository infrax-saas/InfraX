import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { AuthCallBack } from './authcallback'
import { HomePage } from './homepage'
import { Normal } from './normal'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/normal' element={<Normal />} />
        <Route path="/auth/callback" element={<AuthCallBack />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
