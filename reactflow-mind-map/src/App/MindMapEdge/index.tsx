import { BaseEdge, getStraightPath, type EdgeProps } from '@xyflow/react';

function MindMapEdge(props: EdgeProps) {
    const { sourceX, sourceY, targetX, targetY } = props;

    const [edgePath] = getStraightPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });

    return <BaseEdge path={edgePath} {...props} />;
}

export default MindMapEdge;
