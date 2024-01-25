const infoString = document.createElement('p')
infoString.setAttribute('id', 'info')

const versionString = document.createElement('p')
versionString.setAttribute('id', 'version')

document.body.appendChild(versionString)
document.body.appendChild(infoString)

const version = document.getElementById('version')
const information = document.getElementById('info')

version.innerText = `My Warehouse (v${window.versions.application()})`
information.innerText = `This app is using Chrome (v${window.versions.chrome()}), Node.js (v${window.versions.node()}), and Electron (v${window.versions.electron()})`
