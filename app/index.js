const sharp = require('sharp')
const progress = require('cli-progress')
const fs = require('fs')

const width = parseInt(process.env.IMG_WIDTH)
const quality = parseInt(process.env.IMG_QUALITY)
const imagesDir = './images/in'
const outputDir = './images/out'

const allowedFiletypes = ['jpg', 'jpeg', 'png']

const bar1 = new progress.SingleBar( {}, progress.Presets.shades_classic )


// check for output dir, if it doesn't exist, create it
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir)
}

const getFileType = file => {
  return file.split('.').pop()
}

const optim = {
  jpeg(image) {
    sharp(`${imagesDir}/${image}`)
      .resize({ width: width })
      .jpeg({ quality: quality })
      .toFile(`${outputDir}/${image}`)
      .then(info => console.log(info))
      .catch(err => console.error(err))
  },
  png(image)  { 
    sharp(`${imagesDir}/${image}`)
      .resize({ width: width })
      .png({ quality: quality })
      .toFile(`${outputDir}/${image}`)
      .then(info => console.log(info))
      .catch(err => console.error(err))
  }
}

// get any images that are in the images directory
const images = fs.readdirSync(imagesDir)
let currentCount = 0
bar1.start(images.length, currentCount)

images.forEach(image => {
  // if file extension is jpg/jpeg
  const ext = getFileType(image)

  if (ext == 'jpg' || ext == 'jpeg') { // if extension is jpg/jpeg
    optim.jpeg(image) 
  } else if (ext == 'png') { // if extension is png
    optim.png(image) 
  } else { 
    console.error(`${image} | filetype is not allowed.`) 
  }

  currentCount ++
  bar1.update(currentCount)

  if (currentCount == images.length) { bar1.stop() }

}) 