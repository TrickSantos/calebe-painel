import React, { ReactElement, useEffect, useState } from 'react'
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UploadOutlined
} from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Divider,
  Drawer,
  Input,
  message,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tooltip,
  Typography,
  Upload
} from 'antd'
import { AxiosError } from 'axios'
import { format, parseISO } from 'date-fns'
import { Controller, useForm } from 'react-hook-form'
import { Container } from '../Components'
import DatePicker from '../Components/DatePicker'
import api from '../Service/api'
import { IDevocional, IError } from '../Types'
import { disabledDate } from '../Service/utils'

const { Title, Text } = Typography
const { Column } = Table

const UploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Foto</div>
  </div>
)

export default function Devocionais(): ReactElement {
  const { control, handleSubmit, reset } = useForm()
  const [loading, setLoading] = useState(false)
  const [tipo, setTipo] = useState<'video' | 'imagem' | 'nenhum'>('nenhum')
  const [devocionais, setdevocionais] = useState<IDevocional[]>(
    [] as IDevocional[]
  )
  const [devocional, setDevocional] = useState(0)
  const [drawer, setDrawer] = useState<'none' | 'insert' | 'update'>('none')
  const [load, setLoad] = useState(false)
  const [waiting, setWaiting] = useState(false)

  useEffect(() => {
    async function getEquipes() {
      try {
        setLoading(true)
        await api.get(`/devocional`).then(({ data }) => {
          setdevocionais(data)
        })
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    getEquipes()
  }, [load])

  const onSubmit = async (data: IDevocional) => {
    try {
      setWaiting(true)
      if (drawer === 'insert') {
        await api.post('/devocional', data).then(() => {
          message.success('Cadastrado com sucesso!')
          onClose()
          setLoad(!load)
        })
      }
      if (drawer === 'update') {
        await api.put(`/devocional/${devocional}`, data).then(() => {
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
              <Title level={3}>Devocionais</Title>
              <Button
                type="primary"
                size="large"
                shape="round"
                icon={<PlusOutlined />}
                onClick={() => setDrawer('insert')}
              >
                Adicionar devocional
              </Button>
            </Row>
          </Card>
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={24}>
          <Card bodyStyle={{ padding: 0 }}>
            <Table<IDevocional>
              dataSource={devocionais}
              loading={loading}
              rowKey={equipe => equipe.id}
            >
              <Column<IDevocional>
                title="T??tulo"
                dataIndex="titulo"
                key="titulo"
              />
              <Column<IDevocional>
                title="Verso"
                dataIndex="verso"
                key="verso"
              />
              <Column<IDevocional>
                title="Libera????o"
                dataIndex="liberacao"
                key="liberacao"
                render={liberacao => format(parseISO(liberacao), 'dd/MM/yyyy')}
              />
              <Column<IDevocional>
                key="actions"
                render={(_, record) => (
                  <Space>
                    <Tooltip title="Editar">
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => {
                          setDevocional(record.id)
                          reset({
                            ...record,
                            liberacao: parseISO(record.liberacao)
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
                        title="Apagar devocional?"
                        cancelText="Cancelar"
                        onConfirm={async () => {
                          try {
                            setWaiting(true)
                            await api
                              .delete(`/devocional/${record.id}`)
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
              <Title level={4}>T??tulo</Title>
              <Controller
                name="titulo"
                rules={{ required: 'O t??tulo precisa ser informado' }}
                control={control}
                render={({
                  field: { value, onBlur, onChange },
                  fieldState: { error }
                }) => (
                  <>
                    <Input.TextArea
                      autoSize={{ maxRows: 4 }}
                      size="large"
                      placeholder="T??tulo"
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
              <Title level={4}>Tipo de conte??do</Title>
              <Select
                style={{ width: '100%' }}
                size="large"
                value={tipo}
                onChange={value => setTipo(value)}
              >
                <Select.Option value="nenhum">Somente texto</Select.Option>
                <Select.Option value="video">V??deo</Select.Option>
                <Select.Option value="imagem">Imagem</Select.Option>
              </Select>
            </Col>
            {tipo !== 'video' && (
              <Col span={24}>
                <Title level={4}>Verso</Title>
                <Controller
                  name="verso"
                  control={control}
                  render={({ field: { value, onBlur, onChange } }) => (
                    <Input.TextArea
                      autoSize={{ maxRows: 4 }}
                      size="large"
                      placeholder="T??tulo"
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                    />
                  )}
                />
              </Col>
            )}
            {tipo !== 'video' && (
              <Col span={24}>
                <Title level={4}>Descri????o</Title>
                <Controller
                  name="conteudo"
                  control={control}
                  render={({ field: { value, onBlur, onChange } }) => (
                    <Input.TextArea
                      autoSize={{ maxRows: 8 }}
                      size="large"
                      placeholder="Descri????o"
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                    />
                  )}
                />
              </Col>
            )}
            {tipo === 'video' && (
              <Col span={24}>
                <Title level={4}>V??deo</Title>
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
                      <Button icon={<UploadOutlined />}>Enviar v??deo</Button>
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
                      data={{ pasta: 'devocional' }}
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
              <Title level={4}>Data de libera????o</Title>
              <Controller
                name="liberacao"
                control={control}
                rules={{
                  required: 'A data de libera????o precisa ser informada'
                }}
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
