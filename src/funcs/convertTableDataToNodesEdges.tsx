import { Node, Edge } from "reactflow";
import { Hierarchy } from "src/types/Hierarchy";
import { HierarchyElement } from "src/types/HierarchyElement";
import { computePositioning } from "./computePositioning";
import convert_hierarchy_level_to_edge from "./convertHierarchyElementToEdge";
import convert_hierarchy_level_to_node from "./convertHierarchyElementToNode";




function convert_table_data_to_nodes_edges(hierarchy_levels: HierarchyElement[], hierarchy: Hierarchy[]) {

  const nodes: Node[] = hierarchy_levels.map((x, ii) => convert_hierarchy_level_to_node(ii, x))
  const edges: Edge[] = hierarchy_levels.map((x, ii) => convert_hierarchy_level_to_edge(ii, x))


  var max = 0
  for (var ii = 0; ii < 5; ii++) {
    const ts = hierarchy_levels.filter(x => x.level_number == ii)
    if (ts.length > max) max = ts.length
  }

  if ((max % 2) == 0) {
    // even, so spread either side
  } else {
    // not even so not
  }

  // spacing??
  // get node, get all descendants, find max, then that's it's 'needed' width
  // move to next in list

  const t1 = performance.now()
  const positioning = computePositioning(hierarchy_levels) as any
  const t2 = performance.now()
  console.log("time taken", t2 - t1, "ms")
  console.log("positioning", positioning)


  nodes.forEach((n, ii) => {
    if (n.id in positioning) {
      nodes[ii].position.x = positioning[n.id].x
    }
  })

  console.log("nodes", nodes)
  console.log("edges", edges)

  return {
    nodes, edges
  };
}
export { convert_table_data_to_nodes_edges }; 