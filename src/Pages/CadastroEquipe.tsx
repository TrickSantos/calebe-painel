import React, { useEffect, useState } from 'react'
import {
  Button,
  Col,
  Input,
  message,
  Row,
  Select,
  Spin,
  Steps,
  Typography
} from 'antd'
import { useForm, Controller } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import NumberFormat, { NumberFormatValues } from 'react-number-format'
import { formatCPF } from '@brazilian-utils/brazilian-utils'
import { IDistrito, IError, IIgreja } from '../Types'
import api from '../Service/api'
import { AxiosError } from 'axios'

const { Title, Text } = Typography

const CadastroEquipe: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const { control, handleSubmit } = useForm({ mode: 'all' })
  const [step, setStep] = useState(0)
  const [distritos, setDistritos] = useState<IDistrito[]>([] as IDistrito[])
  const [igrejas, setIgrejas] = useState<IIgreja[] | undefined>([] as IIgreja[])
  const history = useHistory()

  useEffect(() => {
    async function Load() {
      await api
        .get('/distritos')
        .then(({ data }) => {
          setDistritos(data)
          setLoading(false)
        })
        .catch((e: AxiosError) => {
          message.error(e.response?.data)
          setLoading(false)
        })
    }
    Load()
  }, [])

  return (
    <Row className="container" justify="center" align="middle">
      <Col xxl={5} xl={8} lg={8} md={10} sm={18} xs={20}>
        <Spin spinning={loading}>
          <Col className="loginForm">
            <Steps current={step}>
              <Steps.Step title="Cadastro da Equipe" />
              <Steps.Step title="Líder da Equipe" />
            </Steps>
            {step === 0 && (
              <>
                <Col className="marginTopBottom">
                  <Title level={4}>Nome da Equipe</Title>
                  <Controller
                    name="equipe.nome"
                    control={control}
                    rules={{
                      required: 'O nome da equipe precisa ser informada'
                    }}
                    render={({
                      field: { value, onBlur, onChange },
                      fieldState: { error }
                    }) => (
                      <>
                        <Input
                          size="large"
                          placeholder="Nome da equipe"
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
                  <Title level={4}>Instagram da Equipe (Somente o @)</Title>
                  <Controller
                    name="equipe.instagram"
                    control={control}
                    rules={{
                      required: 'O instagram da equipe precisa ser informado'
                    }}
                    render={({
                      field: { value, onBlur, onChange },
                      fieldState: { error }
                    }) => (
                      <>
                        <Input
                          size="large"
                          placeholder="Instagram da equipe"
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
                  <Title level={4}>Distrito</Title>
                  <Controller
                    name="equipe.distritoId"
                    control={control}
                    rules={{
                      required: 'O distrito da equipe precisa ser informado'
                    }}
                    render={({
                      field: { value, onChange },
                      fieldState: { error }
                    }) => (
                      <>
                        <Select
                          style={{ width: '100%' }}
                          size="large"
                          showSearch
                          optionFilterProp="children"
                          placeholder="Selecione..."
                          value={value}
                          onChange={value => {
                            const ig = distritos.find(
                              ({ id }) => id === value
                            )?.igrejas
                            setIgrejas(ig)
                            onChange(value)
                          }}
                        >
                          {distritos.map(distrito => (
                            <Select.Option
                              key={distrito.id}
                              value={distrito.id}
                            >
                              {distrito.nome}
                            </Select.Option>
                          ))}
                        </Select>
                        {error && <Text type="danger">{error.message}</Text>}
                      </>
                    )}
                  />
                </Col>
                <Col className="marginTopBottom">
                  <Title level={4}>Igreja</Title>
                  <Controller
                    name="equipe.igrejaId"
                    control={control}
                    rules={{
                      required: 'A igreja da equipe precisa ser informada'
                    }}
                    render={({
                      field: { value, onChange },
                      fieldState: { error }
                    }) => (
                      <>
                        <Select
                          value={value}
                          onChange={onChange}
                          showSearch
                          optionFilterProp="children"
                          style={{ width: '100%' }}
                          size="large"
                          placeholder="Selecione..."
                        >
                          {igrejas?.map(igreja => (
                            <Select.Option key={igreja.id} value={igreja.id}>
                              {igreja.nome}
                            </Select.Option>
                          ))}
                        </Select>
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
                    onClick={() => setStep(1)}
                  >
                    CONTINUAR
                  </Button>
                  <Button
                    size="large"
                    type="text"
                    block
                    onClick={() => history.push('/')}
                  >
                    Ir para login
                  </Button>
                </Row>
              </>
            )}
            {step === 1 && (
              <>
                <Col className="marginTopBottom">
                  <Title level={4}>Nome do Líder</Title>
                  <Controller
                    name="lider.nome"
                    control={control}
                    rules={{
                      required: 'O nome do líder precisa ser informado'
                    }}
                    render={({
                      field: { value, onBlur, onChange },
                      fieldState: { error }
                    }) => (
                      <>
                        <Input
                          size="large"
                          placeholder="Nome do líder"
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
                  <Title level={4}>Email</Title>
                  <Controller
                    name="lider.email"
                    control={control}
                    rules={{
                      required: 'O Email do líder precisa ser informado',
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
                <Col className="marginTopBottom">
                  <Title level={4}>CPF do Líder</Title>
                  <Controller
                    name="lider.cpf"
                    control={control}
                    rules={{
                      required: 'O CPF do líder precisa ser informado'
                    }}
                    render={({
                      field: { value, onChange, onBlur },
                      fieldState: { error }
                    }) => (
                      <>
                        <NumberFormat
                          className="ant-input ant-input-lg"
                          format={formatCPF}
                          placeholder="CPF"
                          value={value}
                          onBlur={onBlur}
                          onValueChange={(value: NumberFormatValues) =>
                            onChange(value.value)
                          }
                        />
                        {error && <Text type="danger">{error.message}</Text>}
                      </>
                    )}
                  />
                </Col>
                <Col className="marginTopBottom">
                  <Title level={4}>Senha</Title>
                  <Controller
                    name="lider.password"
                    control={control}
                    rules={{
                      required: 'A senha precisa ser informada'
                    }}
                    render={({
                      field: { value, onChange, onBlur },
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
                    onClick={() => {
                      handleSubmit(async data => {
                        setLoading(true)
                        await api
                          .post('/equipe', data)
                          .then(() => {
                            message.success(
                              'Sua Equipe foi cadastrada com sucesso!'
                            )
                            message.success('Siga as instruções no seu email')
                            setLoading(false)
                            history.push('/')
                          })
                          .catch(({ response }: AxiosError) => {
                            if (response?.data.errors) {
                              response.data.errors.forEach((error: IError) =>
                                message.error(error.message)
                              )
                            } else {
                              message.error(response?.data)
                            }
                            setLoading(false)
                          })
                      })()
                    }}
                  >
                    ENVIAR
                  </Button>
                  <Button
                    size="large"
                    type="text"
                    block
                    onClick={() => setStep(0)}
                  >
                    Voltar
                  </Button>
                </Row>
              </>
            )}
          </Col>
        </Spin>
      </Col>
    </Row>
  )
}

export default CadastroEquipe
