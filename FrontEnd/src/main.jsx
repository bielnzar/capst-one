import React from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import App from './App.jsx'
import './index.css'

// Setup axios baseURL untuk semua requests
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
axios.defaults.baseURL = apiUrl

// Setup axios interceptor untuk include token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Log untuk debugging
console.log('API URL configured:', apiUrl)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

