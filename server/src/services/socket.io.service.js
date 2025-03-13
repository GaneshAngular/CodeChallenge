import http from 'http'
import {Server} from 'socket.io'
let server=null
let io=null
const getSocketServer=async(app)=>{
     server=http.createServer(app)
     io=new Server(server, {
        cors: {
          // origin:"http://localhost:4200",
          origin: "https://codevilla.netlify.app/", // Update with your Angular app's URL
          methods: ["GET", "POST","PUT","DELETE"]
        }
      })
      io.on('stream',(stream)=>{
        io.emit('stream',stream)
      })
      
      io.on('data',(value)=>{
          console.log('Socket Data',value)
        })
        return {server,io}
}

export {getSocketServer,server,io}