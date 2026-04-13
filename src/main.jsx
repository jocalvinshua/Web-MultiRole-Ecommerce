import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { ProductContextProvider } from './context/ProductContext.jsx'
import { AppContextProvider } from './context/AppContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthContextProvider>
      <ProductContextProvider>
        <AppContextProvider>
           <App />
        </AppContextProvider>
      </ProductContextProvider>
    </AuthContextProvider>
  </BrowserRouter>
)