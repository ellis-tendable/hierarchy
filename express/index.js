const express = require('express')
const cors = require('cors')
const file = require('./file')

const app = express()

app.use(cors())
app.use(express.json())


app.post('/', async (req, res) => {

    const { type, data: input } = req.body
    console.log("type ->", type)

    if (type === 'write_new') {
        const index = await file.next_index()
        const data = await file.write_new(index, input)  
        console.log('data', data)
        res.json({ data })
    }
    if (type === 'load') {
        const data = await file.read_file(req.body.index)  
        res.json(data)
    }
    if (type === 'get_files') {
        const data = await file.get_files()  
        res.json({ data })
    }
    if (type === 'save') {
        const data = await file.write_new(req.body.index, input)  
        res.json({ data })
    }
})

app.get('/', async (req, res) => {

    // const data = await file.read_file('data/path1');
    // console.log('data', data)

    const data = await file.write_new(1, { data: "hello" })
    console.log('data', data)
    
    const index = await file.next_index()
    console.log('index', index)



    //res.json({ data: "hello" })
    res.json({ data: { data, index }})
})

app.listen(3001)