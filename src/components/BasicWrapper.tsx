import { Handle, Node, NodeProps, Position } from "reactflow"
import "./styles/BasicWrapper.css"
interface BasicWrapperProps {
    children?: React.ReactNode
}
const BasicWrapper = ({ children }: BasicWrapperProps) => {


    return (
        <>
        <div className="basic-node">
            { children }
        </div>
        <Handle 
            type="source" 
            position={Position.Bottom}
            className={"tendable-handle"}/>
        </>
    )
}
export { BasicWrapper }