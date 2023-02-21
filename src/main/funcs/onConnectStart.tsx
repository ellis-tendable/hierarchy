import { useCallback } from "react";
import { OnConnectStart } from "reactflow";



const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
}, []);

export { onConnectStart }
 

