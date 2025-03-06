import http from 'http'
import {Server} from 'socket.io'
let server=null
let io=null
const getSocketServer=async(app)=>{
     server=http.createServer(app)
     io=new Server(server, {
        cors: {
          origin: "https://67c9476bf99351d4158dc634--cool-custard-dca155.netlify.app", // Update with your Angular app's URL
          methods: ["GET", "POST","PUT","DELETE"]
        }
      })
      
      io.on('data',(value)=>{
          console.log('Socket Data',value)
        })
        return {server,io}
}

export {getSocketServer,server,io}