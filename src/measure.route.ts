import express = require('express')

const router = express.Router()

const MeasureRoute = router

router.get('/:size(\\d+)', (req, res) => {
  if (req.get('x-openbmclapi-secret') !== process.env.CLUSTER_SECRET) {
    return res.sendStatus(403)
  }
  const size = parseInt(req.params.size, 10)
  if (isNaN(size) || size > 200) return res.sendStatus(400)
  const buffer = Buffer.alloc(1024 * 1024, '0066ccff', 'hex')
  res.set('content-length', (size * 1024 * 1024).toString())
  for (let i = 0; i < size; i++) {
    res.write(buffer)
  }
})

export default MeasureRoute
