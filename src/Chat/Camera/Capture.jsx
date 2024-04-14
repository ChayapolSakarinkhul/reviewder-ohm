import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../Assets/Camera.png";
import "./Capture.css";
import { storage } from "../../Firebase/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

function Cam({ onDownloadURLChange }) {
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);
    const navigate = useNavigate();
    const [CImageUrl,setCImageUrl] = useState(null);

    useEffect(() => {
        if (!stream) {
            const constraints = { video: true, audio: false };
            navigator.mediaDevices.getUserMedia(constraints)
                .then((mediaStream) => {
                    setStream(mediaStream);
                    if (videoRef.current) {
                        videoRef.current.srcObject = mediaStream;
                    }
                })
                .catch((err) => {
                    console.error('Error accessing media devices.', err);
                });
        }
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => {
                    track.stop();
                });
            }
        };
    }, [stream]);
    const handleShutterClick = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0);
            canvas.toBlob((blob) => {
                // Create a reference to the picture
                const pictureRef = ref(storage, `files/${Date.now()}.png`);
                // Upload the picture
                uploadBytes(pictureRef, blob).then((snapshot) => {
                    console.log('Picture uploaded successfully');
                    // Get the download URL of the uploaded picture
                    getDownloadURL(snapshot.ref).then((downloadURL) => {
                        console.log("Download URL:", downloadURL);
                        setCImageUrl(downloadURL); // Store the download URL in state
                        onDownloadURLChange(downloadURL);
                    }).catch((error) => {
                        console.error('Error getting download URL:', error);
                    });
                }).catch((error) => {
                    console.error('Error uploading picture:', error);
                    // Handle errors here
                });
            }, 'image/png');
            navigate("/chat")
        }
    };

    const handleBackButtonClick = () => {
        navigate("/chat"); // Navigate to "/chat" route
    };

    return (
        <div>
            <button className="BackButton" onClick={handleBackButtonClick}> Back </button>
            <div className="camera-container">
                <video ref={videoRef} autoPlay playsInline className="camera" />
                <button className="ShutterButton" onClick={handleShutterClick}>
                    <img src={Icon} className="Icon" alt="Camera" />
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