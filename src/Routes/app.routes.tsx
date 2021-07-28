import { Col, Divider, Layout, Menu, Row } from 'antd'
import {
  TeamOutlined,
  TrophyOutlined,
  BookOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import React, { useContext } from 'react'
import { Switch, useHistory } from 'react-router-dom'
import Desafios from '../Pages/Desafios'
import Devocionais from '../Pages/Devocionais'
import Equipes from '../Pages/Equipes'
import Usuarios from '../Pages/Usuarios'
import ProtectedRoute from './protected'
import Title from 'antd/lib/typography/Title'
import AuthContext from '../Context/AuthContext'
import Home from '../Pages/Home'

const Routes: React.FC = () => {
  const history = useHistory()
  const { logout, user } = useContext(AuthContext)
  return (
    <Layout style={{ height: '100%' }}>
      <Layout.Sider theme="light" breakpoint="xl" collapsedWidth="0">
        <Row justify="center" align="middle">
          <Col>
            <Title level={3}>Painel Calebe</Title>
          </Col>
        </Row>
        <Divider />
        <Menu>
          <Menu.Item
            icon={<TeamOutlined />}
            key="Equipes"
            onClick={() => history.push('/equipes')}
            disabled={user?.perfil !== 'pastor' && user?.perfil !== 'admin'}
          >
            Equipes
          </Menu.Item>
          {user?.perfil === 'lider' && (
            <Menu.Item
              icon={<TeamOutlined />}
              key="Membros"
              onClick={() => history.push(`/membros/${user?.equipeId}`)}
            >
              Membros
            </Menu.Item>
          )}
          <Menu.Item
            icon={<TrophyOutlined />}
            onClick={() => history.push('/desafios')}
            key="Desafios"
            disabled={user?.perfil !== 'pastor' && user?.perfil !== 'admin'}
          >
            Desafios
          </Menu.Item>
          <Menu.Item
            icon={<BookOutlined />}
            key="Devocionais"
            onClick={() => history.push('/devocionais')}
            disabled={user?.perfil !== 'pastor' && user?.perfil !== 'admin'}
          >
            Devocionais
          </Menu.Item>
          <Menu.Item
            icon={<LogoutOutlined />}
            key="Sair"
            onClick={async () => {
              await logout().then(() => history.push('/'))
            }}
          >
            Sair
          </Menu.Item>
        </Menu>
      </Layout.Sider>
      <Layout.Content style={{ margin: '1rem' }}>
        <Switch>
          <ProtectedRoute path="/equipes" exact component={Equipes} />
          <ProtectedRoute path="/home" exact component={Home} />
          <ProtectedRoute
            path="/equipes/:equipeId"
            exact
            component={Usuarios}
          />
          <ProtectedRoute
            path="/membros/:equipeId"
            exact
            component={Usuarios}
          />
          <ProtectedRoute path="/desafios" exact component={Desafios} />
          <ProtectedRoute path="/devocionais" exact component={Devocionais} />
        </Switch>
      </Layout.Content>
    </Layout>
  )
}

export default Routes
