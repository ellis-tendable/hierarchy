import { memo } from "react"
import { NodeProps } from "reactflow"
import { BasicWrapper } from "./BasicWrapper"
import "./styles/OrganisationElementNode.css"
interface OrganisationElementNodeProps {

}
const OrganisationElementNode = ({}: NodeProps<OrganisationElementNodeProps>) => {


    return (
        <BasicWrapper>
            <div>OrganisationElementNode</div>
        </BasicWrapper>
    )
}
export type { OrganisationElementNodeProps }
export default memo(OrganisationElementNode)