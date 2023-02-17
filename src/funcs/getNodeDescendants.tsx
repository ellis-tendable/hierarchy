import { HierarchyElement } from "src/types/HierarchyElement";




function getImmediateDescendants(node_id: number, hs: HierarchyElement[]): HierarchyElement[] {
    return hs.filter(node => node.parent_hierarchy_level_id === node_id);
}
function getAllNodeDescendant(node_id: number, hs: HierarchyElement[]): HierarchyElement[] {
    const branch_nodes: HierarchyElement[] = []
    const node_ids_to_test: number[] = [node_id]

    var stop = true 
    while (stop) {

        // stop when no mode nodes to test
        if (node_ids_to_test.length === 0) stop = false

        const test_id = node_ids_to_test.pop() as number
        const descendants = getImmediateDescendants(test_id, hs)
        descendants.forEach(node => branch_nodes.push(node))
        descendants.forEach(node => node_ids_to_test.push(node.id))
        
    }

    return branch_nodes;
}
function getNodeDescendants(node_id: number, hs: HierarchyElement[]): HierarchyElement[] {
    return getAllNodeDescendant(node_id, hs);
}
export { getNodeDescendants }