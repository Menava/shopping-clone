module.exports=(req,res,next)=>{
  if(req.session.user)
  {
   return next()
  }
  res.status(500).send('You are not authorized')
}