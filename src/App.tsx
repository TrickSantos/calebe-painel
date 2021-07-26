import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Routes from './routes'
import GlobalStyle from './Style/global'
import 'antd/dist/antd.css'
import { AuthProvider } from './Context/AuthContext'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes />
        <GlobalStyle />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
