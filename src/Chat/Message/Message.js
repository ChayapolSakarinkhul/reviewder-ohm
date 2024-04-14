import React, { useState } from "react";
import { auth } from "../../Firebase/firebase";
import { format } from "date-fns";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Message.css";

const FullScreenImageViewer = ({ imageUrl, onClose }) => {
  return (
    <div className="fullscreen-container" onClick={onClose}>
      <div className="fullscreen-image-wrapper">
        <img src={imageUrl} alt="Full screen" className="fullscreen-image" />
      </div>
    </div>
  );
};

const Message = ({ message }) => {
  const [user] = useAuthState(auth);
  const isSentByUser = message.uid === user.uid;
  const formattedTimestamp = message.createdAt ? format(message.createdAt.toDate(), "dd/MM/yy HH:mm") : "";
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);

  const handleImageClick = () => {
    setIsImageFullscreen(true);
  };

  const handleCloseFullscreen = () => {
    setIsImageFullscreen(false);
  };

  return (
    <div className={`chat_bubble ${isSentByUser ? "SentMessage" : "ReceivedMessage"}`}>
      {!isSentByUser && (
        <img
          className="ProfileImage"
          src={message.avatar}
          alt="user avatar"
        />
      )}
      <div className="MessageBubble">
        <h3 className="NameText">{message.name}</h3>
        <h1 className="Timestamp">{formattedTimestamp}</h1>
        {message.fileURL ? (
          <img
            src={message.fileURL}
            alt="file attachment"
            style={{ cursor: "pointer", maxWidth: "200px", maxHeight: "200px" }}
            onClick={handleImageClick}
          />
        ) : (
          <p className="Message">{message.text}</p>
        )}
      </div>
      {isSentByUser && (
        <img
          className="ProfileImage"
          src={message.avatar}
          alt="user avatar"
        />
      )}
      {isImageFullscreen && (
        <FullScreenImageViewer imageUrl={message.fileURL} onClose={handleCloseFullscreen} />
      )}
    </div>
  );
};

export default Message;