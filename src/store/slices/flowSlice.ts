import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Node {
  id: string
  type?: string
  data: Record<string, unknown>
  position: { x: number; y: number }
}

export interface Edge {
  id: string
  source: string
  target: string
}

interface FlowState {
  nodes: Node[]
  edges: Edge[]
}

const initialState: FlowState = {
  nodes: [
    { id: '1', type: 'input', data: { label: '开始' }, position: { x: 250, y: 0 } },
    { id: '2', data: { label: '处理中' }, position: { x: 250, y: 100 } },
    { id: '3', type: 'output', data: { label: '结束' }, position: { x: 250, y: 200 } },
  ],
  edges: [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3' },
  ],
}

const flowSlice = createSlice({
  name: 'flow',
  initialState,
  reducers: {
    setNodes: (state, action: PayloadAction<Node[]>) => {
      state.nodes = action.payload
    },
    setEdges: (state, action: PayloadAction<Edge[]>) => {
      state.edges = action.payload
    },
    addNode: (state, action: PayloadAction<Node>) => {
      state.nodes.push(action.payload)
    },
    addEdge: (state, action: PayloadAction<Edge>) => {
      state.edges.push(action.payload)
    },
    updateNode: (state, action: PayloadAction<Partial<Node> & { id: string }>) => {
      const { id, ...updates } = action.payload
      const node = state.nodes.find((n) => n.id === id)
      if (node) {
        Object.assign(node, updates)
      }
    },
    deleteNode: (state, action: PayloadAction<string>) => {
      state.nodes = state.nodes.filter((n) => n.id !== action.payload)
      state.edges = state.edges.filter(
        (e) => e.source !== action.payload && e.target !== action.payload
      )
    },
  },
})

export const { setNodes, setEdges, addNode, addEdge, updateNode, deleteNode } = flowSlice.actions
export default flowSlice.reducer

