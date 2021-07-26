import React, { useContext } from 'react'
import { Switch, Route } from 'react-router-dom'
import App from './Routes/app.routes'
import Login from './Pages/Login'
import Recuperar from './Pages/Recuperar'
import CadastroEquipe from './Pages/CadastroEquipe'
import AuthContext from './Context/AuthContext'

const Routes: React.FC = () => {
  const { signed } = useContext(AuthContext)

  if (!signed) {
    return (
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/recuperar/:token/:id" component={Recuperar} />
        <Route path="/cadastro_equipe" component={CadastroEquipe} />
      </Switch>
    )
  }

  return (
    <Switch>
      <App />
    </Switch>
  )
}

export default Routes
