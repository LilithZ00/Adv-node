import express from "express";

export const router = express.Router();

router.get('/', (req, res)=>{
    res.send('Get in index.ts').json;
});
