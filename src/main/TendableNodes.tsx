//React-Flow type for avaiable nodes to use in graph
import { NodeTypes } from 'reactflow';

//Tendable nodes
//group nodes
import type { GroupNodeProps } from 'src/components/GroupNode';
import GroupNode from 'src/components/GroupNode';
//organisation-node containing things like organisation's code and name
import type { OrganisationNodeProps } from 'src/components/OrganisationNode'
import OrganisationNode from 'src/components/OrganisationNode'
//organisation-element-node containing things like post code
import type { OrganisationElementNodeProps } from 'src/components/OrganisationElementNode'
import OrganisationElementNode from 'src/components/OrganisationElementNode'
//hierarchy-element-node containing configs
import type { HierarchyElementNodeProps } from 'src/components/HierarchyElementNode'
import HierarchyElementNode from 'src/components/HierarchyElementNode'


const TendableNodes: NodeTypes = {
    group: GroupNode,
    organisation: OrganisationNode,
    organisation_element: OrganisationElementNode,
    hierarchy_element: HierarchyElementNode
} as const
export { TendableNodes }