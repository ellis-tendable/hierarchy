import { memo } from "react"
import { BasicWrapper } from "./BasicWrapper"
import "./styles/HierarchyElementNode.css"
interface HierarchyElementNodeProps {

}
const HierarchyElementNode= ({}: HierarchyElementNodeProps) => {


    return (
        <BasicWrapper>
            <div>HierarchyElementNode</div>
        </BasicWrapper>
    )
}
export type { HierarchyElementNodeProps }
export default memo(HierarchyElementNode)