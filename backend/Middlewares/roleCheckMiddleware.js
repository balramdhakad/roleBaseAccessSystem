const roleCheck = (...expectedRole) => {
    return (req,res,next) => {
        if(!req.user){
            return res.status(401).json({message : "Login First , error"})
        }

        console.log(expectedRole)
        console.log(req.user.role)
        console.log(expectedRole.includes(req.user.role))

        if((expectedRole.includes(req.user.role))){
            next()
            return
        }  
        return res.status(401).json({message : "Access Denied , here"})
    }
}

module.exports = roleCheck