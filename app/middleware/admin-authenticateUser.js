const jwt = require('jsonwebtoken')

const admin_authenticateUser = (req, res, next) => {
    // console.log(req.headers)
    const body = req.body
    const token = req.headers.authorization
    if(token) {
        let tokenData 
        try {
            tokenData = jwt.verify(token, 'dct@123')
            req.userId = tokenData.id 
            if( tokenData.admincode ){
                next()
            } else {
                res.send(' you dont have admin rights')
            }
        } catch(e) {
            res.status('401').json({ error: e.message })
        }
        
    } else {
        res.status('401').json({ error: 'token not provided'})
    }
   
}

module.exports = {
    admin_authenticateUser
}