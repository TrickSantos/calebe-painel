import React, { ReactElement, useEffect, useState } from 'react'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Drawer,
  Input,
  message,
  PageHeader,
  Row,
  Select,
  Skeleton,
  Space,
  Spin,
  Table,
  Tooltip,
  Typography
} from 'antd'
import { AxiosError } from 'axios'
import { useParams } from 'react-router-dom'
import api from '../Service/api'
import { IEquipe, IError, IUsuario } from '../Types'
import { Controller, useForm } from 'react-hook-form'
import NumberFormat, { NumberFormatValues } from 'react-number-format'
import { formatCPF } from '@brazilian-utils/brazilian-utils'
import { Container } from '../Components'
import { useAuth } from '../Context/AuthContext'

const { Column } = Table
const { Item } = Descriptions
const { Title, Text } = Typography

interface ParamTypes {
  equipeId: string
}

export default function Usuarios(): ReactElement {
  const { control, handleSubmit, reset } = useForm({ mode: 'all' })
  const { equipeId } = useParams<ParamTypes>()
  const { user } = useAuth()
  const [equipe, setEquipe] = useState<IEquipe | null>(null)
  const [drawer, setDrawer] = useState<'none' | 'insert' | 'update'>('none')
  const [usuario, setUsuario] = useState(0)
  const [load, setLoad] = useState(false)
  const [loading, setLoading] = useState(false)
  const [waiting, setWaiting] = useState(false)

  useEffect(() => {
    async function getEquipe() {
      setLoading(true)
      try {
        await api.get(`/equipe/${equipeId}`).then(({ data }) => {
          setEquipe(data)
        })
      } catch (error) {
        const { response } = error as AxiosError
        message.error(response?.data)
      } finally {
        setLoading(false)
      }
    }
    getEquipe()
  }, [equipeId, load])

  const onSubmit = async (data: IUsuario) => {
    try {
      setWaiting(true)
      if (drawer === 'insert') {
        await api.post('/usuario', { ...data, equipeId }).then(() => {
          setLoad(!load)
          message.success('Cadastrado com sucesso!')
          onClose()
        })
      }
      if (drawer === 'update') {
        await api.put(`/usuario/${usuario}`, { ...data, equipeId }).then(() => {
          setLoad(!load)
          message.success('Atualizado com sucesso!')
          onClose()
        })
      }
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
      setWaiting(false)
    }
  }

  const onClose = () => {
    reset({})
    setDrawer('none')
  }

  return (
    <Container>
      <Skeleton paragraph={{ rows: 3 }} loading={loading} active>
        <PageHeader
          ghost={false}
          title={`Equipe: ${equipe?.nome}`}
          extra={[
            <Button
              key={1}
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setDrawer('insert')}
            >
              Adicionar membro
            </Button>
          ]}
        >
          <Descriptions size="middle" column={2}>
            <Item label="Distrito">{equipe?.igreja.distrito.nome}</Item>
            <Item label="Igreja">{equipe?.igreja.nome}</Item>
            <Item label="Instagram">@{equipe?.instagram}</Item>
          </Descriptions>
        </PageHeader>
        <Divider />
        <Row>
          <Col span={24}>
            <Card>
              <Table<IUsuario>
                dataSource={equipe?.membros}
                rowKey={equipe => equipe.id}
              >
                <Column<IUsuario> title="Nome" dataIndex="nome" key="nome" />

                <Column<IUsuario>
                  key="actions"
                  render={(_, membro) => (
                    <Space>
                      <Tooltip title="Editar">
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          onClick={() => {
                            setUsuario(membro.id)
                            reset(membro)
                            setDrawer('update')
                          }}
                        />
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          onClick={async () => {
                            setLoading(true)
                            await api
                              .delete(`/usuario/${membro.id}`)
                              .then(() => {
                                setLoad(!load)
                              })
                              .finally(() => setLoading(false))
                          }}
                        />
                      </Tooltip>
                    </Space>
                  )}
                />
              </Table>
            </Card>
          </Col>
        </Row>
      </Skeleton>
      <Drawer visible={drawer !== 'none'} destroyOnClose onClose={onClose}>
        <Spin spinning={waiting}>
          <Row>
            <Col span={24}>
              <Title level={4}>Nome</Title>
              <Controller
                name="nome"
                rules={{ required: 'O nome precisa ser informado' }}
                control={control}
                render={({
                  field: { value, onBlur, onChange },
                  fieldState: { error }
                }) => (
                  <>
                    <Input
                      size="large"
                      placeholder="Nome"
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                    />
                    {error && <Text type="danger">{error.message}</Text>}
                  </>
                )}
              />
            </Col>
            <Col span={24}>
              <Title level={4}>Email</Title>
              <Controller
                name="email"
                rules={{
                  required: 'O Email precisa ser informado',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: 'Entre com um email válido'
                  }
                }}
                control={control}
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
            <Col span={24}>
              <Title level={4}>CPF</Title>
              <Controller
                name="cpf"
                rules={{ required: 'O CPF precisa ser informado' }}
                control={control}
                render={({
                  field: { value, onBlur, onChange },
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
            <Col span={24}>
              <Title level={4}>Cargo</Title>
              <Controller
                name="perfil"
                rules={{ required: 'O perfil precisa ser informado' }}
                control={control}
                render={({
                  field: { value, onChange },
                  fieldState: { error }
                }) => (
                  <>
                    <Select
                      placeholder="Selecione..."
                      value={value}
                      onChange={onChange}
                      style={{ width: '100%' }}
                      size="large"
                    >
                      <Select.Option key="membro" value="membro">
                        Membro
                      </Select.Option>
                      <Select.Option key="lider" value="lider">
                        Líder
                      </Select.Option>
                      {(user?.perfil === 'admin' ||
                        user?.perfil === 'pastor') && (
                        <Select.Option key="pastor" value="pastor">
                          Pastor
                        </Select.Option>
                      )}
                    </Select>
                    {error && <Text type="danger">{error.message}</Text>}
                  </>
                )}
              />
            </Col>
            <Col span={24} className="marginTopBottom">
              <Row gutter={8}>
                <Col span={12}>
                  <Button size="large" danger block onClick={onClose}>
                    Cancelar
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    size="large"
                    block
                    type="primary"
                    onClick={() => handleSubmit(onSubmit)()}
                  >
                    Salvar
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Spin>
      </Drawer>
    </Container>
  )
}
