import { useState, useRef, useEffect } from "react"
import { ReactFlowProvider } from "reactflow"
import { Hierarchy } from "src/types/Hierarchy"
import { HierarchyElementStyles, HierarchyElement } from "src/types/HierarchyElement"
import { TendableReactFlowInstance } from "./TendableReactFlowInstance"
import { Server } from "src/server/server"
import { convert_table_data_to_nodes_edges } from "src/funcs/convertTableDataToNodesEdges"
import { TableData } from "src/types/TableData"


interface OrganisationInformation {
    name: string
    code: string
}



const TendableHiearchy = (props: {}) => {


    const [orgInfo, setOrgInfo] = useState<OrganisationInformation>({
        name: "Nuffield Health", code: "NUF123456UK"
    })

    const [refresh, setRefresh] = useState<boolean>(false)
    const tableData = useRef<TableData>({ hierarchy_levels: [], hierarchy: [] })


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

    }, [refresh])



    function callback(hls: HierarchyElement[], hs: Hierarchy[]) {
        tableData.current = { hierarchy_levels: hls, hierarchy: hs }
        setRefresh(!refresh)
    }

    function createNewNode(node: { parent_id: number }) {

        const parent_node: HierarchyElement =
            tableData.current.hierarchy_levels.filter(x => x.id == node.parent_id)[0]



        var max_id = Math.max(...tableData.current.hierarchy_levels.map(x => x.id))
        max_id += 1
        const new_hierarchy_element: HierarchyElement = {
            id: max_id,
            hierarchy_id: 0,
            level_number: parent_node.level_number + 1,
            parent_hierarchy_level_id: parent_node.id,
            name: "HierarchyElement-" + max_id,
            archived_at: null
        }
        tableData.current.hierarchy_levels.push(new_hierarchy_element)
    }

    return (
        <div className="main">
            <Server callback={callback} data={tableData} />
            <ReactFlowProvider>
                <TendableReactFlowInstance tableData={tableData} createNewNode={createNewNode} />
            </ReactFlowProvider>
        </div>
    )
}
export { TendableHiearchy }