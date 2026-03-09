import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { HeroUIProvider } from '@heroui/react'
import AuthcontextPrivder from './Context/AuthContextProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <HeroUIProvider>
    <QueryClientProvider client={queryClient}>
    
    <AuthcontextPrivder>
      <ToastContainer />
      <App />
    </AuthcontextPrivder>
    </QueryClientProvider>
  </ HeroUIProvider>
)
