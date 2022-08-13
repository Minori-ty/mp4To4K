const ResEdit = require('resedit')
const PELibrary = require('pe-library')
const fs = require('fs')

let data = fs.readFileSync('video.exe')
let exe = PELibrary.NtExecutable.from(data)
let res = PELibrary.NtExecutableResource.from(exe)

let iconFile = ResEdit.Data.IconFile.from(fs.readFileSync('./src/assets/logo.ico'))

ResEdit.Resource.IconGroupEntry.replaceIconsForResource(
    res.entries,
    1,
    1033,
    iconFile.icons.map((item) => item.data)
)

res.outputResource(exe)
let newBinary = exe.generate()
fs.writeFileSync('./video.exe', Buffer.from(newBinary))
fs.renameSync('./video.exe', './一键转4K视频.exe')
