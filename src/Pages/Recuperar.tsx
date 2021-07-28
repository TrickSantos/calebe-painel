import React, { useEffect, useState } from 'react'
import { Button, Col, Input, message, Row, Spin, Typography } from 'antd'
import { useForm, Controller } from 'react-hook-form'
import { useHistory, useParams } from 'react-router-dom'
import api from '../Service/api'
import { AxiosError } from 'axios'
import { IError } from '../Types'

const { Title, Text } = Typography

interface ParamTypes {
  token: string
  id: string
}

const Recuperar: React.FC = () => {
  const { token, id } = useParams<ParamTypes>()
  const [loading, setLoading] = useState(false)
  const { control, watch, handleSubmit, reset } = useForm({ mode: 'all' })
  const history = useHistory()
  const password = watch('password')

  const onSubmit = async (data: { password: string }) => {
    try {
      await api.put(`/usuario/${id}`, data).then(() => {
        localStorage.clear()
        reset({})
        message.success('Senha alterada com sucesso!')
        history.replace('/')
      })
    } catch (error) {
      const { response } = error as AxiosError
      if (response?.data.errors) {
        response.data.errors.forEach((error: IError) =>
          message.error(error.message)
        )
      } else {
        message.error(response?.data)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    localStorage.setItem('TOKEN_API', token)
  }, [token])

  return (
    <Row className="container" justify="center" align="middle">
      <Col xxl={5} xl={6} lg={8} md={10} sm={18} xs={20}>
        <Spin spinning={loading}>
          <Col className="loginForm">
            <Col className="marginTopBottom">
              <Title level={4}>Nova senha</Title>
              <Controller
                name="password"
                control={control}
                rules={{
                  required: 'A senha precisa ser informada'
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
            <Col className="marginTopBottom">
              <Title level={4}>Confirme a senha</Title>
              <Controller
                name="confirm_password"
                control={control}
                rules={{
                  required: 'A senha deve ser informada',
                  validate: value =>
                    value === password || 'As senhas não são iguais'
                }}
                render={({
                  field: { value, onBlur, onChange },
                  fieldState: { error }
                }) => (
                  <>
                    <Input.Password
                      size="large"
                      placeholder="Confirme a senha"
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
                ENVIAR
              </Button>
              <Button
                size="large"
                type="text"
                block
                onClick={() => {
                  localStorage.clear()
                  history.push('/')
                }}
              >
                Ir para login?
              </Button>
            </Row>
          </Col>
        </Spin>
      </Col>
    </Row>
  )
}

export default Recuperar
