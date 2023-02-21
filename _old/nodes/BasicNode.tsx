// import React, { memo } from "react"
// import { Handle, Node, NodeProps, Position } from "reactflow"
// import { HierarchyElementNode } from "../components/HierarchyElementNode"
// import { OrganisationElementNode } from "../../src/elements/components/OrganisationElementNode"
// import { OrganisationNode } from "../../src/elements/components/OrganisationNode"
// import type { OrganisationNodeProps } from "../../src/elements/components/OrganisationNode"

// import "./styles/BasicNode.css"


// type BasicNodeTypes = 
//     "organisation" 
//     | "hiearchy-element"
//     | "organisation-element"

// type NodeChildDataTypes<T extends BasicNodeTypes> =
//     T extends "organisation" ? OrganisationNodeProps & { type: "organisation" }:
//     T extends "hierarchy-element" ? { hierarchy_element: true } :
//     T extends "organisation-element" ? { organisation_element: true } : never

// // interface BasicNodeProps {
// //     type: BasicNodeTypes
// //     props: NodeChildDataTypes<BasicNodeTypes>
// // }
// const Types: {
//     "organisation": OrganisationNodeProps
// } = {
//     "organisation": { name: "", code: "" }
// } as const;

// type BasicNodeProps = 
//     { type: "organisation", data: OrganisationNodeProps }
//     | { type: "hierarchy-element", data: { } }
//     | { type: "organisation-element", data: { } }



// const BasicNode = ({ type, data }: NodeProps<BasicNodeProps>) => {

    
//     if (data.type === "organisation") {
//         const xs = data.data

//     }
    
//     return (
//         <>
//         <div className="basic-node">
//             { data.type === "organisation" && <OrganisationNode {...data}/> }
//             { data.type === "organisation" && <HierarchyElementNode {...data.data}/> }
//             { data.type === "organisation-element" && <OrganisationElementNode/> }
//         </div>
//         <Handle 
//             type="source" 
//             position={Position.Bottom}
//             className={"tendable-handle"}/>
//         </>
//     )
// }

// export type { BasicNodeProps }
// export default memo(BasicNode)
export {}