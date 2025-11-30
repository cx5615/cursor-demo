import { useCallback, useEffect } from 'react'
import { Card, Typography, Button, Space } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setNodes, setEdges, addNode, addEdge as addEdgeAction } from '../store/slices/flowSlice'
import { i18n } from '../utils/i18n'
import './Flow.scss'

const { Title } = Typography

const Flow = () => {
  const language = i18n.getLanguage()
  const t = i18n.getTranslations(language)
  const dispatch = useAppDispatch()
  const { nodes: reduxNodes, edges: reduxEdges } = useAppSelector((state) => state.flow)

  const [nodes, setNodesState, onNodesChange] = useNodesState(reduxNodes)
  const [edges, setEdgesState, onEdgesChange] = useEdgesState(reduxEdges)

  // 当 Redux 数据变化时，同步到本地状态
  useEffect(() => {
    setNodesState(reduxNodes)
    setEdgesState(reduxEdges)
  }, [reduxNodes, reduxEdges, setNodesState, setEdgesState])

  // 同步到 Redux
  const syncToRedux = useCallback(() => {
    dispatch(setNodes(nodes))
    dispatch(setEdges(edges))
  }, [dispatch, nodes, edges])

  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return
      const newEdge: Edge = {
        id: `e${params.source}-${params.target}`,
        source: params.source,
        target: params.target,
      }
      const newEdges = addEdge(newEdge, edges)
      setEdgesState(newEdges)
      dispatch(addEdgeAction(newEdge))
    },
    [edges, setEdgesState, dispatch]
  )

  const handleAddNode = () => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      data: { label: `节点 ${nodes.length + 1}` },
      position: {
        x: Math.random() * 400,
        y: Math.random() * 400,
      },
    }
    const newNodes = [...nodes, newNode]
    setNodesState(newNodes)
    dispatch(addNode(newNode))
  }

  const handleClear = () => {
    setNodesState([])
    setEdgesState([])
    dispatch(setNodes([]))
    dispatch(setEdges([]))
  }

  return (
    <div className="flow-page">
      <div className="flow-header">
        <Title level={2}>{t.flowTitle}</Title>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNode}>
            添加节点
          </Button>
          <Button icon={<DeleteOutlined />} onClick={handleClear}>
            清空
          </Button>
          <Button onClick={syncToRedux}>同步到 Redux</Button>
        </Space>
      </div>
      <Card>
        <div className="flow-container">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
      </Card>
    </div>
  )
}

export default Flow

