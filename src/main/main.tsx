import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  EdgeChange,
  NodeChange,
  OnSelectionChangeFunc,
  NodeTypes,
  NodeProps,
  OnConnectEnd,
  useReactFlow,
  OnConnectStart,
  ReactFlowProvider,
  useViewport,
} from 'reactflow';


import { Hierarchy, HierarchyElement, table_data } from "../data/table_data";

//custom nodes
import type { GroupNodeProps } from 'src/components/group_node';
import GroupNode from 'src/components/group_node';

import type { OrganisationNodeProps } from 'src/components/organisation_node';
import OrganisationNode from 'src/components/organisation_node';




import CustomNode from '../components/custon_node';


import 'reactflow/dist/style.css';
import { convert_table_data_to_nodes_edges } from 'src/funcs/convertTableDataToNodesEdges';
import { Server } from 'src/server/server';
import { getNodeDescendants } from 'src/funcs/getNodeDescendants';
import { HierarchyElementStyles } from 'src/types/HierarchyElement';
//import './overview.css';

const nodeTypes: NodeTypes = {
  custom: CustomNode,
  group: GroupNode,
  organisation: OrganisationNode,
};

const minimapStyle = {
  height: 120,
};









export type TableData = { hierarchy_levels: HierarchyElement[], hierarchy: Hierarchy[] }

interface HierarchyProps {
  orgInfo: OrganisationInformation
}
const OverviewFlow = ({ orgInfo }: HierarchyProps) => {

  const tableData = useRef<TableData>({ hierarchy_levels: [], hierarchy: [] })
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectNodesOnDrag, setSelectNodesOnDrag] = useState<boolean>(false)
  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), []);


  const connectingNodeId = useRef<string|null>(null)
  const { project, getViewport, zoomOut, setViewport } = useReactFlow();
  const { x, y, zoom } = useViewport();
  const [refresh, setRefresh] = useState<boolean>(false)
  const [init, setInit] = useState<boolean>(false)


  const onInit = (reactFlowInstance: any) => {
    setInit(true);
    console.log('flow loaded:', reactFlowInstance);
  }


  useEffect(() => {
    console.log(x, y, zoom)
  }, [x, y, zoom])
  
  
  useEffect(() => {
    const descendants = getNodeDescendants(1, tableData.current.hierarchy_levels)
    console.log("descendants", descendants)
    console.log(tableData.current.hierarchy_levels)
  }, [refresh])

  useEffect(() => {



    const styles: HierarchyElementStyles = {
      type: "organisation",
      position: { x: 200, y: -50 },
      css: {
        backgroundColor: "transparent", width: 200, height: 100 
      },
      data: { name: orgInfo.name, code: orgInfo.code }
    }
    const topLevelNode: HierarchyElement = {
      id: 0,
      hierarchy_id: 0,
      level_number: 0,
      name: "MyHierarchyElement1",
      parent_hierarchy_level_id: null,
      styles
    }

    if (typeof tableData.current.hierarchy_levels.find(x => x.id === 0) === "undefined") {
      tableData.current.hierarchy_levels.push(topLevelNode)
    }

    const result = convert_table_data_to_nodes_edges(tableData.current.hierarchy_levels, tableData.current.hierarchy)

    // //add first level organisation node
    // const organisationNode: Node<OrganisationInformation> = {
    //   id: String(0),
    //   type: "organisation",
    //   position: { x: 200, y: -50 },
    //   style: { backgroundColor: "transparent", width: 200, height: 100, },
    //   data: {
    //     name: orgInfo.name,
    //     code: orgInfo.code
    //   }
    // }
    // // result.nodes.splice(0, 0, organisationNode)

    setNodes(result.nodes)
    setEdges(result.edges)
  }, [refresh])

  const doDefaultZoom = () => {
    setViewport({x: 736.2629128014834, y: 110.63749007216776, zoom: 1.1953903743485663})
  }
  useEffect(() => {
    doDefaultZoom()
  }, [init])

  // we are using a bit of a shortcut here to adjust the edge type
  // this could also be done with a custom edge for example
  const edgesWithUpdatedTypes = edges.map((edge) => {
    if (edge.sourceHandle) {
      const edgeType = nodes.find((node) => (node.type === 'custom'))
      if (typeof edgeType === "undefined") return edge;
      const edgeType2 = edgeType.data.selects[edge.sourceHandle];
      edge.type = edgeType2;
    }

    return edge;
  });

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

  }

  function onSelectionEnd() {
    console.log("selection end", arguments)
  }

  const onSelectionChange: OnSelectionChangeFunc = (params) => {
    console.log("selection change", params)
    const selectedNodes = params.nodes.filter(x => x.selected)
    if (selectedNodes.length <= 0) return;

    const groupNode: Node<GroupNodeProps> = {
      id: "group-1",
      type: "group",
      position: { x: 0, y: 0 },
      style: { backgroundColor: "rgba(255,0,0,0.2)", width: 200, height: 200 },
      data: {
        name: "Group 1"
      },
      zIndex: -1,
    }
    const oldNodes = structuredClone(nodes)
    oldNodes.push(groupNode)
    // setNodes(oldNodes)
    return;
  }


  function isMouseEvent(e: MouseEvent | TouchEvent): e is MouseEvent {
    return e.type === 'mouseup'
  }


  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);
  const onConnectEnd: OnConnectEnd = (event) => {

    if (!isMouseEvent(event)) return;

    if (typeof connectingNodeId.current !== "string") return;


    const targetIsPane = (event.target !== null) && (event.target instanceof Element) && (event.target.classList.contains("react-flow__pane"))


    console.log("event", event)

    const parent_node: HierarchyElement = 
      //(typeof connectingNodeId.current != null) ?
      tableData.current.hierarchy_levels.filter(x => x.id == Number(connectingNodeId.current))[0]
    


    var max_id = Math.max(...tableData.current.hierarchy_levels.map(x => x.id))
    max_id += 1
    const new_hierarchy_element: HierarchyElement = {
      id: max_id,
      hierarchy_id: 0,
      level_number: parent_node.level_number + 1,
      parent_hierarchy_level_id: parent_node.id,
      name: "HierarchyElement-" + max_id
    }
    tableData.current.hierarchy_levels.push(new_hierarchy_element)
    const result = convert_table_data_to_nodes_edges(tableData.current.hierarchy_levels, tableData.current.hierarchy)
    setNodes(result.nodes)
    setEdges(result.edges)

    // if (targetIsPane) {
    //   // we need to remove the wrapper bounds, in order to get the correct position
    //   //const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
    //   const top = 0;
    //   const left = 0;
    //   //const id = getId();
    //   const id = String(new Date().getTime())
    //   const newNode = {
    //     id,
    //     // we are removing the half of the node width (75) to center the new node
    //     position: project({ x: event.clientX - left - 75, y: event.clientY - top }),
    //     data: { label: `Node ${id}` },
    //   };

    //   const oldNodes: Node[] = structuredClone(nodes)
    //   oldNodes.push(newNode)
    //   setNodes(oldNodes)
    //   //setNodes((nds) => nds.concat(newNode));
    //   const oldEdges: Edge[] = structuredClone(edges)
    //   oldEdges.push({ id, source: connectingNodeId.current, target: id })
    //   setEdges(oldEdges)
    //   //setEdges((eds) => eds.concat({ id, source: connectingNodeId.current, target: id }));

    // }
  }

  function callback(hls: HierarchyElement[], hs: Hierarchy[]) {
    tableData.current = { hierarchy_levels: hls, hierarchy: hs }
    setRefresh(!refresh) 
  }
  return (
    <>
    <div>
      <button onClick={() => { setRefresh(!refresh) }}>Refresh</button>
      <button onClick={() => { console.log("viewport:", getViewport()) }}>Viewport</button>
      <Server callback={callback} data={tableData}/>
    </div>
      <div style={{ padding: "200px" }}>
      <div style={{ border: "1px solid #d7dce1", height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edgesWithUpdatedTypes}
        {...{ onNodesChange, onEdgesChange }}
        onConnect={onConnect}
        onInit={onInit}
        fitView
        attributionPosition="top-right"


        nodeTypes={nodeTypes}

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





interface OrganisationInformation {
  name: string
  code: string
}

interface MainProps { }
const Main = (props: MainProps) => {


  const [orgInfo, setOrgInfo] = useState<OrganisationInformation>({
    name: "Nuffield Health", code: "NUF123456UK"
  })

  return (
    <div className="main">
      <ReactFlowProvider>
        <OverviewFlow orgInfo={orgInfo} />
      </ReactFlowProvider>
    </div>
  )
}
export { Main }