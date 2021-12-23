import express = require('express')

const router = express.Router()

const MeasureRoute = router

router.get('/:size(\\d+)', (req, res) => {
  if (req.get('x-openbmclapi-secret') !== process.env.CLUSTER_SECRET) {
    return res.sendStatus(403)
  }
  const size = parseInt(req.params.size, 10)
  if (isNaN(size) || size > 200) return res.sendStatus(400)
  const buffer = Buffer.allocUnsafe(size * 1024 * 1024)
  res.send(buffer)
})

export default MeasureRoute
