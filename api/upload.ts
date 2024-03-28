import express from "express";
import path from "path";
import multer from "multer";
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage"

// create router of this API
export const router = express.Router();

// /upload
router.get("/", (req, res) => {
    res.send("Method GET in upload.ts");
});

const firebaseConfig = {
    apiKey: "AIzaSyCrEjJ0EUaGa3f_paXq3cfak9-jL-BeUPo",
    authDomain: "adv-web-2d6c1.firebaseapp.com",
    projectId: "adv-web-2d6c1",
    storageBucket: "adv-web-2d6c1.appspot.com",
    messagingSenderId: "61142738176",
    appId: "1:61142738176:web:05b356135528b60f563fe5",
    measurementId: "G-J6EQBT2YP6"
};

initializeApp(firebaseConfig);
const storage = getStorage();

class FileMiddleware {
    filename = "";
    // create malter object to save file in disk
    public readonly diskLoader = multer({
        // diskStorage = save to be saved
        storage: multer.memoryStorage(),

        limits: {
            fileSize: 67108864, // 64 MByte
        },
    });
}

const fileUpload = new FileMiddleware();

router.post("/", fileUpload.diskLoader.single("file"), async (req, res) => {
    const filename = Math.round(Math.random() * 10000) + ".png";
    const storageRef = ref(storage, "images/" + filename);
    const metdata = {
        contentType: req.file!.mimetype
    }
    // upload to storage
    const snapshot = await uploadBytesResumable(storageRef, req.file!.buffer, metdata);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    res.status(200).json(
        {
            filename: downloadUrl
        }
    );
});