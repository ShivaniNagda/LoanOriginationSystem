import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from './config/mongodb.js';

import authRouter from './routes/auth.route.js';
import customerRouter from './routes/customer.route.js';
import loansRouter from './routes/loans.route.js';
import officerRouter from './routes/officer.route.js';
import path from "path";



const app = express();
const _dirname = path.resolve();

// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use('/auth', authRouter);
app.use('/customer',customerRouter);
app.use('/loans', loansRouter);
app.use('/officer',officerRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(_dirname,"/frontend/dist")));
    
    app.get(/(.*)/,(req,res)=>{
        console.log("Unhandled route:", req.url); 
        res.sendFile(path.resolve(_dirname,"frontend","dist","index.html"));
    })
}
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
   connectDB();
  console.log(`Server is running on port ${PORT}`);

});

