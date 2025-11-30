import { useState, useEffect } from 'react'
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Form,
  message,
  Popconfirm,
  Card,
  Typography,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  fetchIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient,
} from '../store/slices/ingredientSlice'
import type { Ingredient, IngredientFormData } from '../types/ingredient'
import './Ingredient.scss'

const { Title } = Typography

const Ingredient = () => {
  const dispatch = useAppDispatch()
  const { items: data, total, loading } = useAppSelector(
    (state) => state.ingredient
  )

  const [search, setSearch] = useState('')
  const [localCurrent, setLocalCurrent] = useState(1)
  const [localPageSize, setLocalPageSize] = useState(10)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form] = Form.useForm()

  // const language = i18n.getLanguage()
  // const t = i18n.getTranslations(language)

  // 加载数据
  useEffect(() => {
    dispatch(
      fetchIngredients({
        current: localCurrent,
        pageSize: localPageSize,
        search: search || undefined,
      })
    )
  }, [dispatch, localCurrent, localPageSize, search])

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearch(value)
    setLocalCurrent(1) // 重置到第一页
  }

  // 打开新增/编辑弹窗
  const handleOpenModal = (ingredient?: Ingredient) => {
    if (ingredient) {
      // 编辑模式
      setEditingId(ingredient.id)
      form.setFieldsValue({
        name: ingredient.name,
        unit: ingredient.unit,
      })
    } else {
      // 新增模式
      setEditingId(null)
      form.resetFields()
    }
    setModalVisible(true)
  }

  // 关闭弹窗
  const handleCloseModal = () => {
    setModalVisible(false)
    setEditingId(null)
    form.resetFields()
  }

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const formData: IngredientFormData = {
        name: values.name,
        unit: values.unit,
      }

      if (editingId) {
        // 编辑
        const result = await dispatch(
          updateIngredient({ id: editingId, data: formData })
        ).unwrap()
        if (result.success) {
          message.success(result.message || '编辑成功')
          handleCloseModal()
          // 重新加载列表
          dispatch(
            fetchIngredients({
              current: localCurrent,
              pageSize: localPageSize,
              search: search || undefined,
            })
          )
        }
      } else {
        // 新增
        const result = await dispatch(createIngredient(formData)).unwrap()
        if (result.success) {
          message.success(result.message || '新增成功')
          handleCloseModal()
          // 重新加载列表
          dispatch(
            fetchIngredients({
              current: localCurrent,
              pageSize: localPageSize,
              search: search || undefined,
            })
          )
        }
      }
    } catch (error: any) {
      if (error.errorFields) {
        // 表单验证错误
        return
      }
      message.error(error.message || '操作失败')
    }
  }

  // 删除
  const handleDelete = async (id: number) => {
    try {
      const result = await dispatch(deleteIngredient(id)).unwrap()
      if (result.response.success) {
        message.success(result.response.message || '删除成功')
        // 重新加载列表
        dispatch(
          fetchIngredients({
            current: localCurrent,
            pageSize: localPageSize,
            search: search || undefined,
          })
        )
      }
    } catch (error: any) {
      message.error(error.message || '删除失败')
    }
  }

  const columns: ColumnsType<Ingredient> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Ingredient) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="ingredient-page">
      <Title level={2}>Ingredient 管理</Title>
      <Card>
        <div className="ingredient-header">
          <Input.Search
            placeholder="搜索名称"
            allowClear
            onSearch={handleSearch}
            style={{ width: 300 }}
            prefix={<SearchOutlined />}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
            New
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={{
            current: localCurrent,
            pageSize: localPageSize,
            total,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page, size) => {
              setLocalCurrent(page)
              setLocalPageSize(size)
            },
          }}
        />
      </Card>

      <Modal
        title={editingId ? '编辑 Ingredient' : '新增 Ingredient'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={handleCloseModal}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="名称"
            rules={[
              { required: true, message: '请输入名称' },
              { max: 255, message: '名称长度不能超过255个字符' },
            ]}
          >
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item
            name="unit"
            label="单位"
            rules={[
              { required: true, message: '请输入单位' },
              { max: 255, message: '单位长度不能超过255个字符' },
            ]}
          >
            <Input placeholder="请输入单位" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Ingredient

