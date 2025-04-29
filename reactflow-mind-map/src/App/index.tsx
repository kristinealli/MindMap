import { ReactFlow, Controls, Panel, ConnectionLineType, type NodeOrigin } from '@xyflow/react';
import { useShallow } from 'zustand/shallow';

import useStore, { type RFState } from './store';
import MindMapNode from './MindMapNode';
import MindMapEdge from './MindMapEdge';

import '../index.css';
import '@xyflow/react/dist/style.css';


const selector = (state: RFState) => ({
    nodes: state.nodes,
    edges:state.edges,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
});

const nodeTypes = {
    mindmap: MindMapNode,
};

const edgeTypes = {
    mindmap: MindMapEdge,
};

const nodeOrigin: NodeOrigin = [.05, .05];
const connectionLineStyle = { stroke: '#F6AD55', strokeWidth: 3 };
const defaultEdgeOptions = { style: connectionLineStyle, type: 'mindmap' };

function Flow(){
    const { nodes, edges, onNodesChange, onEdgesChange } = useStore(useShallow(selector));
    
    return (
        <ReactFlow
            nodes ={nodes}
            edges = {edges}
            onNodesChange = {onNodesChange}
            onEdgesChange = {onEdgesChange}
            nodeTypes = {nodeTypes}
            edgeTypes = {edgeTypes}
            nodeOrigin={nodeOrigin}
            defaultEdgeOptions={defaultEdgeOptions}
            connectionLineStyle={connectionLineStyle}
            connectionLineType={ConnectionLineType.SmoothStep}
            fitView
        >
            <Controls showInteractive={false} />
            <Panel position="top-left">React Flow Mind Map</Panel>
        </ReactFlow>
    );
}

export default Flow;
