const ResEdit = require('resedit')
const PELibrary = require('pe-library')
const fs = require('fs')

let data = fs.readFileSync('transto4k.exe')
let exe = PELibrary.NtExecutable.from(data)
let res = PELibrary.NtExecutableResource.from(exe)

let iconFile = ResEdit.Data.IconFile.from(fs.readFileSync('logo.ico'))

ResEdit.Resource.IconGroupEntry.replaceIconsForResource(
    res.entries,
    1,
    1033,
    iconFile.icons.map((item) => item.data)
)

res.outputResource(exe)
let newBinary = exe.generate()
fs.writeFileSync('./transto4k.exe', new Buffer(newBinary))
