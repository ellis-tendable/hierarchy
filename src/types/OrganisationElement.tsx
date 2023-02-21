import { CSSProperties } from "react"
interface OrganisationElementStyles {
    type?: "organisation" | "other" | "basicWithGeneric" | "basic"
    position?: { x: number, y: number }
    css?: CSSProperties
    data?: { name: string, code: string }
}
interface OrganisationElement {
    id: number
    hierarchy_id: number
    level_number: number
    name: string
    parent_hierarchy_level_id: number | null
    archived_at: null | Date
    styles?: OrganisationElementStyles 
}
export type { OrganisationElementStyles, OrganisationElement }