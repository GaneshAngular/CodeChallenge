import http from 'http'
import {Server} from 'socket.io'
let server=null
let io=null
const getSocketServer=async(app)=>{
     server=http.createServer(app)
     io=new Server(server, {
        cors: {
          // origin:"https://localhost:4200",
          origin: "https://codevilla.netlify.app/", // Update with your Angular app's URL
          methods: ["GET", "POST","PUT","DELETE"]
        }
      })
      
      io.on('data',(value)=>{
          console.log('Socket Data',value)
        })
        return {server,io}
}

export {getSocketServer,server,io}