import React, { ReactElement, useEffect, useState } from 'react'
import {
  Button,
  Card,
  Col,
  Divider,
  Row,
  Space,
  Table,
  Tooltip,
  Typography
} from 'antd'
import { SearchOutlined, EditOutlined } from '@ant-design/icons'
import { IEquipe } from '../Types'
import api from '../Service/api'
import { useHistory } from 'react-router-dom'
import { Container } from '../Components'

const { Column } = Table

export default function Equipes(): ReactElement {
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const [equipes, setEquipes] = useState<IEquipe[]>([] as IEquipe[])

  useEffect(() => {
    async function getEquipes() {
      try {
        setLoading(true)
        await api.get(`/equipe`).then(({ data }) => {
          setEquipes(data)
        })
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    getEquipes()
  }, [])

  return (
    <Container>
      <Row>
        <Col span={24}>
          <Card>
            <Typography.Title level={3}>Equipes</Typography.Title>
          </Card>
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={24}>
          <Card>
            <Table<IEquipe>
              dataSource={equipes}
              loading={loading}
              rowKey={equipe => equipe.id}
            >
              <Column<IEquipe> title="Equipe" dataIndex="nome" key="nome" />
              <Column<IEquipe>
                title="Igreja"
                dataIndex="igreja"
                key="igreja"
                render={(_, { igreja }) => igreja.nome}
              />
              <Column<IEquipe>
                title="Membros"
                dataIndex="membros"
                key="membros"
                render={(_, { membros }) => membros.length}
              />
              <Column<IEquipe>
                key="actions"
                render={(_, { id }) => (
                  <Space>
                    <Tooltip title="Visualizar">
                      <Button
                        type="text"
                        icon={<SearchOutlined />}
                        onClick={() => history.push(`/equipes/${id}`)}
                      />
                    </Tooltip>
                    <Tooltip title="Editar">
                      <Button type="text" icon={<EditOutlined />} />
                    </Tooltip>
                  </Space>
                )}
              />
            </Table>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
