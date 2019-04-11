import mongoose from 'mongoose'

const authId = (req, res, next)=>{if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  return res.status(400).send({
    Error: 'Bad Request',
    message: 'Invalid Id',
  });
}
next()
}

export {
  authId
}