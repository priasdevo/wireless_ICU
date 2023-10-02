import { exec } from 'child_process'
import fs from 'fs'

export const compileVideo = (images: any[], FRAME_RATE: number) => {
  // Assuming images are in some format that can be written to disk (like base64)
  const imageFolder = './temp_images'
  if (!fs.existsSync(imageFolder)) {
    fs.mkdirSync(imageFolder)
  }

  // Write images to disk
  images.forEach((img, index) => {
    console.log(index)
    fs.writeFileSync(`${imageFolder}/img_${index}.jpg`, img, 'base64')
  })

  // Use ffmpeg to stitch images into a video
  const videoName = `./video/video_${Date.now()}.mp4`
  exec(
    `ffmpeg -framerate ${FRAME_RATE} -i ${imageFolder}/img_%d.jpg -c:v libx264 -pix_fmt yuv420p ${videoName}`,
    (error) => {
      if (error) {
        console.error(`Error compiling video: ${error}`)
      } else {
        console.log(`Video compiled: ${videoName}`)
        // Cleanup images from disk
        for (let i = 0; i < images.length; i++) {
          //fs.unlinkSync(`${imageFolder}/img_${i}.jpg`)
        }
      }
    },
  )
  return videoName
}
