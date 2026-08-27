import  dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");


import app from "./src/app.js"
import connectDB from "./src/config/db.js"



connectDB()

app.listen(3000,()=>{
    console.log("server started at port 3000")
})