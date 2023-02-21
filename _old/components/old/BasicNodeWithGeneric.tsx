




// interface BasicNodePropsWithGeneric<T extends BasicNodeTypes> {
//     type: T
//     data: NodeChildDataTypes<T>
//     //data: typeof Types[T]
//     more: true
// }
// const BasicNodeWithGeneric = <T extends BasicNodeTypes>({ type, data }: NodeProps<BasicNodePropsWithGeneric<T>>) => {





//     if (data["type"] === "organisation") {
//         //data["data"]
//     }
//     if (data.type === "organisation") {
//         const xs = data.data

//         // const 
//     }
//     // if (data.type === "organisation")
   
//     return (
//         <>
//         <div className="basic-node">
//             {/* { type === "organisation" && <OrganisationNode name={data..}/> } */}
//             {/* { type === "hiearchy-element" && <HierarchyElementNode/> } */}
//             {/* { type === "organisation-element" && <OrganisationElementNode/> } */}
//         </div>
//         <Handle 
//             type="source" 
//             position={Position.Bottom}
//             className={"tendable-handle"}/>
//         </>
//     )
// }
// const _BasicNodeWithGeneric = memo(BasicNodeWithGeneric)
// const genericMemo: <T>(component: T) => T = memo
export {}