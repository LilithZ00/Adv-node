import express from "express";
import path from "path";
import multer from "multer";
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

export const router = express.Router();

//ขึ้นไฟล์เบส
 const firebaseConfig = {
  apiKey: "AIzaSyCw4ID4d_Y0DtImZLph5vFAUVLnr5Df4HQ",
  authDomain: "adv-web-37463.firebaseapp.com",
  projectId: "adv-web-37463",
  storageBucket: "adv-web-37463.appspot.com",
  messagingSenderId: "731879842400",
  appId: "1:731879842400:web:a4458393e0cc55af639905",
  measurementId: "G-K2H9XV7QMX"
};


  initializeApp(firebaseConfig);


  const storage = getStorage();

  class FileMiddleware {
    filename = "";
    public readonly diskLoader = multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 67108864, // 64 MByte
      },
    });
  }

  const fieldUpload =new FileMiddleware();

  router.post("/", fieldUpload.diskLoader.single("file"), async (req, res)=>{
    const filename = + Math.round(Math.random() * 10000) + "png";
    const storageRef = ref(storage, "images/" + filename);
    const metadata = {contentType : req.file!.mimetype}
    // upload to storage
    const snapshot = await uploadBytesResumable(storageRef, req.file!.buffer, metadata);

    const downloadUrl = await getDownloadURL(snapshot.ref);
    res.status(200).json(
        {
            filename: downloadUrl
        }
    );
});