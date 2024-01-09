exports.postLogin=(req,res,next)=>{
  req.session.isloggedin=true
  console.log(req.session.id)
  res.send(req.session.id)
}

exports.getLogin=(req,res,next)=>{
  req.session.isloggedin=true
  console.log(req.session.id)
  res.send({msg:'hello'})
}