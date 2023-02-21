import { Viewport, Node } from "reactflow"


function setCameraToNodes(nodes: Node[]): Viewport {
    //react-flow's default viewport
    const viewport: Viewport = { x: 0, y: 0, zoom: 1 } 


    const min_x = Math.min(...nodes.map(x => x.position.x))
    const max_x = Math.max(...nodes.map(x => x.position.x)) 

    const min_y = Math.min(...nodes.map(x => x.position.y))
    const max_y = Math.max(...nodes.map(x => x.position.y)) 


    

    return viewport 
}
export { setCameraToNodes }