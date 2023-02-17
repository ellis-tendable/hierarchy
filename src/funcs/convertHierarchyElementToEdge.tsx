import { Edge } from "reactflow";
import { HierarchyElement } from "src/types/HierarchyElement";


function convert_hierarchy_level_to_edge(index: number, hierarchy_level: HierarchyElement): Edge {
  const edge: Edge = {
    id: "edge-" + String(hierarchy_level.id),
    //type: "straight",
    type: "default",
    source: String(hierarchy_level.parent_hierarchy_level_id),
    target: String(hierarchy_level.id),
  }
  return edge;
}
export default convert_hierarchy_level_to_edge;