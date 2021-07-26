import React, { useContext } from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import AuthContext from '../Context/AuthContext'

const ProtectedRoute: React.FC<RouteProps> = props => {
  const { signed } = useContext(AuthContext)

  return signed ? <Route {...props} /> : <Redirect to="/" />
}

export default ProtectedRoute
