import multer from 'multer'
import path from 'path'

const uploadFolder = path.join(process.cwd(), 'public', 'temp')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

export const upload = multer({ storage: storage })