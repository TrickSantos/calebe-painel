import React, { ReactElement, useEffect, useState } from 'react'
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined
} from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Divider,
  Drawer,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
  Typography,
  Upload
} from 'antd'
import { format, parseISO } from 'date-fns'
import { Container } from '../Components'
import api from '../Service/api'
import { IDesafio, IError } from '../Types'
import { Controller, useForm } from 'react-hook-form'
import DatePicker from '../Components/DatePicker'
import { AxiosError } from 'axios'
import { disabledDate } from '../Service/utils'
import { useHistory } from 'react-router-dom'

const { Column } = Table
const { Title, Text } = Typography

const UploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Foto</div>
  </div>
)

export default function Desafios(): ReactElement {
  const history = useHistory()
  const { control, handleSubmit, reset } = useForm()
  const [loading, setLoading] = useState(false)
  const [desafios, setDesafios] = useState<IDesafio[]>([] as IDesafio[])
  const [tipo, setTipo] = useState<'video' | 'imagem' | 'nenhum'>('nenhum')
  const [drawer, setDrawer] = useState<'none' | 'insert' | 'update'>('none')
  const [desafio, setDesafio] = useState(0)
  const [load, setLoad] = useState(false)
  const [waiting, setWaiting] = useState(false)

  useEffect(() => {
    async function getEquipes() {
      try {
        setLoading(true)
        await api.get(`/desafio`).then(({ data }) => {
          setDesafios(data)
        })
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    getEquipes()
  }, [load])

  const onSubmit = async (data: IDesafio) => {
    try {
      setWaiting(true)
      if (drawer === 'insert') {
        await api.post('/desafio', data).then(() => {
          message.success('Cadastrado com sucesso!')
          onClose()
          setLoad(!load)
        })
      }
      if (drawer === 'update') {
        await api.put(`/desafio/${desafio}`, data).then(() => {
          message.success('Atualizado com sucesso!')
          onClose()
          setLoad(!load)
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
    setTipo('nenhum')
  }

  return (
    <Container>
      <Row>
        <Col span={24}>
          <Card>
            <Row justify="space-between" align="middle">
              <Typography.Title level={3}>Desafios</Typography.Title>
              <Button
                type="primary"
                size="large"
                shape="round"
                icon={<PlusOutlined />}
                onClick={() => setDrawer('insert')}
              >
                Adicionar desafio
              </Button>
            </Row>
          </Card>
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={24}>
          <Card bodyStyle={{ padding: 0 }}>
            <Table<IDesafio>
              dataSource={desafios}
              loading={loading}
              rowKey={equipe => equipe.id}
            >
              <Column<IDesafio>
                title="Título"
                dataIndex="titulo"
                key="titulo"
              />
              <Column<IDesafio>
                title="Pontos"
                dataIndex="pontos"
                key="pontos"
                render={ponto => <Tag color="green">{ponto}</Tag>}
              />
              <Column<IDesafio>
                title="Liberação"
                dataIndex="liberacao"
                key="liberacao"
                render={liberacao => format(parseISO(liberacao), 'dd/MM/yyyy')}
              />
              <Column<IDesafio>
                title="Encerramento"
                dataIndex="encerramento"
                key="encerramento"
                render={encerramento =>
                  format(parseISO(encerramento), 'dd/MM/yyyy')
                }
              />
              <Column<IDesafio>
                key="actions"
                render={(_, record) => (
                  <Space>
                    <Tooltip title="Ver respostas">
                      <Button
                        type="text"
                        icon={<SearchOutlined />}
                        onClick={() => history.push(`/resposta/${record.id}`)}
                      />
                    </Tooltip>
                    <Tooltip title="Editar">
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => {
                          setDesafio(record.id)
                          reset({
                            ...record,
                            liberacao: parseISO(record.liberacao),
                            encerramento: parseISO(record.encerramento)
                          })
                          if (record.video) {
                            setTipo('video')
                          } else {
                            if (record.cover) {
                              setTipo('imagem')
                            }
                          }
                          setDrawer('update')
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="Apagar">
                      <Popconfirm
                        title="Apagar desafio?"
                        cancelText="Cancelar"
                        onConfirm={async () => {
                          try {
                            setWaiting(true)
                            await api
                              .delete(`/desafio/${record.id}`)
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
      <Drawer
        visible={drawer !== 'none'}
        onClose={onClose}
        destroyOnClose
        width={400}
      >
        <Spin spinning={waiting}>
          <Row>
            <Col span={24}>
              <Title level={4}>Título</Title>
              <Controller
                name="titulo"
                rules={{ required: 'O título precisa ser informado' }}
                control={control}
                render={({
                  field: { value, onBlur, onChange },
                  fieldState: { error }
                }) => (
                  <>
                    <Input.TextArea
                      autoSize={{ maxRows: 4 }}
                      size="large"
                      placeholder="Título"
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
              <Title level={4}>Tipo de conteúdo</Title>
              <Select
                style={{ width: '100%' }}
                size="large"
                value={tipo}
                onChange={value => setTipo(value)}
              >
                <Select.Option value="nenhum">Somente texto</Select.Option>
                <Select.Option value="video">Vídeo</Select.Option>
                <Select.Option value="imagem">Imagem</Select.Option>
              </Select>
            </Col>
            <Col span={24}>
              <Title level={4}>Descrição</Title>
              <Controller
                name="conteudo"
                rules={{ required: 'A descrição precisa ser informada' }}
                control={control}
                render={({
                  field: { value, onBlur, onChange },
                  fieldState: { error }
                }) => (
                  <>
                    <Input.TextArea
                      autoSize={{ maxRows: 4 }}
                      size="large"
                      placeholder="Descrição"
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
            {tipo === 'video' && (
              <Col span={24}>
                <Title level={4}>Vídeo</Title>
                <Controller
                  name="video"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <Upload
                      onChange={({ file, fileList }) => {
                        if (file.status !== 'uploading') {
                          console.log(file, fileList)
                        }
                        if (file.status === 'done') {
                          onChange(file.response.url)
                        } else if (file.status === 'error') {
                          message.error(
                            `${file.name} falha ao carregar arquivo.`
                          )
                        }
                      }}
                      listType="picture"
                      multiple={false}
                      accept="video/*"
                      action={`${process.env.REACT_APP_API}/upload`}
                      data={{ pasta: 'devocional' }}
                    >
                      <Button icon={<UploadOutlined />}>Enviar vídeo</Button>
                    </Upload>
                  )}
                />
              </Col>
            )}
            {tipo === 'imagem' && (
              <Col span={24}>
                <Title level={4}>Imagem</Title>
                <Controller
                  name="cover"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Upload
                      onChange={({ file, fileList }) => {
                        if (file.status !== 'uploading') {
                          console.log(file, fileList)
                        }
                        if (file.status === 'done') {
                          onChange(file.response.url)
                        } else if (file.status === 'error') {
                          message.error(
                            `${file.name} falha ao carregar arquivo.`
                          )
                        }
                      }}
                      showUploadList={false}
                      listType="picture-card"
                      multiple={false}
                      accept="image/png, image/jpeg"
                      action={`${process.env.REACT_APP_API}/upload`}
                      data={{ pasta: 'desafios' }}
                    >
                      {value ? (
                        <img
                          src={value}
                          alt="avatar"
                          style={{ width: '100%' }}
                        />
                      ) : (
                        UploadButton
                      )}
                    </Upload>
                  )}
                />
              </Col>
            )}
            <Col span={24}>
              <Title level={4}>Data de liberação</Title>
              <Controller
                name="liberacao"
                control={control}
                render={({
                  field: { value, onChange },
                  fieldState: { error }
                }) => (
                  <>
                    <DatePicker
                      style={{ width: '100%' }}
                      value={value}
                      onChange={onChange}
                      disabledDate={disabledDate}
                    />
                    {error && <Text type="danger">{error.message}</Text>}
                  </>
                )}
              />
            </Col>
            <Col span={24}>
              <Title level={4}>Data de encerramento</Title>
              <Controller
                name="encerramento"
                control={control}
                render={({
                  field: { value, onChange },
                  fieldState: { error }
                }) => (
                  <>
                    <DatePicker
                      style={{ width: '100%' }}
                      value={value}
                      onChange={onChange}
                      disabledDate={disabledDate}
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
