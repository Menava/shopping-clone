exports.login=(req,res,next)=>{
  req.session.isloggedin=true
  res.send(req.session.sessionID)
}