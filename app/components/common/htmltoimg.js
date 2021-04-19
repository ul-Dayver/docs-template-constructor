//import {documentBody,removeAttribute} from '../layouts/Helpers'
const docviewPageheight = 29.7
const docviewPagewidth = 21
const docviewPagepadding = 2
const docviewPagezoom = 40
const docviewPagefontSize = 30
//const docviewPagelineSeight = docviewPageheight / docviewPagewidth //1.42857
//const docviewPageline = docviewPagefontSize * docviewPagelineheight //20
//const docviewPageident = '30px'
const docviewPagepaddingPx = (docviewPagepadding * docviewPagezoom) + 'px'

const Width = (docviewPagewidth * docviewPagezoom)
const Height = (docviewPageheight * docviewPagezoom)
const zoomWidth = docviewPagewidth * 10
const zoomHeight = docviewPageheight * 10

let Style = ".document-constructor-page {background-color: #fff; height: 100%; border: 1px solid #000; border: 1px solid rgba(0, 0, 0, 0.3); margin: 0 auto; box-shadow: 1px 2px 3px 1px rgba(0, 0, 0, 0.6); display: flex; flex-direction: column;}"
 + ".document-constructor-page-header, .document-constructor-page-footer {min-height: "+docviewPagepaddingPx+"; margin: 0 "+docviewPagepaddingPx+"; padding-top: 10px;}"
 + ".document-constructor-textblock {font-family: Arial, Helvetica, sans-serif;margin-top: .5em;} .document-constructor-textblock:first-child {margin-top: 0;}"
 + ".bg-highlight {background-color: rgba(86,61,124,.15);border: 1px solid rgba(86,61,124,.15);}"
 + ".document-constructor-page-body {margin: 0 "+docviewPagepaddingPx+"; height: "+(Height - (docviewPagepadding * docviewPagezoom) * 2)+"px;overflow: hidden;font-size: "+docviewPagefontSize+";}"
 + ".document-constructor-page-body h1 {font-size: " + (docviewPagefontSize + 12) + "px;}"
 + ".document-constructor-page-body h2 {font-size: " + (docviewPagefontSize + 7) + "px;}"
 + ".document-constructor-page-body h3 {font-size: " + (docviewPagefontSize + 4) + "px;}"
 + ".document-constructor-page-body h4 {font-size: " + (docviewPagefontSize + 2 ) + "px;}"
 + ".document-constructor-page-body h5 {font-size: " + (docviewPagefontSize - 1 ) + "px;}"
 + ".document-constructor-page-body h6 {font-size: " + (docviewPagefontSize - 3 ) + "px;}"
 + ".document-constructor-page-body h3, .document-constructor-page-body h4, .document-constructor-page-body h5 {margin-top: 0;}"
 + ".document-constructor-page-body table.document-constructor-table {width: 100%; border-collapse: collapse;border-spacing: 0px;table-layout: fixed;}"
 + ".document-constructor-page-body table.document-constructor-table > tbody > tr > td {position: relative; padding: 0px; vertical-align: top;}"
 + ".text-center {text-align: center;}.text-right {text-align: right;}.text-left {text-align: left;}.text-justify{text-align: justify;}"
 + ".border {border: 1px solid transparent;}.border-dark {border-color: #343a40;}.border-right-dark {border-right-color: #343a40;}.border-left-dark {border-left-color: #343a40;}.border-top-dark {border-top-color: #343a40;}.border-bottom-dark {border-bottom-color: #343a40;}"
 + ".border-0 {border: 0 !important;}"
 + ".text-primary{display: none}"
 /*
function filter(node) {
  if (node.nodeType !== 1) return;
  if (node.className == 'table-column-border-dragger') return node.parentNode.removeChild(node)
  if (node.childNodes.length) {
    node.childNodes.forEach(filter)
  }
  node.className = node.className.split(' ').map(name => name.toLowerCase().indexOf('draft') < 0 ? name : null).join(' ')

  if (node.hasAttributes()) {
    for(let i=0; i<node.attributes.length; i++) {
      let attr = node.attributes[i]
      if (attr.name !== 'class' && attr.name !== 'style' || !attr.value.length) {
        removeAttribute(node, attr.name)
      }
    }
  }
}
*/
export default function (html) {
  html = html.cloneNode(true)
  //filter(html)
  
  html = new XMLSerializer().serializeToString(html)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = zoomWidth
  canvas.height = zoomHeight
  const targetImg = document.createElement('img')
  const tempImg = document.createElement('img')
  
  tempImg.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="'+Width+'px" height="'+Height+'px"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml"><style>'+Style+'</style>'+html+'</div></foreignObject></svg>')
/*
  const iframe = document.createElement('iframe')
  iframe.width = Width
  iframe.height = Height
  iframe.src="about:blank"
  documentBody.appendChild(iframe)
  const docIframe = iframe.contentWindow.document
  docIframe.open();
  docIframe.write("<html><head><style>"+Style+"</style></head><body>"+html+"</body></html>")
*/
  return new Promise((resolve) => {
    tempImg.addEventListener('load', e => {
      ctx.drawImage(e.target, 0, 0, zoomWidth, zoomHeight)
      targetImg.src = canvas.toDataURL()
      const ret = targetImg.src
      canvas.remove()
      targetImg.remove()
      tempImg.remove()
      resolve(ret)
    })
  })
}






