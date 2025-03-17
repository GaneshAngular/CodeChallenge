import http from 'http'
import {Server} from 'socket.io'
let server=null
let io=null
const user={}
const getSocketServer=async(app)=>{
     server=http.createServer(app)
     io=new Server(server, {
        cors: {
          // origin:"http://localhost:4200",
          origin: "https://codevilla.netlify.app", // Update with your Angular app's URL
          methods: ["GET", "POST","PUT","DELETE"]
        }
      })
      io.on('connection',(socket)=>{
           console.log("New client connected===>",socket.id)
        //   socket.emit('data',"Hello from server")

        socket.on('join',(userId)=>{
            user[userId]=socket.id
            console.log(user[userId])
        })
        socket.on('stream',({userId,stream})=>{
          // console.log("--->",stream)

          const userSocketId=user[userId]
          console.log("User Socket ID",userSocketId)
          if(userSocketId){
            io.to(userSocketId).emit('stream',stream)
          }else{
            console.log("User not found",userId)
          }
         

        })
        // socket.on('data',(value)=>{
        //     console.log('Socket Data',value)
        //   })

      })
       
      
        return {server,io}
}

export {getSocketServer,server,io}