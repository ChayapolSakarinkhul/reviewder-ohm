import React, { useState } from 'react';
import Chat from './Chat/MainChat/Chat.jsx';
import Signin from './SignIn/SignIn.jsx';
import UserMap from './Status/UserMap/UserMap.jsx'
import ReviewerMap from './Status/ReviewerMap/ReviewerMap.jsx';
import Status from './Status/MainStatus/Status.jsx';
import Cam from './Chat/Camera/Capture.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
    const [downloadURL, setDownloadURL] = useState(null);

    const clearDownloadURL = () => {
        setDownloadURL(null);
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Signin />} />
                <Route path="/reviewermap" element={<ReviewerMap />} />
                <Route path="/usermap" element={<UserMap />} />
                <Route path="/status" status element={<Status />}/>
                <Route path="/chat" element={<Chat downloadURL={downloadURL} clearDownloadURL={clearDownloadURL} />} />
                <Route path='/chat/capture' element={<Cam onDownloadURLChange={setDownloadURL} />} />
            </Routes>
        </Router>
    );
}

export default App;
