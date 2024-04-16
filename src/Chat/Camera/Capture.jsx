import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "../../Firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import Icon from "../../Assets/Camera.png";
import "./Capture.css";

function Cam({ onDownloadURLChange }) {
    const videoRef = useRef(null);
    const navigate = useNavigate();
    const [CImageUrl, setCImageUrl] = useState(null);
    const [facingMode] = useState("user");
    
    useEffect(() => {
        const getMediaStream = async () => {
            try {
                const constraints = { video: { facingMode }, audio: false };
                const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                console.error("Error accessing media devices.", err);
            }
        };

        // Fetch the media stream
        getMediaStream();

        // Capture the current reference to videoRef.current
        const videoElement = videoRef.current;

        // Cleanup function: stop the stream when component unmounts
        return () => {
            if (videoElement && videoElement.srcObject) {
                videoElement.srcObject.getTracks().forEach((track) => track.stop());
            }
        };
    }, [facingMode]);

    const handleShutterClick = () => {
        if (videoRef.current) {
            // Create a canvas to capture the image
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0);

            // Convert the canvas to a blob
            canvas.toBlob((blob) => {
                // Create a reference to the picture
                const pictureRef = ref(storage, `files/${Date.now()}.png`);

                // Upload the picture
                uploadBytes(pictureRef, blob)
                    .then((snapshot) => {
                        console.log("Picture uploaded successfully");

                        // Get the download URL of the uploaded picture
                        getDownloadURL(snapshot.ref)
                            .then((downloadURL) => {
                                console.log("Download URL:", downloadURL);
                                setCImageUrl(downloadURL);
                                onDownloadURLChange(downloadURL);
                            })
                            .catch((error) => {
                                console.error("Error getting download URL:", error);
                            });
                    })
                    .catch((error) => {
                        console.error("Error uploading picture:", error);
                    });
            }, "image/png");

            // Navigate to the chat page after capturing the image
            navigate("/chat");
        }
    };

    const handleBackButtonClick = () => {
        navigate("/chat");
    };

    return (
        <div>
            <button className="BackButton" onClick={handleBackButtonClick}>
                Back
            </button>
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