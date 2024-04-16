import React from 'react';
import { auth } from "../Firebase/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import Reviewer from "./../Assets/Reviewer.jpg";
import Destination from "./../Assets/Destination.png";
import Map from "./../Assets/Map(Maya-Thapae).png";
import SignOut from "./../Assets/Sign-out.png";
import "./Status.css";

import ReviewerStatus from '../Chat/LiveActivity/LiveActivity';

function Status() {
    const navigate = useNavigate();
    const PlaceName = "Tha Phae Walking Street";

    const handleNavigateToChat = () => {
        navigate("/Chat");
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch (error) {
            console.error("Sign-out error:", error);
        }
    };

    return (
        <div className="status-container">
            <div className="upper">
                <img src={Map} className="map" alt="Map" />
                <button className="SignoutButton" onClick={handleSignOut}>
                    <img src={SignOut} className="BackIcon" alt="SignOut" />
                </button>
            </div>
            <div className="lower">
                <div className="ReviewerInfo">
                    <img src={Reviewer} className="LargeProfileImage" alt="Profile" />
                    <div className="VStack">
                        <div className="TextInfo">
                            <h2 className="Text">Tawin Sriprasert</h2>
                        </div>
                        <div className="HStack">
                            <img src={Destination} className="DestinationPin" alt="Destination" />
                            <p className="Text">{PlaceName}</p>
                        </div>
                    </div>
                </div>
                <div className='StatusHolder'>
                    <ReviewerStatus />
                </div>
                <div>
                    <button onClick={handleNavigateToChat} className="ActionButton" type="button">
                        Chat
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Status;