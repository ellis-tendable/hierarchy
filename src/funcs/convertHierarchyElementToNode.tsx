import { Node } from "reactflow";
import { HierarchyElement } from "src/types/HierarchyElement";



function convert_hierarchy_level_to_node(index: number, hierarchy_level: HierarchyElement): Node {
  const node: Node = {
    id: String(hierarchy_level.id),
    position: { x: index * 200, y: hierarchy_level.level_number * 100 },
    data: { label: hierarchy_level.name }
  }

  if (hierarchy_level.styles) {
    if (hierarchy_level.styles.type) {
      node.type = hierarchy_level.styles.type
    }

    if (hierarchy_level.styles.data) {
      node.data = { ...hierarchy_level.styles.data }
    }

    if (hierarchy_level.styles.css) {
      node.style = hierarchy_level.styles.css 
    }

    if (hierarchy_level.styles.position) {
      node.position = hierarchy_level.styles.position      
    }
  }

  return node;
}
export default convert_hierarchy_level_to_node;