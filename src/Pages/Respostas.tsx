import React, { ReactElement, useEffect, useState } from 'react'
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Divider,
  Table,
  Space,
  Tooltip,
  Popconfirm,
  message,
  Drawer,
  Spin,
  InputNumber,
  Skeleton,
  PageHeader,
  Descriptions,
  Image,
  Input
} from 'antd'
import { AxiosError } from 'axios'
import { Controller, useForm } from 'react-hook-form'
import { Container } from '../Components'
import api from '../Service/api'
import { IEquipe, IDesafio, IResposta, IError } from '../Types'
import { useParams } from 'react-router-dom'
import Player from 'react-player'
import { isImage } from '../Service/utils'

interface ParamTypes {
  desafioId: string
}

const { Title, Text } = Typography
const { Column } = Table

export default function Respostas(): ReactElement {
  const [drawer, setDrawer] = useState(false)
  const { desafioId } = useParams<ParamTypes>()
  const { control, reset, handleSubmit } = useForm()
  const [loading, setLoading] = useState(false)
  const [waiting, setWaiting] = useState(false)
  const [load, setLoad] = useState(false)
  const [desafio, setDesafio] = useState<IDesafio>({} as IDesafio)
  const [resposta, setResposta] = useState<IResposta | null>(null)
  const [equipes, setEquipes] = useState<IEquipe[]>([] as IEquipe[])

  useEffect(() => {
    async function getRespostas() {
      setLoading(true)
      try {
        await api.get(`/resposta?desafioId=${desafioId}`).then(({ data }) => {
          setEquipes(data)
        })
        await api.get(`/desafio/${desafioId}`).then(({ data }) => {
          setDesafio(data)
        })
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    getRespostas()
  }, [load])

  const onClose = () => {
    reset({})
    setDrawer(false)
    setResposta(null)
  }

  const onSubmit = async (data: IResposta) => {
    try {
      setWaiting(true)
      await api.put(`/resposta/${resposta?.id}`, data).then(() => {
        message.success('Atualizado com sucesso!')
        onClose()
        setLoad(!load)
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
      setWaiting(false)
    }
  }

  return (
    <Container>
      <Skeleton loading={loading}>
        <Row>
          <Col span={24}>
            <Card>
              {/* <Row justify="space-between" align="middle">
                <Typography.Title
                  level={3}
                >{`Desafio ${desafio.titulo}`}</Typography.Title>
              </Row> */}
              <PageHeader
                ghost={false}
                onBack={() => history.back()}
                title={`Desafio ${desafio.titulo}`}
              >
                <Descriptions size="small">
                  <Descriptions.Item label="Desafio">
                    {desafio.conteudo}
                  </Descriptions.Item>
                </Descriptions>
              </PageHeader>
            </Card>
          </Col>
        </Row>
      </Skeleton>
      <Divider />
      <Row>
        <Col span={24}>
          <Card bodyStyle={{ padding: 0 }}>
            <Table<IEquipe>
              dataSource={equipes}
              loading={loading}
              rowKey={equipe => equipe.id}
            >
              <Column<IEquipe> title="Nome" dataIndex="nome" key="nome" />
              <Column<IEquipe>
                title="Status"
                dataIndex="aprovado"
                key="aprovado"
                render={(_, { resposta: { aprovado } }) =>
                  aprovado ? 'Aprovado' : 'Não aprovado ainda'
                }
                filters={[
                  { text: 'Aprovado', value: true },
                  { text: 'Não aprovado', value: false }
                ]}
                onFilter={(value, record) => record.resposta.aprovado === value}
              />
              <Column<IEquipe>
                key="actions"
                render={(_, record) => (
                  <Space>
                    <Tooltip title="Ver Resposta">
                      <Button
                        type="text"
                        icon={<SearchOutlined />}
                        onClick={() => {
                          setResposta(record.resposta)
                          setDrawer(true)
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="Apagar">
                      <Popconfirm
                        title="Apagar resposta?"
                        cancelText="Cancelar"
                        onConfirm={async () => {
                          try {
                            setWaiting(true)
                            await api
                              .delete(`/resposta/${record.resposta.id}`)
                              .then(() => {
                                setLoad(!load)
                              })
                          } catch (error) {
                            const { response } = error as AxiosError
                            message.error(response?.data)
                          } finally {
                            setWaiting(false)
                          }
                        }}
                      >
                        <Button type="text" icon={<DeleteOutlined />} />
                      </Popconfirm>
                    </Tooltip>
                  </Space>
                )}
              />
            </Table>
          </Card>
        </Col>
      </Row>
      <Drawer visible={drawer} onClose={onClose} destroyOnClose width={450}>
        <Spin spinning={waiting}>
          <Row>
            <Col span={24}>
              <Title level={4}>Respostas</Title>
              <Image.PreviewGroup>
                {resposta?.respostas.map(({ resposta }) => {
                  if (isImage(resposta)) {
                    return <Image key={resposta} width={200} src={resposta} />
                  } else {
                    return (
                      <Player
                        key={resposta}
                        controls={true}
                        width={430}
                        url={resposta}
                      />
                    )
                  }
                })}
              </Image.PreviewGroup>
            </Col>
            <Col span={24}>
              <Title level={4}>Observação</Title>
              <Input value={resposta?.observacao} disabled />
            </Col>
            <Col span={24}>
              <Title level={4}>Pontuação</Title>
              <Controller
                name="pontos"
                control={control}
                render={({
                  field: { value, onBlur, onChange },
                  fieldState: { error }
                }) => (
                  <>
                    <InputNumber
                      style={{ width: '100%' }}
                      size="large"
                      placeholder="Pontuação"
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                    />
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
