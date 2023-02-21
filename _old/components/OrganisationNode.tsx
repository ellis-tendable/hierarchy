import "./styles/OrganisationNode.css"
interface OrganisationNodeProps {
    name: string
    code: string
}
const OrganisationNode = ({ name, code }: OrganisationNodeProps) => {

   
    return (
        <div>
            <div>{ name }</div>
            <div></div>
            <div>{ code }</div>
        </div>
    )
}
export type { OrganisationNodeProps }
export { OrganisationNode }