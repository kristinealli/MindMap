import { useCallback, useRef } from 'react';
import {
	ReactFlow,
	Controls,
	Panel,
	useStoreApi,
	useReactFlow,
	ReactFlowProvider,
	ConnectionLineType,
	type NodeOrigin,
	type OnConnectEnd,
	type OnConnectStart,
	type Node,
} from '@xyflow/react';
import { useShallow } from 'zustand/shallow';

import useStore, { type RFState } from './store';
import MindMapNode from './MindMapNode';
import MindMapEdge from './MindMapEdge';

import '../index.css';

// we need to import the React Flow styles to make it work
import '@xyflow/react/dist/style.css';

const selector = (state: RFState) => ({
	nodes: state.nodes,
	edges: state.edges,
	onNodesChange: state.onNodesChange,
	onEdgesChange: state.onEdgesChange,
	addChildNode: state.addChildNode,
});

const nodeTypes = {
	mindmap: MindMapNode,
};

const edgeTypes = {
	mindmap: MindMapEdge,
};

const nodeOrigin: NodeOrigin = [0.5, 0.5];
const connectionLineStyle = { stroke: '#F6AD55', strokeWidth: 3 };
const defaultEdgeOptions = { style: connectionLineStyle, type: 'mindmap' };

function Flow() {
	// whenever you use multiple values, you should use shallow for making sure that the component only re-renders when one of the values change
	const { nodes, edges, onNodesChange, onEdgesChange, addChildNode } = useStore(
		useShallow(selector),
	);
	const connectingNodeId = useRef<string | null>(null);
	const store = useStoreApi();
	const { screenToFlowPosition } = useReactFlow();

	const getChildNodePosition = (
	event: MouseEvent | TouchEvent,
	parentNode?: Node,
) => {
	if (!parentNode) return;

	const isTouchEvent = 'touches' in event;
	const x = isTouchEvent ? event.touches[0].clientX : event.clientX;
	const y = isTouchEvent ? event.touches[0].clientY : event.clientY;

	const panePosition = screenToFlowPosition({ x, y });

	// You can adjust offsets based on expected dimensions (e.g., 100x40)
	const defaultWidth = 100;
	const defaultHeight = 40;

	return {
		x: panePosition.x - parentNode.position.x + defaultWidth / 2,
		y: panePosition.y - parentNode.position.y + defaultHeight / 2,
	};
};

	const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
		connectingNodeId.current = nodeId;
	}, []);

	const onConnectEnd: OnConnectEnd = useCallback(
		(event) => {
			const { nodeLookup } = store.getState();
			const targetIsPane = (event.target as Element).classList.contains(
				'react-flow__pane',
			);
			const node = (event.target as Element).closest('.react-flow__node');

			if (node) {
				node.querySelector('input')?.focus({ preventScroll: true });
			} else if (targetIsPane && connectingNodeId.current) {
				const parentNode = nodeLookup.get(connectingNodeId.current);
				const childNodePosition = getChildNodePosition(event, parentNode);

				if (parentNode && childNodePosition) {
					addChildNode(parentNode, childNodePosition);
				}
			}
		},
		[getChildNodePosition],
	);

	return (
		<ReactFlow
			nodes={nodes}
			edges={edges}
			onNodesChange={onNodesChange}
			onEdgesChange={onEdgesChange}
			nodeTypes={nodeTypes}
			edgeTypes={edgeTypes}
			onConnectStart={onConnectStart}
			onConnectEnd={onConnectEnd}
			nodeOrigin={nodeOrigin}
			connectionLineStyle={connectionLineStyle}
			defaultEdgeOptions={defaultEdgeOptions}
			connectionLineType={ConnectionLineType.Straight}
			fitView
		>
			<Controls showInteractive={false} />
			<Panel position="top-left" className="header">
				React Flow Mind Map
			</Panel>
		</ReactFlow>
	);
}

export default () => (
	<ReactFlowProvider>
		<Flow />
	</ReactFlowProvider>
);
