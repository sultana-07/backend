import dontenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dontenv.config({
    path : './env'
})

connectDB()
.then(() => {
  app.listen(process.env.PORT || 8000,() => {
    console.log(`server is running at port : ${process.env.PORT}`);
    
  })
})
.catch((error) => {
  console.log("mongodb connection error",error);
  
})





















/*
(async () => {
    try{
      await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
      app.on("error",(error) => {
        console.log("error in express",error);
        throw error
      })

      app.listen(process.env.PORT,() => {
        console.log(`App is listening on port ${process.env.PORT}`)
      })
    } catch (error) {
        console.error("error : ",error)
    }
})()

*/