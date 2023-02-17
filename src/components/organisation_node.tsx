import React, { memo } from "react"
import { Handle, Node, NodeProps, Position } from "reactflow"


import "./styles/organisation_node.css"

interface OrganisationNodeProps {
    name: string
    code: string
}
const OrganisationNode = ({ data }: NodeProps<OrganisationNodeProps>) => {


    
    return (
        <>
        <div className="org-node">
            <div>{ data.name }</div>
            <div></div>
            <div>{ data.code }</div>
        </div>
        <Handle 
            type="source" 
            position={Position.Bottom}
            className={"tendable-handle"}/>
        </>
    )
}
export type { OrganisationNodeProps }
export default memo(OrganisationNode)