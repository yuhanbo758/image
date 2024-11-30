import { createReadStream } from 'fs'
import { join } from 'path'

export default function handler(req, res) {
  const { path } = req.query
  const filePath = join(process.cwd(), 'public', ...path)

  try {
    const stream = createReadStream(filePath)
    stream.pipe(res)
  } catch (error) {
    res.status(404).json({ error: 'File not found' })
  }
}

export const config = {
  api: {
    responseLimit: false,
  },
} 