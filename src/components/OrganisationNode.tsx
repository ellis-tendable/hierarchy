import { memo } from "react"
import { NodeProps } from "reactflow"
import { BasicWrapper } from "./BasicWrapper"
import "./styles/OrganisationNode.css"
interface OrganisationNodeProps {
    name: string
    code: string
}
const OrganisationNode = ({ data }: NodeProps<OrganisationNodeProps>) => {


    const { name, code } = data


    return (
        <BasicWrapper>
            <div>{name}</div>
            <div></div>
            <div>{code}</div>
        </BasicWrapper>
    )
}
export type { OrganisationNodeProps }
export default memo(OrganisationNode)