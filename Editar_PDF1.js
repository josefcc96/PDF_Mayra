import { PDFDocument, rgb, degrees } from 'pdf-lib'
import moment from 'moment';
import fs from 'fs';

import fontkit from '@pdf-lib/fontkit'
import { Canvas } from "canvas"
import PDF417 from "pdf417-generator"
import QRCode from 'qrcode'

import cmd from 'node-cmd'
// NO USAR I Ñ O Q
var s = 'ABCDEFGHJKLNPRSTUVWXYZ'

let rand = Math.floor(Math.random() * (98987 - 37479 + 1) + 12479);

const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function translate_color(color) {
  var new_color = color.toLowerCase().replace("\n", "").trim()

  switch (new_color) {
    case 'negro':
      return 'BLACK'
    case 'negra':
      return 'BLACK'
    case 'blanco':
      return 'WHITE'
    case 'blanca':
      return 'WHITE'
    case 'roja':
      return 'RED'
    case 'rojo':
      return 'RED'
    case 'azul':
      return 'BLUE'
    case 'verde':
      return 'GREEN'
    case 'amarilla':
      return 'YELLOW'
    case 'amarillo':
      return 'YELLOW'
    case 'naranja':
      return 'ORANGE'
    case 'anaranjado':
      return 'ORANGE'
    case 'anaranjada':
      return 'ORANGE'
    case 'marron':
      return 'BROWN'
    case 'gris':
      return 'GRAY'
    case 'dorado':
      return 'GOLD'
    case 'dorada':
      return 'GOLD'
    default:
      return new_color.toUpperCase()
  }

}
let letter = s[Math.floor(Math.random() * (22 + 1))];

let TAG = rand + letter + (Math.floor(Math.random() * 9) + 1);
// let TAG = "2144V71"

let TIPO_BASE = '1'
let output_name = TAG + ','


let VIN = `5J6RE3H78BL051298 
`
let YEAR = `2011        

`
let MAKE_COMPLETO = `Honda
`

let MAKE = `  Hond 
`
let COLOR = `Gray       
`
let NAME = `Martha Cecilia sanchez Ramirez

`
let DIRECCION = `600 deerfield rd, |Building#19 apt 1901 |Tarrytown LA |70056

`

let MODEL = `  CRV
`
let BODY = `ll
`
let MINOR = `
`

let DEALER_NUMBER = "P163915"
let DEALER = "RDG ENTERPRISES LLC"
let COUNTY = 227

COLOR = translate_color(COLOR)
MINOR = translate_color(MINOR)

NAME = removeAccents(NAME)
DIRECCION = removeAccents(DIRECCION)

let date_ISS = moment()
let ISSUE = date_ISS.format("MMM DD, YYYY");
// let ISSUE = "SEP 28, 2022";

let date_EXP = moment().add(2, 'months').add(1, 'days')
let EXP = date_EXP.format("MMM DD, YYYY");
// let EXP = "NOV 27, 2022";


MAKE = MAKE.toUpperCase().replace("\n", "").trim().substring(0, 4);

const CREATED_QR = new Date(Date.parse(ISSUE)).toLocaleDateString("en-US")
const EXPIRATION_QR = new Date(Date.parse(EXP)).toLocaleDateString("en-US")

let QR1 = `  ${VIN.toUpperCase().replace("\n", "").trim()}
YEAR: ${YEAR.replace("\n", "").trim()}
MAKE: ${MAKE.toUpperCase().replace("\n", "").trim()}
`
if (MINOR.replace("\n", "").trim() == '') {
  QR1 = QR1 + `COLOR: ${COLOR.toUpperCase().replace("\n", "").trim()}
`
}
else {
  QR1 = QR1 + `MAJOR COLOR: ${COLOR.toUpperCase().replace("\n", "").trim()}
MINOR COLOR: ${MINOR.toUpperCase().replace("\n", "").trim()}
` }

QR1 = QR1 + `VIN: ${VIN.toUpperCase().replace("\n", "").trim()}
TAG #: ${TAG.toUpperCase().replace("\n", "").trim()}
CREATED: ${CREATED_QR}
EXPIRATION: ${EXPIRATION_QR}
DEALER: ${DEALER.toUpperCase().replace("\n", "").trim()}
COUNTY: ${COUNTY}
TAG Type: BUYER
`



let QR2 = `${YEAR.replace("\n", "").trim().substring(2, 4)}
${VIN.toUpperCase().replace("\n", "").trim()}
${COUNTY}${date_ISS.format("YYYYMMDD")}${TAG.toUpperCase().replace("\n", "").trim()}${date_EXP.format("YYYYMMDD")}
YEAR: ${YEAR.toUpperCase().replace("\n", "").trim()}
MAKE: ${MAKE.toUpperCase().replace("\n", "").trim()}
`
if (MINOR.replace("\n", "").trim() == '') {
  QR2 = QR2 + `COLOR: ${COLOR.toUpperCase().replace("\n", "").trim()}
`
}
else {
  QR2 = QR2 + `MAJOR COLOR: ${COLOR.toUpperCase().replace("\n", "").trim()}
MINOR COLOR: ${MINOR.toUpperCase().replace("\n", "").trim()}
` }

QR2 = QR2 + `VIN: ${VIN.toUpperCase().replace("\n", "").trim()}
TAG #: ${TAG.toUpperCase().replace("\n", "").trim()}
CREATED: ${CREATED_QR}
EXPIRATION: ${EXPIRATION_QR}
DEALER: ${DEALER.toUpperCase().replace("\n", "").trim()}
COUNTY: ${COUNTY}
TAG Type: BUYER`



// 11 5NPDH4AEXGH725632 227202226122144V71 20232602 YEAR: 5NPDH4AEXGH725632 MAKE: 2011 COLOR: RED VIN: 5NPDH4AEXGH725632 TAG #: 2144V71 CREATED: 29 / 12 / 2022 EXPIRATION: 1 / 03 / 2023 DEALER: RDG ENTERPRISES LLC COUNTY: 227 TAG Type: BUYER
let QR = QR2
// MINOR COLOR: GOLD

console.log(QR)

async function fillForm(OUTPUT) {
  let base = "base03.pdf"
  let rotate = 0
  let indice = 0
  let fontSize = 140
  const file = await fs.readFileSync("bases/" + base)
  let canvas = new Canvas()
  // PDF417.draw(QR, canvas)
  const generateQR = async text => {
    try {
      return await QRCode.toDataURL(text, { margin: 0 })
    } catch (err) {
      console.error(err)
    }
  }
  const dataurl = await generateQR(QR)
  let heigh = 28
  const pdfDoc = await PDFDocument.load(file)
  pdfDoc.registerFontkit(fontkit)

  const qr_i = await pdfDoc.embedPng(dataurl)
  // const image = await pdfDoc.embedPng(fs.readFileSync('bases/ORIGINAL.png'))
  // const image1 = await pdfDoc.embedPng(fs.readFileSync('bases/lineasV.png'))


  // const fontBold = await pdfDoc.embedFont(fs.readFileSync('bases/refsanb.ttf'), { subset: true, customName: "MSReferenceSansSerif" })
  const font = await pdfDoc.embedFont(fs.readFileSync('bases/micross.ttf'), { subset: true, customName: "Microsoft Sans Serif" })
  const tahoma = await pdfDoc.embedFont(fs.readFileSync('bases/tahomabd.ttf'), { subset: true, customName: "Tahoma" })
  const verdana = await pdfDoc.embedFont(fs.readFileSync('bases/verdanab.ttf'), { subset: true, customName: "Verdana" })
  const acumin = await pdfDoc.embedFont(fs.readFileSync('bases/Acumin-RPro.otf'), { subset: true, customName: "Acumin Pro" })

  const pages = pdfDoc.getPages()

  let vinOpt = [{
    y: 90, // + -> , - <-
    x: 501,
    size: 20,
    font: tahoma,
    rotate: degrees(rotate),
    color: rgb(0, 0, 0),
  }
  ]
  // PRIMERA PAGINA
  let vin_text = [VIN.toUpperCase().replace("\n", "").trim(), VIN.toUpperCase().replace("\n", "").trim()]
  pages[0].drawText(vin_text[indice], vinOpt[indice])


  if (TIPO_BASE == '1') {
    pages[0].drawText("" + DEALER.toUpperCase().replace("\n", "").trim(), {
      y: 66, // + -> , - <-
      x: 489, // - ↑ , + ↓
      size: 20,
      font: tahoma,
      rotate: degrees(rotate),
      color: rgb(0, 0, 0),
    })
  }

  let year_make = YEAR.toUpperCase().replace("\n", "").trim() + '\n' + MAKE_COMPLETO.toUpperCase().replace("\n", "").trim()


  let yearOpt = [
    {
      y: 87,
      x: 22,
      size: 19.98,
      font: verdana,
      rotate: degrees(rotate),
      color: rgb(0, 0, 0),
    }]


  pages[0].drawText(year_make, yearOpt[indice])

  const x = (753 - font.widthOfTextAtSize(TAG.toUpperCase().replace("\n", "").trim(), 169.89)) / 2
  let tagOpt = [
    {
      y: 115,
      x: x,
      size: 169.89,
      font: font,
      rotate: degrees(rotate),
      color: rgb(0, 0, 0),

    }]

  pages[0].drawText(TAG.toUpperCase().replace("\n", "").trim(), tagOpt[indice])


  const x2 = (753 - acumin.widthOfTextAtSize(EXP.toUpperCase().replace("\n", "").replace(', ', ',').trim().toUpperCase().replace("\n", "").trim(), 72)) / 2
  let expOpt = [
    {
      y: 288,
      x: x2,
      size: 72,
      font: acumin,
      rotate: degrees(rotate),
      color: rgb(0, 0, 0),
    }]

  pages[0].drawText(EXP.toUpperCase().replace("\n", "").replace(', ', ',').trim().replace(', ', ','), expOpt[indice])



  heigh = 100
  let qrOpt = [
    {
      rotate: degrees(rotate),
      y: 286,
      x: 621,
      height: heigh,
      width: heigh,
    }]

  pages[0].drawImage(qr_i, qrOpt[indice])


  let COD = date_ISS.format('MMDDYY') + s[Math.floor(Math.random() * (22 + 1))] + s[Math.floor(Math.random() * (22 + 1))] + (Math.floor(Math.random() * (10))) + (Math.floor(Math.random() * (10)))


  for (const c in COD) {
    pages[0].drawText(COD[c], {
      y: 356 - (33.5 * c),
      x: 766,
      size: 30,
      font: tahoma,
      rotate: degrees(rotate),
      color: rgb(1, 1, 1),
    })
  }
  // pages[0].drawImage(image, imageOP[indice])


  // let svgPath = "M 367.11, 794.85 C -1.79, -6.55 - 3.13, -12.82 - 4.15, -18.66 - 1.51, -8.61 - 2.59, -15.1 - 3.14, -18.97 - 0.4, -2.88 - 1.2, -9.43 - 1.69, -14.53 - 0.25, -2.64 - 0.2, -3.34 - 0.75, -10.35 - 0.2, -2.55 - 0.43, -7.08 - 0.51, -8.53 - 0.18, -3.33 - 0.2, -3.99 - 0.28, -9.41 - 0.1, -7.01 - 0.21, -7.4 - 0.16, -11.16 0.02, -1.49 0.07, -3.08 0.17, -6.27 0.11, -3.43 0.18, -5.74 0.31, -8.58 0.15, -3.19 0.32, -7.02 0.76, -11.78 0.14, -1.49 0.4, -3.74 0.92, -8.17 0.96, -8.18 1.45, -12.34 1.9, -15.32 0.56, -3.71 1.04, -6.24 1.86, -10.54 0, 0 1.9, -9.95 4.33, -19.76 0.2, -0.82 0.97, -3.87 1.93, -7 0, 0 0, 0 0, 0 0.95, -3.08 1.53, -5.2 1.61, -5.51 0.85, -3.05 5.61, -16.83 7.7, -23.33 4.03, -12.54 6.23, -23.2 7.95, -31.57 0.31, -1.53 1.06, -5.19 1.91, -9.96 1.27, -7.1 2.56, -15.43 3.64, -24.97 3.03, -26.51 2.53, -44.96 2.46, -46.86 - 0.09, -2.34 - 0.2, -5.22 - 0.2, -5.22 - 0.11, -2.81 - 0.21, -5.03 - 0.24, -5.6 - 0.03, -0.64 - 0.64, -13.88 - 1.9, -23.46 - 0.32, -2.41 - 0.71, -5.13 - 0.71, -5.13 0, 0 - 0.39, -2.67 - 0.77, -5.05 - 1.71, -10.66 - 4.04, -20.67 - 4.04, -20.67 - 2.1, -8.99 - 3.53, -13.09 - 5.14, -20.22 - 0.83, -3.69 - 1.74, -8.31 - 1.99, -9.65 - 0.22, -1.2 - 0.43, -2.4 - 0.43, -2.4 - 0.05, -0.26 - 0.16, -0.9 - 0.29, -1.69 - 0.27, -1.58 - 0.46, -2.82 - 0.64, -3.96 - 0.26, -1.68 - 0.69, -4.43 - 0.86, -5.69 0, 0 - 0.21, -1.55 - 0.31, -2.18 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 - 0.37, -2.68 - 0.58, -4.26 0, 0 - 0.18, -1.36 - 0.35, -2.74 0, 0 0, -0.03 0, -0.03 0, 0 - 0.04, -0.39 - 0.09, -0.76 - 2.18, -15.96 - 2.43, -27.99 - 2.53, -30.44 - 0.32, -7.86 - 0.31, -14.13 - 0.28, -17.3 0, -0.51 0.03, -2.74 0.09, -5.7 0.14, -5.79 0.36, -10.4 0.51, -13.04 0.14, -2.57 0.54, -9.79 1.11, -14.86 0.04, -0.32 0.27, -2.41 0.57, -4.99 0.14, -1.24 0.33, -2.84 0.43, -3.7 0, 0 1.27, -10.86 2.66, -17.81 V 0 C 0, 0 0.16, -0.8 0.32, -1.59 0.3, -1.48 1.24, -5.92 1.48, -7.04 0, 0 0, -0.01 0, -0.01 0.37, -1.75 0.68, -3.12 0.85, -3.92 0, 0 0.96, -4.31 1.47, -6.21 0, 0 0.01, -0.03 0.01, -0.03 0.05, -0.18 0.07, -0.25 0.1, -0.38 0, 0 0.01, -0.03 0.01, -0.03 0.07, -0.26 0.76, -2.83 0.9, -3.37 0.47, -1.77 0.97, -3.9 1.09, -4.4 0.74, -3.1 1.91, -6.79 3.06, -10.31 3.35, -10.23 3.84, -10.6 6.22, -18.24 1.57, -5.04 2.64, -8.96 3, -10.33 0.67, -2.49 1.16, -4.48 1.82, -7.17 0.67, -2.7 1.35, -5.47 2.18, -9.13 0.7, -3.1 1.62, -7.32 2.58, -12.32 0.22, -1.14 0.82, -4.31 1.52, -8.41 0.58, -3.39 0.91, -5.61 1.01, -6.28 0.06, -0.39 0.19, -1.29 0.51, -3.63 0.6, -4.37 0.9, -6.55 1.23, -9.32 0.3, -2.47 0.48, -4.25 0.73, -6.74 0.23, -2.26 0.51, -4.96 0.77, -8.11 0.29, -3.49 0.51, -7.44 0.93, -15.34 0.14, -2.58 0.23, -4.38 0.28, -6.76 0.05, -2.37 0.03, -4.7 0.02, -5.91 0, -0.12 - 0.01, -1.2 - 0.03, -2.42 - 0.15, -7.93 - 0.34, -17.93 - 1.25, -27.71 - 0.12, -1.31 - 0.37, -3.67 - 0.87, -8.4 - 0.1, -0.92 - 0.29, -2.71 - 0.53, -4.45 - 0.15, -1.06 - 0.26, -1.89 - 0.41, -2.87 - 0.43, -2.87 - 0.97, -5.93 - 1.1, -6.77 - 0.77, -4.76 - 1.98, -10.73 - 2.94, -15.16 - 1.18, -5.4 - 3.04, -12.28 - 3.68, -14.33"
  // pages[0].drawSvgPath(svgPath, {
  //   y: 0,
  //   x: 0,
  //   color: rgb(1.0, 0, 0),
  // })

  // if (TIPO_BASE == '2') {
  //   pages[0].drawImage(image1, {
  //     y: 390,
  //     x: 36,
  //     height: 149,
  //     width: 55,
  //   })
  // }

  /// SEGUNDA PAGINA

  pages[1].drawText(TAG.toUpperCase().replace("\n", "").trim(), {
    y: 708,
    x: 160,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(ISSUE.toUpperCase().replace("\n", "").trim(), {
    y: 710,
    x: 435,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(EXP.toUpperCase().replace("\n", "").trim(), {
    y: 694,
    x: 435,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  let init = 665

  pages[1].drawText(ISSUE.toUpperCase().replace("\n", "").trim(), {
    y: init,
    x: 160,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })


  pages[1].drawText(VIN.toUpperCase().replace("\n", "").trim(), {
    y: init - 16 * 1,
    x: 160,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(YEAR.toUpperCase().replace("\n", "").trim(), {
    y: init - 16 * 2,
    x: 160,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(MAKE.toUpperCase().replace("\n", "").trim(), {
    y: init - 16 * 3,
    x: 160,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(COLOR.toUpperCase().replace("\n", "").trim(), {
    y: init - 16 * 4,
    x: 160,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  // body model minor
  let init1 = 640
  pages[1].drawText(BODY.toUpperCase().replace("\n", "").trim(), {
    y: init1,
    x: 435,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(MODEL.toUpperCase().replace("\n", "").trim(), {
    y: init1 - 16,
    x: 435,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(MINOR.toUpperCase().replace("\n", "").trim(), {
    y: init1 - 32,
    x: 435,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  init1 = 565
  pages[1].drawText(DEALER.toUpperCase().replace("\n", "").trim(), {
    y: init1,
    x: 307,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })

  pages[1].drawText(DEALER_NUMBER.toUpperCase().replace("\n", "").trim(), {
    y: init1 - 16,
    x: 307,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })



  init1 = 505
  pages[1].drawText(NAME.toUpperCase().replace("Ñ", "N").replace("\n", "").trim().replace("\n", ""), {
    y: init1,
    x: 307,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  })


  DIRECCION.replace("\n", "").split("|").map(
    (line, index) => {
      pages[1].drawText(line.toUpperCase().replace("\n", "").trim(), {
        y: init1 - (16 * (index + 1)),
        x: 307,
        size: 10,
        font: font,
        color: rgb(0, 0, 0),
      })
    }
  )



  // /// TERCERA PAGINA
  // pages[2].drawText(TAG.toUpperCase().replace("\n", "").trim(), {
  //   y: 708,
  //   x: 160,
  //   size: 10,
  //   font: font,
  //   color: rgb(0, 0, 0),
  // })

  // pages[2].drawText(ISSUE.toUpperCase().replace("\n", "").trim(), {
  //   y: 712,
  //   x: 435,
  //   size: 10,
  //   font: font,
  //   color: rgb(0, 0, 0),
  // })

  // pages[2].drawText(EXP.toUpperCase().replace("\n", "").trim(), {
  //   y: 694,
  //   x: 435,
  //   size: 10,
  //   font: font,
  //   color: rgb(0, 0, 0),
  // })

  // init = 672

  // pages[2].drawText(ISSUE.toUpperCase().replace("\n", "").trim(), {
  //   y: init,
  //   x: 160,
  //   size: 10,
  //   font: font,
  //   color: rgb(0, 0, 0),
  // })


  // pages[2].drawText(VIN.toUpperCase().replace("\n", "").trim(), {
  //   y: init - 16 * 1,
  //   x: 160,
  //   size: 10,
  //   font: font,
  //   color: rgb(0, 0, 0),
  // })

  // pages[2].drawText(YEAR.toUpperCase().replace("\n", "").trim(), {
  //   y: init - 16 * 2,
  //   x: 160,
  //   size: 10,
  //   font: font,
  //   color: rgb(0, 0, 0),
  // })

  // pages[2].drawText(MAKE.toUpperCase().replace("\n", "").trim(), {
  //   y: init - 16 * 3,
  //   x: 160,
  //   size: 10,
  //   font: font,
  //   color: rgb(0, 0, 0),
  // })

  // pages[2].drawText(COLOR.toUpperCase().replace("\n", "").trim(), {
  //   y: init - 16 * 4,
  //   x: 160,
  //   size: 10,
  //   font: font,
  //   color: rgb(0, 0, 0),
  // })

  // pages[2].drawText(BODY.toUpperCase().replace("\n", "").trim(), {
  //   y: 648,
  //   x: 435,
  //   size: 10,
  //   font: font,
  //   color: rgb(0, 0, 0),
  // })

  // pages[2].drawText(MODEL.toUpperCase().replace("\n", "").trim(), {
  //   y: 648 - 16,
  //   x: 435,
  //   size: 10,
  //   font: font,
  //   color: rgb(0, 0, 0),
  // })
  // pages[2].drawText(MINOR.toUpperCase().replace("\n", "").trim(), {
  //   y: 648 - 32,
  //   x: 435,
  //   size: 10,
  //   font: font,
  //   color: rgb(0, 0, 0),
  // })

  // pages[2].drawText(DEALER.toUpperCase().replace("\n", "").trim(), {
  //   y: 576,
  //   x: 307,
  //   size: 10,
  //   font: font,
  //   color: rgb(0, 0, 0),
  // })

  // pages[2].drawText(DEALER_NUMBER.toUpperCase().replace("\n", "").trim(), {
  //   y: 576 - 16,
  //   x: 307,
  //   size: 10,
  //   font: font,
  //   color: rgb(0, 0, 0),
  // })

  // pages[2].drawText(NAME.toUpperCase().replace("Ñ", "N").replace("\n", "").trim().replace("\n", ""), {
  //   y: 512,
  //   x: 307,
  //   size: 10,
  //   font: font,
  //   color: rgb(0, 0, 0),
  // })


  // DIRECCION.replace("\n", "").split("|").map(
  //   (line, index) => {
  //     pages[2].drawText(line.toUpperCase().replace("\n", "").trim(), {
  //       y: 512 - 16 * (index + 1),
  //       x: 307,
  //       size: 10,
  //       font: font,
  //       color: rgb(0, 0, 0),
  //     })
  //   }
  // )

  const pdfBytes = await pdfDoc.save()

  fs.writeFile('./out/' + OUTPUT + '.pdf', pdfBytes, err => {
    if (err) {
      console.error("error", err)
      let filename = OUTPUT + rand
      fs.writeFile('./out/' + filename + '.pdf', pdfBytes, err => { let syncClone = cmd.runSync(`"C:\\Program Files\\Adobe\\Acrobat DC\\Acrobat\\Acrobat.exe"  "${process.cwd()}\\out\\${filename}.pdf"`) })
      console.log("TERMINO PLACA " + filename)
      let syncClone = cmd.runSync(`"C:\\Program Files\\Adobe\\Acrobat DC\\Acrobat\\Acrobat.exe"  "${process.cwd()}\\out\\${filename}.pdf"`);
      console.log("TERMINO PLACA " + OUTPUT)
    }
    else {
      let syncClone = cmd.runSync(`"C:\\Program Files\\Adobe\\Acrobat DC\\Acrobat\\Acrobat.exe"  "${process.cwd()}\\out\\${OUTPUT}.pdf"`);
      console.log("TERMINO PLACA " + OUTPUT)
    }

  })
  console.log("TERMINO PLACA " + OUTPUT)

}

fillForm(output_name)