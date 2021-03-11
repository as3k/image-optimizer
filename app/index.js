const fs = require('fs')
const sharp = require('sharp')

const width = parseInt(process.env.IMG_WIDTH)
const quality = parseInt(process.env.IMG_QUALITY)
const forceJpg = process.env.FORCE_JPG
const quiet = process.env.QUIET

const imagesDir = './images/in'
const outputDir = './images/out'
const fileTypes = ['jpg', 'jpeg', 'png']

// check for output dir, if it doesn't exist, create it
// if it does exist, remove all images inside.
if (!fs.existsSync(outputDir)) { 
  fs.mkdirSync(outputDir) 
} else {
  let files = fs.readdirSync(outputDir)
  files.forEach(file => fs.unlink(`${outputDir}/${file}`, (err) => {
    if (err) throw err;
  }))
}



// extract the file extension from the image file provided.
const getFileType = file => { return file.split('.').pop() }

// Optimize Image Function
const optimize = image => {
  // Set image options 
  const imgOptions = { quality, progressive: true, force: false }
  sharp(`${imagesDir}/${image}`)
    .resize({ width })                // resize the image to the width env variable
    .jpeg(imgOptions)                 
    .png(imgOptions)
    .toFile(`${outputDir}/${image}`)  // save the file
    .then(({ size, format }) => {
      if (!quiet) {
        console.log({ format, size, image })
      }
    })  
    .catch(err => console.error(err))
}

const optimizeJpg = image => {
  // Set image options 
  const imgOptions = { quality, progressive: true, force: true }
  sharp(`${imagesDir}/${image}`)
    .resize({ width })                // resize the image to the width env variable
    .jpeg(imgOptions)  
    .toFile(`${outputDir}/${image}`)  // save the file
    .then(({ size, format }) => {
      if (!quiet) {
        console.log({ type: format, size, origin: image })
      }
      fs.chown(`${outputDir}/${image}`, 1000, 1000, (err) => {
        if (err) { console.log( err ) }
      })
    })  
    .catch(err => console.error(err))
}


// get any images that are in the images directory
const images = fs.readdirSync(imagesDir)
let completeCount = 0


// Loop through the images and do the thing!
images.forEach(image => {
  // if file extension is jpg/jpeg
  const ext = getFileType(image)

  // if the filetype isn't allowed alert the user in the console.
  // and on to the next one.
  if (!fileTypes.includes(ext)) {
    console.error(`${image} | filetype is not allowed`)
  } else {
    if (forceJpg) { 
      optimizeJpg(image)
    } else {
      optimize(image)
    }
    completeCount += 1
  }

})

if (completeCount > 0) {
  console.log(`\n\nCompleted ${completeCount} images. \nThey're located in '{imgVolume}/out'.\n\n`)
} else {
  console.log('\n\n\\No images completed.\nCheck your file types ["png", "jpg", "jpeg"] only. \n\n')
}

