import {jwtDecode} from 'jwt-decode'

const getUser=async(token)=>{
    try {
        const decodedToken=jwtDecode(token)
        return decodedToken
    } catch (error) {
        console.error(error)
        return null
    }
}


export{
    getUser
}