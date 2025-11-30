import { useState, useEffect } from 'react'
import {
  Card,
  Typography,
  Row,
  Col,
  Statistic,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Space,
} from 'antd'
import {
  UserOutlined,
  FileOutlined,
  ApartmentOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { i18n } from '../utils/i18n'
import { authService } from '../utils/auth'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { addNode, updateNode, deleteNode } from '../store/slices/flowSlice'
import { fetchIngredients } from '../store/slices/ingredientSlice'
import type { Node } from '../store/slices/flowSlice'

const { Title, Paragraph } = Typography

const Home = () => {
  const language = i18n.getLanguage()
  const t = i18n.getTranslations(language)
  const user = authService.getCurrentUser()
  const dispatch = useAppDispatch()
  const { nodes } = useAppSelector((state) => state.flow)
  const { items: ingredients } = useAppSelector((state) => state.ingredient)

  const [addModalVisible, setAddModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [selectedIngredient, setSelectedIngredient] = useState<number | undefined>(undefined)
  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()
  const [deleteForm] = Form.useForm()

  // 初始化加载 ingredient 数据
  useEffect(() => {
    dispatch(fetchIngredients({ current: 1, pageSize: 1000 })) // 加载所有数据用于下拉框
  }, [dispatch])

  // 添加节点
  const handleAddNode = async () => {
    try {
      const values = await addForm.validateFields()
      const newNode: Node = {
        id: `node-${Date.now()}`,
        data: { label: values.name },
        position: {
          x: values.x,
          y: values.y,
        },
      }
      dispatch(addNode(newNode))
      message.success(t.addNodeSuccess)
      setAddModalVisible(false)
      addForm.resetFields()
    } catch (error: any) {
      if (error.errorFields) {
        return
      }
      message.error(t.operationFailed)
    }
  }

  // 编辑节点
  const handleEditNode = async () => {
    try {
      const values = await editForm.validateFields()
      const nodeId = values.nodeId
      const node = nodes.find((n) => n.id === nodeId)
      if (!node) {
        message.error(t.selectNode)
        return
      }

      dispatch(
        updateNode({
          id: nodeId,
          data: { label: values.name },
          position: {
            x: values.x,
            y: values.y,
          },
        })
      )
      message.success(t.editNodeSuccess)
      setEditModalVisible(false)
      editForm.resetFields()
    } catch (error: any) {
      if (error.errorFields) {
        return
      }
      message.error(t.operationFailed)
    }
  }

  // 删除节点
  const handleDeleteNode = async () => {
    try {
      const values = await deleteForm.validateFields()
      const nodeId = values.nodeId
      dispatch(deleteNode(nodeId))
      message.success(t.deleteNodeSuccess)
      setDeleteModalVisible(false)
      deleteForm.resetFields()
    } catch (error: any) {
      if (error.errorFields) {
        return
      }
      message.error(t.operationFailed)
    }
  }

  // 打开编辑弹窗时，自动填充选中节点的数据
  const handleOpenEditModal = () => {
    setEditModalVisible(true)
    editForm.resetFields()
  }

  // 当选择节点时，自动填充数据
  const handleNodeSelectChange = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId)
    if (node) {
      editForm.setFieldsValue({
        name: node.data.label,
        x: node.position.x,
        y: node.position.y,
      })
    }
  }

  return (
    <div>
      <Title level={2}>
        {t.welcome}, {user?.username}!
      </Title>
      <Paragraph>这是首页内容区域</Paragraph>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic title="用户数" value={1128} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="文档数" value={93} prefix={<FileOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="流程数" value={nodes.length} prefix={<ApartmentOutlined />} />
          </Card>
        </Col>
      </Row>

      <Card title="流程节点管理" style={{ marginTop: 24 }}>
        <Space size="middle">
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddModalVisible(true)}>
            {t.addNode}
          </Button>
          <Button icon={<EditOutlined />} onClick={handleOpenEditModal}>
            {t.editNode}
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={() => setDeleteModalVisible(true)}>
            {t.deleteNode}
          </Button>
        </Space>
        <Paragraph style={{ marginTop: 16, color: '#666' }}>
          当前共有 {nodes.length} 个节点，这些操作会同步到流程展示页面
        </Paragraph>
      </Card>

      <Card title="Ingredient 选择" style={{ marginTop: 24 }}>
        <Space orientation="vertical" style={{ width: '100%' }}>
          <div>
            <label style={{ marginRight: 8 }}>选择 Ingredient:</label>
            <Select
              placeholder="请选择 Ingredient"
              style={{ width: 300 }}
              value={selectedIngredient}
              onChange={setSelectedIngredient}
              allowClear
              options={ingredients.map((ingredient) => ({
                value: ingredient.id,
                label: `${ingredient.name} (${ingredient.unit})`,
              }))}
            />
          </div>
          {selectedIngredient && (
            <div style={{ marginTop: 8 }}>
              <Paragraph>
                已选择: {ingredients.find((i) => i.id === selectedIngredient)?.name} (
                {ingredients.find((i) => i.id === selectedIngredient)?.unit})
              </Paragraph>
            </div>
          )}
        </Space>
      </Card>

      {/* 添加节点弹窗 */}
      <Modal
        title={t.addNode}
        open={addModalVisible}
        onOk={handleAddNode}
        onCancel={() => {
          setAddModalVisible(false)
          addForm.resetFields()
        }}
        okText={t.confirm}
        cancelText={t.cancel}
      >
        <Form form={addForm} layout="vertical">
          <Form.Item
            name="name"
            label={t.nodeName}
            rules={[{ required: true, message: t.nodeNameRequired }]}
          >
            <Input placeholder={t.pleaseInput + t.nodeName} />
          </Form.Item>
          <Form.Item
            name="x"
            label={t.positionX}
            rules={[{ required: true, message: t.positionXRequired }]}
          >
            <InputNumber
              placeholder={t.pleaseInput + t.positionX}
              style={{ width: '100%' }}
              min={0}
            />
          </Form.Item>
          <Form.Item
            name="y"
            label={t.positionY}
            rules={[{ required: true, message: t.positionYRequired }]}
          >
            <InputNumber
              placeholder={t.pleaseInput + t.positionY}
              style={{ width: '100%' }}
              min={0}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑节点弹窗 */}
      <Modal
        title={t.editNode}
        open={editModalVisible}
        onOk={handleEditNode}
        onCancel={() => {
          setEditModalVisible(false)
          editForm.resetFields()
        }}
        okText={t.confirm}
        cancelText={t.cancel}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="nodeId"
            label="选择节点"
            rules={[{ required: true, message: t.selectNode }]}
          >
            <Select
              placeholder="请选择要编辑的节点"
              onChange={handleNodeSelectChange}
              options={nodes.map((node) => ({
                value: node.id,
                label: `${node.data.label} (ID: ${node.id})`,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="name"
            label={t.nodeName}
            rules={[{ required: true, message: t.nodeNameRequired }]}
          >
            <Input placeholder={t.pleaseInput + t.nodeName} />
          </Form.Item>
          <Form.Item
            name="x"
            label={t.positionX}
            rules={[{ required: true, message: t.positionXRequired }]}
          >
            <InputNumber
              placeholder={t.pleaseInput + t.positionX}
              style={{ width: '100%' }}
              min={0}
            />
          </Form.Item>
          <Form.Item
            name="y"
            label={t.positionY}
            rules={[{ required: true, message: t.positionYRequired }]}
          >
            <InputNumber
              placeholder={t.pleaseInput + t.positionY}
              style={{ width: '100%' }}
              min={0}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 删除节点弹窗 */}
      <Modal
        title={t.deleteNode}
        open={deleteModalVisible}
        onOk={handleDeleteNode}
        onCancel={() => {
          setDeleteModalVisible(false)
          deleteForm.resetFields()
        }}
        okText={t.confirm}
        cancelText={t.cancel}
        okButtonProps={{ danger: true }}
      >
        <Form form={deleteForm} layout="vertical">
          <Form.Item
            name="nodeId"
            label="选择节点"
            rules={[{ required: true, message: t.selectNode }]}
          >
            <Select
              placeholder="请选择要删除的节点"
              options={nodes.map((node) => ({
                value: node.id,
                label: `${node.data.label} (ID: ${node.id})`,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Home

