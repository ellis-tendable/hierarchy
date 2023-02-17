import { HierarchyElement } from "src/types/HierarchyElement";
import { getNodeDescendants } from "./getNodeDescendants";



function computeBranch(hs: HierarchyElement[]) {

}
function getMaxLevelNumber(hs: HierarchyElement[]): number {
    var max = 0
    hs.forEach((h, ii) => {
        if (h.level_number > max) max = h.level_number
    })
    return max; 
}
type ReturnType<T extends HierarchyElement, K extends keyof T> = { [key: string]: T[] }
function groupObjectsByKey<T extends HierarchyElement, K extends keyof T>(ls: T[], key: K): ReturnType<T, K> {
    const result: ReturnType<T, K> = {}


    for (var ii = 0; ii < ls.length; ii++) {
        const item = ls[ii]
        const value = item[key] as string

        if (value in result) {
            result[value].push(item)
        } else {
            result[value] = [item]
        }
    }
    return result
}

interface Results {
    [index: string]: number
}
function computeNodesAtLevel(hs: HierarchyElement[], level_number: number, results: Results): Results {
    console.log("input", results) 

    //filter for nodes at the given level number
    const nodes = hs.filter(x => x.level_number == level_number)
    console.log('nodes by id', nodes.map(x => x.id)) 

    //group nodes by their common parent_hierarchy_level_id
    const newGroups = groupObjectsByKey(nodes, "parent_hierarchy_level_id")


    Object.entries(newGroups).forEach(([parent_id, gs], ii) => {
        //find existing parent in list
        console.log("testing groups:", gs)

        var totalPoints = 0

        gs.forEach((x, ii) => {

            if (x.id in results) {
                totalPoints += results[x.id]
                return;
            } 
            
            results[x.id] = 1
            totalPoints += results[x.id]
            return; 
        })

        // const extra = gs.map(x => {
        //     if (x.id === null) return 0
        //     if (x.id in results) {
        //         if (results[x.id] == 1) return 0
        //         return results[x.id]
        //     }
        //     return 0
        // })
        // const extraSum = extra.reduce((a, b) => a + b, 0)
        // console.log("extra", extra)
        // console.log("extraSum", extraSum)
        // results[parent_id] = gs.length + extraSum
        console.log("totalPoints", totalPoints)
        results[parent_id] = totalPoints
    })


    console.log("output", results) 
    return results;
}
function computePositioning(hs: HierarchyElement[]) {

    var results: Results = {}
    const nodes = getNodeDescendants(0, hs)
    console.log("startNodes", nodes)
    console.log("computing positions")
    //lets work up the tree
    var max_level = getMaxLevelNumber(hs)
    var level = max_level
    while (level > 0) {
        console.group("level", level)
        results = computeNodesAtLevel(nodes, level, results)
        level -= 1
        console.groupEnd()
        console.log("\n\n")
    }
    console.log("results", results)


    // // const first = startNodes.filter(x => x.level_number == 1)
    // // for (var ii = 0; ii < first.length; ii++) {
    // //     const node = first[ii]

    // //     const node_desc = getNodeDescendants(node.id, hs)
    // //     console.log("node desc", node_desc)

    // //     break
    // // }

    // //lets work up the tree
    // const max = getMaxLevelNumber(hs)
    // const maxNodes = nodes.filter(x => x.level_number == max)
    // console.log('maxNodes', maxNodes) 
    // //group by parent id
    // const groups = groupObjectsByKey(maxNodes, "parent_hierarchy_level_id")

    // console.log("groups", groups)




    // Object.entries(groups).forEach(([parent_id, gs], ii) => {

    //     results[parent_id] = gs.length

    // }) 

    // console.log("result", results)

    // //decrease level number
    // const newLevelNumber = max - 1
    // const newMaxNodes = nodes.filter(x => x.level_number == newLevelNumber)
    // console.log('newMaxNodes', newMaxNodes) 
    // const newGroups = groupObjectsByKey(newMaxNodes, "parent_hierarchy_level_id")

    // Object.entries(newGroups).forEach(([parent_id, gs], ii) => {
    //     //find existing parent in list
    //     console.log("testing gs:", gs)
    //     const extra = gs.map(x => {
    //         if (x.id === null) return 0
    //         if (x.id in results) {
    //             if (results[x.id] == 1) return 0
    //             return results[x.id]
    //         }
    //         return 0
    //     })
    //     const extraSum = extra.reduce((a, b) => a + b, 0)
    //     console.log("extra", extra)
    //     console.log("extraSum", extraSum)
    //     results[parent_id] = gs.length + extraSum
    // })

    // console.log("results after second iteration:", results)



    // position: { x: 200, y: -50 }
    var w = 100
    //iterate through levels, and assign positions, starting left most, with depth

    const rs: any = {}
    const rs_frac: any = {}

    level = 1
    while (level < max_level + 1) {
        // if (level > 2) break
        //filter for nodes at the given level number
        const nodes = hs.filter(x => x.level_number == level)
        console.log('nodes by id', nodes.map(x => x.id)) 



        nodes.forEach((xs, ii) => {
            if (xs.parent_hierarchy_level_id == null) return;

            console.group("\nnew node")
            var existing_nodes_hs = nodes.slice(0, ii)
            //on same level? - NO! not same level, but same level AND from the same parent hierarchy
            //as this is determining the local position in each branch
            existing_nodes_hs = existing_nodes_hs.filter(x => x.parent_hierarchy_level_id === xs.parent_hierarchy_level_id)
            console.log("existing nodes", existing_nodes_hs)
            var existing_nodes: number[] = existing_nodes_hs.map(x => results[x.id])
            var x_frac_start = existing_nodes.reduce((a, b) => a + b, 0)
            console.log('x_start', x_frac_start)


            const x_frac_end = results[xs.id]
            const parent_frac = results[xs.parent_hierarchy_level_id]
            console.log("x_end", x_frac_end, "parent_frac", parent_frac)


            
          
            rs[xs.id] = {
                s: x_frac_start / parent_frac,
                e: (x_frac_start / parent_frac) + (x_frac_end / parent_frac)
            }



            if (xs.parent_hierarchy_level_id in rs) {
                const parent_dims = rs[xs.parent_hierarchy_level_id]
                const parent_diff = parent_dims.e - parent_dims.s

                console.log(xs)
                console.log("parent dims", parent_dims)
                console.log("parent diff", parent_diff)
                console.log("rs[xs.id]", rs[xs.id])
                console.log(JSON.parse(JSON.stringify(rs)))

                rs[xs.id] = {
                    s: parent_dims.s + (rs[xs.id].s * parent_diff),
                    e: parent_dims.s + (rs[xs.id].e * parent_diff)
                }

                console.log("rs_frac[xs.id]", rs_frac[xs.id])

            } else {
                rs[xs.id] = rs[xs.id]
            }
            console.groupEnd()
            console.log("\n\n")

        })

        console.log("rs", rs)
        console.log("rs_frac", rs_frac)
        level += 1 
    }



    type RR = { [key: string]: { x: number, y: number } }
    const rr: RR = {}


    var mult = 500 

    var lowest_level_node = nodes.filter(x => x.level_number === max_level)[0]
    if (typeof lowest_level_node !== "undefined" && lowest_level_node.id in rs) {
        const xs = rs[lowest_level_node.id]
        const xs_diff = xs.e - xs.s


        console.log("old mult", mult)

        mult = 200 / xs_diff
        console.log("new mult", mult)
    }



    var default_width = 100

    Object.entries(rs).map(([id, xs], ii) => {
        const { s, e } = xs as any

        const s_bound = s * mult 
        const e_bound = e * mult
        const diff_bound = e_bound - s_bound
        const padd_each_side = diff_bound - default_width
        const padd_single = padd_each_side / 2

        console.log("id", id)
        console.log("s_bound", s_bound, "e_bound", e_bound, "diff_bound", diff_bound, "padd_each_side", padd_each_side, "padd_single", padd_single)

        const x = s_bound + padd_single
        const y = 0
        rr[id] = { x, y }
    })




    // nodes.forEach((n, ii) => {
    //     if (n.id == "0") return;

    //     if (n.id in positioning) {
    //     const real_node = hierarchy_levels.filter(x => String(x.id) == n.id)[0]
    //     const parent_node = hierarchy_levels.filter(x => real_node.parent_hierarchy_level_id == x.id) 
        
    //     const parent_id = String(real_node.parent_hierarchy_level_id)
    //     const parent_frac = positioning[parent_id]

    //     const child_frac = positioning[n.id]

    //     console.log("child frac", child_frac, "parent frac", parent_frac)
    //     const 

    //     }

    // })


    //work on distance for middle of organisation element to sit
    const first_level = nodes.filter(x => x.level_number === 1)
    const first_level_xs = first_level.map(x => rr[x.id].x)
    const first_level_sum = first_level_xs.reduce((a, b) => a + b, 0)
    const first_level_avg = first_level_sum / first_level_xs.length
    rr["0"] = { x: first_level_avg, y: 0 }




    return rr;
}
export { computePositioning }