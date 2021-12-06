

exports.join = async(req, res, next)=>{
    const user = req.user
    return res.status(200).send({...user, message: "joined"});
}