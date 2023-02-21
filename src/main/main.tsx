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
import type { Hierarchy } from 'src/types/Hierarchy';
//test sample data
import { table_data } from "../data/table_data";
//available tendable node types 
//(eg. different nodes available to use on the graph)
//such as, "organisation", "organisation_element", "hierarchy_element"
import { TendableNodes } from './TendableNodes'


import { convert_table_data_to_nodes_edges } from 'src/funcs/convertTableDataToNodesEdges';
import { Server } from 'src/server/server';
import { getNodeDescendants } from 'src/funcs/getNodeDescendants';
import { setCameraToNodes } from 'src/funcs/setCameraToNodes';



//styles
//React-Flow basic styles
import 'reactflow/dist/style.css'
//import './overview.css'


const minimapStyle = { height: 120 }









export type TableData = { hierarchy_levels: HierarchyElement[], hierarchy: Hierarchy[] }

interface HierarchyProps {
  orgInfo: OrganisationInformation
}
const OverviewFlow = ({ orgInfo }: HierarchyProps) => {

  const [showHidden, setShowHidden] = useState<boolean>(false)
  const tableData = useRef<TableData>({ hierarchy_levels: [], hierarchy: [] })
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectNodesOnDrag, setSelectNodesOnDrag] = useState<boolean>(false)
  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), []);


  const connectingNodeId = useRef<string | null>(null)
  const { project, getViewport, zoomOut, setViewport, fitView } = useReactFlow();
  //const { x, y, zoom } = useViewport();
  const [refresh, setRefresh] = useState<boolean>(false)
  const [init, setInit] = useState<boolean>(false)


  const onInit = (reactFlowInstance: any) => {
    setInit(true);
    console.log('flow loaded:', reactFlowInstance);
  }



  useEffect(() => {
    //show deleted nodes

    

  }, [showHidden])

  useEffect(() => {
    const descendants = getNodeDescendants(1, tableData.current.hierarchy_levels)
    console.log("descendants", descendants)
    console.log(tableData.current.hierarchy_levels)
  }, [refresh])

  useEffect(() => {
    console.log("refreshing")


    const styles: HierarchyElementStyles = {
      type: "organisation",
      //type: "basicWithGeneric",
      //type: "basic",
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
      styles,
      archived_at: null,
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


    setTimeout(() => {
      fitView()
    }, 100)

  }, [refresh])


  // we are using a bit of a shortcut here to adjust the edge type
  // this could also be done with a custom edge for example
  const edgesWithUpdatedTypes = edges.map((edge) => {
    console.log("edges with updated types", edge)
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
    console.log("onEdgesChange")
  }

  function onSelectionEnd() {
    console.log("selection end", arguments)
  }



  function callback(hls: HierarchyElement[], hs: Hierarchy[]) {
    tableData.current = { hierarchy_levels: hls, hierarchy: hs }
    setRefresh(!refresh)
  }


  console.log("render")
  return (
    <>
      <div>
        <button onClick={() => { setRefresh(!refresh) }}>Refresh</button>
        <button onClick={() => { console.log("viewport:", getViewport()) }}>Viewport</button>
        <Server callback={callback} data={tableData} />
      </div>
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
            edges={edgesWithUpdatedTypes}
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