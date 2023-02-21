import { useEffect, useState } from "react"
import type { Hierarchy } from "src/types/Hierarchy"
import type { HierarchyElement } from "src/types/HierarchyElement"
import { TableData } from "src/types/TableData"

import "./server.css"


const url = 'http://localhost:3001'

interface ServerProps {
    callback: (hls: HierarchyElement[], hs: Hierarchy[]) => void
    data: React.RefObject<TableData>
}
const Server = ({
    callback, data    
}: ServerProps) => {

    const [idx, setIdx] = useState<number>(2)

    async function send(data: any) {
        const req = new Request(url, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const res = await fetch(req)
        const json = await res.json()
        console.log("Json", json)
        return json.data
    } 

    async function write_new() {
        const res = await send({ type: 'write_new', data: {} })
        reload()
    }
    async function load(index: number) {
        return send({ type: 'load', data: { }, index })
    }
    async function get_files() {
        return send({ type: 'get_files', data: {} })
    }
    async function _save(index: number) {
        return send({ type: 'save', data: data.current, index })
    }

    const [files, setFiles] = useState<any[]>([])


    async function reload() {
        const ls = await get_files()
        setFiles(ls)
    }

    async function refresh() {
        if (typeof idx === "undefined") return;
        const data = await load(idx)
        console.log('data loaded for ', idx, data)
        callback(data.hierarchy_levels, data.hierarchy)
    }

    async function pretty() {

    }

    async function save() {
        if (typeof idx === "undefined") return;
        _save(idx)
    }

    useEffect(() => {
        reload()
        refresh()
    }, []) 

    return (
        <div className="server">
        <div className="btns">
            <button onClick={() => { write_new() }}>new</button>
            <button onClick={() => { save() }}>save</button>
            <button onClick={() => { refresh() }}>refresh</button>
            <button onClick={() => { pretty() }}>pretty</button>
        </div>
        {
            files.map((name, ii) => {
                
                return (
                    <button
                        key={ii}
                        className=""
                        style={{
                            backgroundColor: name === idx ? "green" : "initial"
                        }}
                        onClick={async () => {
                            setIdx(name)
                            //const data = await load(name)
                            //console.log(data)
                        }}
                    >{ name }</button>
                )
            })
        }
        <div>
            <div>Message:</div>
        </div>
        </div>
    )
}


export { Server };

    