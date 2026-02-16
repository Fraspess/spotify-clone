import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import AuthPage from './pages/AuthPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Головна зараз = сторінка авторизації */}
        <Route path="/" element={<AuthPage />} />

        {/* Приклад майбутньої головної сторінки додатку */}
        {/* <Route path="/app" element={<MainLayout />} /> */}

        {/* Редірект на / для всіх невідомих шляхів */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
