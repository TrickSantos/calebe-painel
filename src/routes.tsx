import React from 'react'
import { Switch, Route } from 'react-router-dom'
import App from './Routes/app.routes'
import Login from './Pages/Login'
import Recuperar from './Pages/Recuperar'
import CadastroEquipe from './Pages/CadastroEquipe'

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path="/" exact component={Login} />
      <Route path="/recuperar/:token/:id" component={Recuperar} />
      <Route path="/cadastro_equipe" component={CadastroEquipe} />
      <App />
    </Switch>
  )
}

export default Routes
