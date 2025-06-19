import dotenv from 'dotenv'
import connectDB from "./src/db/index.js";
import { app } from './src/app.js';

dotenv.config({path: '.env'})

connectDB()
.then( () => {
    app.listen(process.env.PORT || 5050, () => {
        console.log(`Server is running on http://localhost:${process.env.PORT}`);
    })
    app.get('/test', (req, res) =>{
        res.send('Hello')
    })
})
.catch( err => {
    console.log('Mongodb connection failed', err)
})