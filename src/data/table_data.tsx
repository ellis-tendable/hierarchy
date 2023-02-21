import { Hierarchy } from "src/types/Hierarchy";
import type { HierarchyElement } from "src/types/HierarchyElement";




const hierarchy_levels: HierarchyElement[] = [
    {
        id: 0,
        hierarchy_id: 0,
        level_number: 1,
        name: "MyHierarchyElement1",
        parent_hierarchy_level_id: null
    },
    {
        id: 1,
        hierarchy_id: 0,
        level_number: 2,
        name: "MyHierarchyElement 2-1",
        parent_hierarchy_level_id: 0  
    },
    {
        id: 2,
        hierarchy_id: 0,
        level_number: 2,
        name: "MyHierarchyElement 2-2",
        parent_hierarchy_level_id: 0  
    },
];


const hierarchy: Hierarchy[] = [
    {
        id: 0,
        name: "Hierarchy 0"
    }
]





const table_data = { hierarchy_levels, hierarchy }

export { table_data }