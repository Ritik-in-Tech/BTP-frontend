import React, { useState } from "react";
import { CaptureFinger, GetMFS100Info } from "../msf100";
import AWS from "aws-sdk";
import { Buffer } from "buffer";
import { registerUser } from "../api";
import "./register.css";

const RegisterUser = () => {
  const [fingerprintImage, setFingerprintImage] = useState(null);
  const [s3Url, setS3Url] = useState(null);
  const [email, setEmail] = useState("");
  const [rollnumber, setRollnumber] = useState("");
  const [password, setPassword] = useState("");
  const s3 = new AWS.S3({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_AWS_REGION,
  });

  const uploadToS3 = async (base64Image) => {
    const params = {
      Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
      Key: `fingerprints/${rollnumber}.png`,
      Body: Buffer.from(
        base64Image.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      ),
      ContentEncoding: "base64",
      ContentType: "image/png",
    };

    try {
      const data = await s3.upload(params).promise();
      console.log("File uploaded successfully. S3 URL:", data.Location);
      setS3Url(data.Location);
      return data.Location;
    } catch (err) {
      console.error("Error uploading file:", err.message);
      return null;
    }
  };

  const checkDeviceConnection = async () => {
    try {
      const response = await GetMFS100Info();
      return response.httpStatus;
    } catch (error) {
      console.error("Failed to connect to the device:", error.message);
      return false;
    }
  };

  const captureFinger = async () => {
    const isConnected = await checkDeviceConnection();
    if (isConnected) {
      const response = await CaptureFinger(60, 10000);
      if (response.httpStatus) {
        const { AnsiTemplate, BitmapData } = response.data;
        let base64Image;

        if (typeof BitmapData === "string") {
          base64Image = `data:image/png;base64,${BitmapData}`;
        } else {
          const binaryString = String.fromCharCode(
            ...new Uint8Array(BitmapData)
          );
          base64Image = `data:image/png;base64,${btoa(binaryString)}`;
        }

        setFingerprintImage(base64Image);
        const s3Url = await uploadToS3(base64Image);

        if (s3Url) {
          await registerUser(email, rollnumber, password, AnsiTemplate, s3Url);
          console.log("Registration successful");
        } else {
          console.error("Capture succeeded, but upload failed.");
        }
      } else {
        console.error("Capture failed:", response.err);
      }
    } else {
      console.error("Cannot capture fingerprint; device not connected.");
    }
  };

  const handleRegister = async () => {
    await captureFinger();
  };

  return (
    <div className="RegisterUser">
      <h2>Register User</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Roll Number"
        value={rollnumber}
        onChange={(e) => setRollnumber(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
      {fingerprintImage && (
        <div>
          <h3>Fingerprint Image:</h3>
          <img src={fingerprintImage} alt="Fingerprint" />
        </div>
      )}
    </div>
  );
};

export default RegisterUser;
