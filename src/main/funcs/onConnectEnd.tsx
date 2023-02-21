import { OnConnectEnd } from "reactflow";
import { convert_table_data_to_nodes_edges } from "src/funcs/convertTableDataToNodesEdges";
import { HierarchyElement } from "src/types/HierarchyElement";


// function isMouseEvent(e: MouseEvent | TouchEvent): e is MouseEvent {
//     return e.type === 'mouseup'
// }

// const onConnectEnd: OnConnectEnd = (event) => {

//     if (!isMouseEvent(event)) return;

//     if (typeof connectingNodeId.current !== "string") return;


//     const targetIsPane = (event.target !== null) && (event.target instanceof Element) && (event.target.classList.contains("react-flow__pane"))


//     console.log("event", event)

//     const parent_node: HierarchyElement =
//       //(typeof connectingNodeId.current != null) ?
//       tableData.current.hierarchy_levels.filter(x => x.id == Number(connectingNodeId.current))[0]



//     var max_id = Math.max(...tableData.current.hierarchy_levels.map(x => x.id))
//     max_id += 1
//     const new_hierarchy_element: HierarchyElement = {
//       id: max_id,
//       hierarchy_id: 0,
//       level_number: parent_node.level_number + 1,
//       parent_hierarchy_level_id: parent_node.id,
//       name: "HierarchyElement-" + max_id,
//       archived_at: null
//     }
//     tableData.current.hierarchy_levels.push(new_hierarchy_element)
//     const result = convert_table_data_to_nodes_edges(tableData.current.hierarchy_levels, tableData.current.hierarchy)
//     setNodes(result.nodes)
//     setEdges(result.edges)

//     // if (targetIsPane) {
//     //   // we need to remove the wrapper bounds, in order to get the correct position
//     //   //const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
//     //   const top = 0;
//     //   const left = 0;
//     //   //const id = getId();
//     //   const id = String(new Date().getTime())
//     //   const newNode = {
//     //     id,
//     //     // we are removing the half of the node width (75) to center the new node
//     //     position: project({ x: event.clientX - left - 75, y: event.clientY - top }),
//     //     data: { label: `Node ${id}` },
//     //   };

//     //   const oldNodes: Node[] = structuredClone(nodes)
//     //   oldNodes.push(newNode)
//     //   setNodes(oldNodes)
//     //   //setNodes((nds) => nds.concat(newNode));
//     //   const oldEdges: Edge[] = structuredClone(edges)
//     //   oldEdges.push({ id, source: connectingNodeId.current, target: id })
//     //   setEdges(oldEdges)
//     //   //setEdges((eds) => eds.concat({ id, source: connectingNodeId.current, target: id }));

//     // }
//   }

// export { onConnectEnd }