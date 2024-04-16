import React, { useState, useRef, useEffect } from "react";
import { query, orderBy, onSnapshot, limit, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../../Firebase/firebase";
import { useNavigate } from "react-router-dom";

import Message from "../Message/Message";
import ReviewerStatus from "../LiveActivity/LiveActivity";
import "./Chat.css";

import Destination from "../../Assets/Destination.png";
import Camera from "../../Assets/Camera.png";
import Clip from "../../Assets/Clip.png";
import Send from "../../Assets/Send.png";
import SignOut from "../../Assets/Sign-out.png";
import Reviewer from "../../Assets/Reviewer.jpg";

function Chat({ downloadURL, clearDownloadURL }) {
    const [messages, setMessages] = useState([]);
    const scroll = useRef();
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();
    const [showFileUploader, setShowFileUploader] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const PlaceName = "Tha Phae Walking Street";

    // Firebase setup and message fetching useEffect
    useEffect(() => {
        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"), limit(50));
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            const fetchedMessages = [];
            QuerySnapshot.forEach((doc) => {
                fetchedMessages.push({ ...doc.data(), id: doc.id });
            });
            const sortedMessages = fetchedMessages.sort((a, b) => a.createdAt - b.createdAt);
            setMessages(sortedMessages);
        });
        return () => unsubscribe();
    }, []);

    // Navigation useEffect
    useEffect(() => {
        navigate("/chat");
    }, [navigate]);

    // Scroll to bottom when messages update
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Function to scroll to the bottom of the chat
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    // Handle file input change
    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    // Navigate back to the previous route
    const handleBack = () => {
        navigate("/status");
    };

    // Handle camera button click
    const handleCameraButtonClick = () => {
        navigate("/chat/capture");
    };

    // Send a message
    const send = async (event) => {
        event.preventDefault();
        const { uid, displayName, photoURL } = auth.currentUser;

        if (!message.trim() && !selectedFile && !downloadURL) {
            alert("Enter a valid message or select a file to send");
            return;
        }

        let fileURL = null;

        if (selectedFile) {
            try {
                const storageRef = ref(storage, `files/${selectedFile.name}`);
                const fileSnapshot = await uploadBytesResumable(storageRef, selectedFile);
                console.log("Uploaded file:", fileSnapshot);
                fileURL = await getDownloadURL(fileSnapshot.ref);
            } catch (error) {
                console.error("Error uploading file:", error);
                return;
            }
        } else if (downloadURL) {
            fileURL = downloadURL;
            clearDownloadURL();
        }

        try {
            await addDoc(collection(db, "messages"), {
                text: message,
                fileURL: fileURL,
                name: displayName,
                avatar: photoURL,
                createdAt: serverTimestamp(),
                uid,
            });
        } catch (error) {
            console.error("Error adding message to Firestore:", error);
            return;
        }

        setMessage("");
        setSelectedFile(null);
        scrollToBottom();
    };

    // Toggle file uploader visibility
    const toggleFileUploader = () => {
        setShowFileUploader((prev) => !prev);
    };

    return (
        <div>
            {/* Header */}
            <div className="Header">
                <button onClick={handleBack} className="Button" type="button">
                    <img src={SignOut} className="Icon" alt="SignOut" />
                </button>
                <div className="ChatInfo">
                    <img src={Reviewer} className="LargeProfileImage" alt="Profile" />
                    <div className="VStack">
                        <div className="TextInfo">
                            <h3 className="Text"> Tawin Sriprasert </h3>
                        </div>
                        <div className="InLine">
                            <img src={Destination} className="DestinationPin" alt="Destination" />
                            <p className="DestinationText"> {PlaceName} </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviewer Status */}
            <ReviewerStatus PlaceName={PlaceName} />

            {/* Chat body */}
            <div className="Body">
                <main className="chat-box">
                    {/* Messages */}
                    {messages?.map((message) => (
                        <Message key={message.id} message={message} />
                    ))}
                    <span ref={scroll}></span>
                    <div ref={messagesEndRef}></div>
                </main>
            </div>

            {/* Footer */}
            <div className="Footer">
                <button className="Button" onClick={toggleFileUploader}>
                    <img src={Clip} className="Icon" alt="Clip" />
                </button>

                {/* File uploader */}
                {showFileUploader && (
                    <input type="file" onChange={handleFileInputChange} accept="image/*, video/*" />
                )}

                {/* Camera button */}
                <button className="Button" onClick={handleCameraButtonClick}>
                    <img src={Camera} className="Icon" alt="Camera" />
                </button>

                {/* Message form */}
                <form onSubmit={(event) => send(event)} className="InputField">
                    <label htmlFor="messageInput" hidden>
                        Enter Message
                    </label>
                    <input
                        id="messageInput"
                        name="messageInput"
                        type="text"
                        className="InputBox"
                        placeholder="Type your message here"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button className="Button" type="submit">
                        <img src={Send} className="Icon" alt="Send" />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Chat;