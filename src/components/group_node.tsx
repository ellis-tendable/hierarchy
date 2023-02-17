import React, { memo } from "react"
import Handle, { Node, NodeProps } from "reactflow"


interface GroupNodeProps {
    name: string
}
const GroupNode = ({ data }: NodeProps<GroupNodeProps>) => {


    
    return (
        <>
        <div>
            <div>{ data.name }</div>
        </div>
        </>
    )
}
//export { GroupNode }
export type { GroupNodeProps }
export default memo(GroupNode)