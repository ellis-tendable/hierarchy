const fs = require('fs').promises
const os = require('os')
const path = require('path')


async function write_new(index, data) {
    const filename = path.join(__dirname, 'data/run' + index + '.json')
    const result = await fs.writeFile(filename, JSON.stringify(data, null, 4), 'utf8')
    return { data: 'complete' }
}

async function read_file(index) {
    const filename = path.join(__dirname, 'data/run' + index + '.json')
    const data_unparsed = await fs.readFile(filename, 'utf8')
    const data = JSON.parse(data_unparsed)
    return { data }
}

async function get_files () {
    const foldername = path.join(__dirname, 'data')
    const files = await fs.readdir(foldername)
    const ls = files.map(x => Number(x.slice(3, x.length - 5)))
    return ls;
}

async function next_index() {
    const ls = await get_files();
    const max = Math.max(...ls)
    return max + 1
}




exports.write_new = write_new
exports.read_file = read_file
exports.get_files = get_files
exports.next_index = next_index