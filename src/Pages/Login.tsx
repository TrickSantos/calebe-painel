import React, { useContext, useState } from 'react'
import { Button, Col, Input, message, Row, Spin, Typography } from 'antd'
import { useForm, Controller } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import { AxiosError } from 'axios'
import { ILogin } from '../Types'
import AuthContext from '../Context/AuthContext'
import api from '../Service/api'

const { Title, Text } = Typography

const Login: React.FC = () => {
  const history = useHistory()
  const { login, loading } = useContext(AuthContext)
  const [waiting, setWaiting] = useState(false)
  const [recuperar, setRecuperar] = useState(false)
  const { control, handleSubmit, reset } = useForm({ mode: 'all' })

  const onSubmit = async (data: ILogin) => {
    try {
      await login(data).then(() => history.replace('/home'))
    } catch (error) {
      const { response } = error
      if (response) {
        message.error(response.data.message)
      } else {
        message.error('Acesso não permitido!')
      }
    }
  }

  const onRecuperar = async (data: ILogin) => {
    try {
      setWaiting(true)
      await api.post('/recuperar', { email: data.email }).then(() => {
        message.success('Você receberá um email com as instruções a seguir!')
        reset({})
        setRecuperar(false)
      })
    } catch (error) {
      const { response } = error as AxiosError
      if (response) {
        message.error(response.data.message)
      }
    } finally {
      setWaiting(false)
    }
  }

  return (
    <Row className="container" justify="center" align="middle">
      <Col xxl={4} xl={6} lg={8} md={10} sm={18} xs={20}>
        <Spin spinning={loading || waiting}>
          <Col className="loginForm">
            <Col className="marginTopBottom">
              <Title level={4}>Email</Title>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'O email deve ser informado',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: 'Entre com um email válido'
                  }
                }}
                render={({
                  field: { value, onBlur, onChange },
                  fieldState: { error }
                }) => (
                  <>
                    <Input
                      size="large"
                      placeholder="Email"
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                    />
                    {error && <Text type="danger">{error.message}</Text>}
                  </>
                )}
              />
            </Col>
            {!recuperar && (
              <>
                <Col className="marginTopBottom">
                  <Title level={4}>Senha</Title>
                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: 'A senha deve ser informada'
                    }}
                    render={({
                      field: { value, onBlur, onChange },
                      fieldState: { error }
                    }) => (
                      <>
                        <Input.Password
                          size="large"
                          placeholder="Senha"
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                        />
                        {error && <Text type="danger">{error.message}</Text>}
                      </>
                    )}
                  />
                </Col>
                <Row className="marginTopBottom">
                  <Button
                    size="large"
                    type="primary"
                    block
                    onClick={() => handleSubmit(onSubmit)()}
                  >
                    ENTRAR
                  </Button>
                  <Button
                    size="large"
                    type="text"
                    block
                    onClick={() => setRecuperar(true)}
                  >
                    Esqueceu a senha?
                  </Button>
                </Row>
              </>
            )}
            {recuperar && (
              <Row className="marginTopBottom">
                <Button
                  size="large"
                  type="primary"
                  block
                  onClick={() => handleSubmit(onRecuperar)()}
                >
                  RECUPERAR
                </Button>
                <Button
                  size="large"
                  type="text"
                  block
                  onClick={() => setRecuperar(false)}
                >
                  Voltar para login
                </Button>
              </Row>
            )}
          </Col>
        </Spin>
      </Col>
    </Row>
  )
}

export default Login
