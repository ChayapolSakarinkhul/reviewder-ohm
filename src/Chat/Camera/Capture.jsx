import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "../../Firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import Icon from "../../Assets/Camera.png";
import FlipIcon from "../../Assets/Flip.png";
import "./Capture.css";

function Cam({ onDownloadURLChange }) {
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);
    const navigate = useNavigate();
    const [CImageUrl, setCImageUrl] = useState(null);
    const [facingMode, setFacingMode] = useState("user");

    const getMediaStream = async () => {
        try {
            const constraints = { video: { facingMode }, audio: false };
            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Error accessing media devices.", err);
        }
    };

    useEffect(() => {
        getMediaStream();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => {
                    track.stop();
                });
            }
        };
    }, [facingMode]);

    const handleShutterClick = () => {
        if (videoRef.current) {
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0);
            canvas.toBlob((blob) => {
                const pictureRef = ref(storage, `files/${Date.now()}.png`);
                uploadBytes(pictureRef, blob).then((snapshot) => {
                    console.log("Picture uploaded successfully");
                    getDownloadURL(snapshot.ref).then((downloadURL) => {
                        console.log("Download URL:", downloadURL);
                        setCImageUrl(downloadURL);
                        onDownloadURLChange(downloadURL);
                    }).catch((error) => {
                        console.error("Error getting download URL:", error);
                    });
                }).catch((error) => {
                    console.error("Error uploading picture:", error);
                });
            }, "image/png");
            navigate("/chat");
        }
    };

    const handleBackButtonClick = () => {
        navigate("/chat");
    };

    const handleFlipCameraClick = () => {
        setFacingMode((prevFacingMode) => prevFacingMode === "user" ? "environment" : "user");
    };

    return (
        <div>
            <div className="CamHeader">
                <button className="BackButton" onClick={handleBackButtonClick}>Back</button>
                <button className="FlipButton" onClick={handleFlipCameraClick}>
                    <img src={FlipIcon} className="Icon" alt="Flip Camera" />
                </button>
            </div>
            <div className="camera-container">
                <video ref={videoRef} autoPlay playsInline className="camera" />
                <button className="ShutterButton" onClick={handleShutterClick}>
                    <img src={Icon} className="CameraIcon" alt="Camera" />
                </button>
                {CImageUrl && (
                    <div>
                        <p>Preview:</p>
                        <img src={CImageUrl} alt="Captured" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cam;