import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
  addEdge, MiniMap, Controls, Background,
  useNodesState, useEdgesState, Node, Edge, EdgeChange, NodeChange,
  NodeTypes, NodeProps,
  OnSelectionChangeFunc, OnConnectEnd, OnConnectStart,
  useReactFlow, useViewport,
  ReactFlowProvider,
} from 'reactflow';

//base types for hierachies
import type { HierarchyElementStyles, HierarchyElement } from 'src/types/HierarchyElement';


//available tendable node types 
//(eg. different nodes available to use on the graph)
//such as, "organisation", "organisation_element", "hierarchy_element"
import { TendableNodes } from './TendableNodes'


import { convert_table_data_to_nodes_edges } from 'src/funcs/convertTableDataToNodesEdges';
import { getNodeDescendants } from 'src/funcs/getNodeDescendants';



//styles
//React-Flow basic styles
import 'reactflow/dist/style.css'
//import './overview.css'


import { onSelectionChange } from './funcs/onSelectionChange';
import { TableData } from 'src/types/TableData';


const minimapStyle = { height: 120 }










type HierachyElementNoIds = Pick<HierarchyElement, "level_number" | "archived_at" | "name" | "parent_hierarchy_level_id" | "styles">
type HierachyElementForCreateNewNode = { parent_id: number }

interface TendableReactFlowInstanceProps {
  tableData: React.RefObject<TableData>
  createNewNode: (hierarchy_element: HierachyElementForCreateNewNode) => void
}
const TendableReactFlowInstance = ({ tableData, createNewNode }: TendableReactFlowInstanceProps) => {

  //tendable state for hierarchy graph
  const [showHidden, setShowHidden] = useState<boolean>(false)
  const [selectNodesOnDrag, setSelectNodesOnDrag] = useState<boolean>(false)
  const connectingNodeId = useRef<string | null>(null)
  const [init, setInit] = useState<boolean>(false)


  //react-flow nodes & edges data structure
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  //react-flow handles
  const { project, getViewport, zoomOut, setViewport, fitView } = useReactFlow();



  //handles
  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), []);

  const onInit = (reactFlowInstance: any) => {
    setInit(true);
    console.log('flow loaded:', reactFlowInstance);
  }

  useEffect(() => {
    //show deleted nodes



  }, [showHidden])

  useEffect(() => {
    if (tableData.current === null) return
    const descendants = getNodeDescendants(1, tableData.current.hierarchy_levels)
    console.log("descendants", descendants)
    console.log(tableData.current.hierarchy_levels)
  }, [])

  //refresh the nodes & edges based on new data
  useEffect(() => {
    if (tableData.current == null) return
    const result = convert_table_data_to_nodes_edges(tableData.current.hierarchy_levels, tableData.current.hierarchy)
    setNodes(result.nodes)
    setEdges(result.edges)

    //fit view with timeout, as creates visual artifacts otherwise
    setTimeout(() => {
      fitView()
    }, 100)
  }, [])



  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);


  function isMouseEvent(e: MouseEvent | TouchEvent): e is MouseEvent {
    return e.type === 'mouseup'
  }

  const onConnectEnd: OnConnectEnd = (event) => {
    if (!isMouseEvent(event)) return;
    if (typeof connectingNodeId.current !== "string") return;

    const targetIsPane = (event.target !== null) && (event.target instanceof Element) && (event.target.classList.contains("react-flow__pane"))




    const new_element: HierachyElementForCreateNewNode = {
      parent_id: Number(connectingNodeId.current)
    }
    createNewNode(new_element)


  }




  // // we are using a bit of a shortcut here to adjust the edge type
  // // this could also be done with a custom edge for example
  // const edgesWithUpdatedTypes = edges.map((edge) => {
  //   console.log("edges with updated types", edge)
  //   if (edge.sourceHandle) {
  //     const edgeType = nodes.find((node) => (node.type === 'custom'))
  //     if (typeof edgeType === "undefined") return edge;
  //     const edgeType2 = edgeType.data.selects[edge.sourceHandle];
  //     edge.type = edgeType2;
  //   }

  //   return edge;
  // });

  const onNodesChange = (nodeChanges: NodeChange[]) => {
    console.log("nodeChanges", nodeChanges)
    nodeChanges.forEach((xs, ii) => {

      if (xs.type == "position") {
        if (xs.dragging === true) {
          const oldNodes: Node[] = structuredClone(nodes)
          const newNodes = oldNodes.map((node, ii) => {
            if (node.id === xs.id) {
              if (typeof xs.position !== "undefined") {
                node.position = xs.position
              }
            }
            return node
          })
          setNodes(newNodes)
        }
      }
    })
  }
  const onEdgesChange = (edgeChanges: EdgeChange[]) => {
    console.log("onEdgesChange")
  }

  function onSelectionEnd() {
    console.log("selection end", arguments)
  }





  console.log("render")
  return (
    <>
      <div style={{ padding: "200px", paddingTop: "20px" }}>
        <div style={{ height: "30px" }}>
          <button onClick={() => { fitView() }}>Fit view</button>
          <button>Attempt to retain user spacing</button>
          <button
            onClick={() => { setShowHidden(!showHidden) }}
            style={{ backgroundColor: showHidden ? "green" : "initial" }}
          >{(showHidden ? "Hide" : "Show") + " archived"}</button>
        </div>
        <div style={{ border: "1px solid #d7dce1", height: "100%" }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            {...{ onNodesChange, onEdgesChange }}
            onConnect={onConnect}
            onInit={onInit}
            attributionPosition="top-right"


            nodeTypes={TendableNodes}
            panOnDrag={true}
            selectionOnDrag={true}
            selectNodesOnDrag={true}
            selectionKeyCode={"Control"}

            onKeyDown={(event) => { if (event.ctrlKey) setSelectNodesOnDrag(true) }}
            onKeyUp={(event) => { if (event.ctrlKey) setSelectNodesOnDrag(false) }}

            onSelectionEnd={onSelectionEnd}
            onSelectionChange={onSelectionChange}

            onConnectStart={onConnectStart}
            onConnectEnd={onConnectEnd}
          >
            <MiniMap style={minimapStyle} zoomable pannable />
            <Controls />
            <Background color="#aaa" gap={16} />
          </ReactFlow>
        </div>
      </div>
    </>
  );
};
export { TendableReactFlowInstance }