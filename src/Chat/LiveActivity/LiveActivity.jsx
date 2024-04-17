import React, { useEffect, useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../Firebase/firebase';
import './LiveActivity.css';
import ServerProfile from '../../Assets/Logo.png';
import Receipt from '../../Assets/Receipt.png';
import BlueMotorcycle from '../../Assets/BlueMotorcycle.png';
import Destination from '../../Assets/Destination.png';
import BlueDestination from '../../Assets/BlueDestination.png';
import Camera from '../../Assets/Camera.png';
import BlueCamera from '../../Assets/BlueCamera.png';
import Confirm from '../../Assets/Confirm.png';
import BlueConfirm from '../../Assets/BlueConfirm.png';
import Line from '../../Assets/Line.png';
import BlueLine from '../../Assets/BlueLine.png';

function LiveActivity({ distance, duration }) {
    const [status, setStatus] = useState(1);
    const [isMinimized, setIsMinimized] = useState(false);
    const PlaceName = 'Wat Phra That Doi Suthep';
    const Delay = 7.5;

    const sendReceiptImage = async () => {
        const serverAccount = {
            uid: 'server',
            name: 'Server',
            avatar: ServerProfile,
        };
        const receiptImageUrl = Receipt;

        try {
            await addDoc(collection(db, 'messages'), {
                text: 'Receipt Image',
                fileURL: receiptImageUrl,
                name: serverAccount.name,
                avatar: serverAccount.avatar,
                createdAt: serverTimestamp(),
                uid: serverAccount.uid,
            });
        } catch (error) {
            console.error('Error sending receipt image:', error);
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setStatus((prevStatus) => (prevStatus % 7) + 1);
        }, Delay * 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (status === 7) {
            sendReceiptImage();
        }
    }, [status]);

    const handleLiveActivityClick = () => {
        setIsMinimized(!isMinimized);
    };

    const renderStatusContent = () => {
        if (isMinimized) {
            return null;
        }

        switch (status) {
            case 1:
                return (
                    <div className="Status">
                        <h3 className="NormalText">Reviewer</h3>
                        <h3 className="BlueText">MATCHED!</h3>
                    </div>
                );
            case 2:
                return (
                    <div className="Status">
                        <h3 className="NormalText">Arriving in</h3>
                        <h3 className="BlueText">{duration} ({distance})</h3>
                    </div>
                );
            case 3:
                return (
                    <div className="Status">
                        <h3 className="BlueText">ARRIVED</h3>
                        <h3 className="NormalText">at the destination</h3>
                    </div>
                );
            case 4:
                return (
                    <div className="Status">
                        <h3 className="BlueText">STARTING</h3>
                        <h3 class="NormalText">the session</h3>
                    </div>
                );
            case 5:
                return (
                    <div className="Status">
                        <h3 className="BlueText">REVIEWING</h3>
                        <h3 className="NormalText">in process</h3>
                    </div>
                );
            case 6:
                return (
                    <div className="Status">
                        <h3 className="NormalText">Review</h3>
                        <h3 className="BlueText">CONFIRMATION</h3>
                    </div>
                );
            case 7:
                return (
                    <div className="Status">
                        <h3 className="BlueText">ENDING</h3>
                        <h3 className="NormalText">the session</h3>
                    </div>
                );
            default:
                return null;
        }
    };

    const renderDescriptionContent = () => {
        if (isMinimized) {
            return null;
        }

        switch (status) {
            case 1:
                return (
                    <div className="Description">
                        <p className="NormalText">Please Wait...</p>
                    </div>
                );
            case 2:
                return (
                    <div className="Description">
                        <p className="NormalText">Heading to {PlaceName}.</p>
                    </div>
                );
            case 3:
                return (
                    <div className="Description">
                        <p className="NormalText">Pending to start the review session.</p>
                    </div>
                );
            case 4:
                return (
                    <div className="Description">
                        <p className="NormalText">Talk to the reviewer using this chat.</p>
                    </div>
                );
            case 5:
                return (
                    <div className="Description">
                        <p className="NormalText">Please provide more details if necessary.</p>
                    </div>
                );
            case 6:
                return (
                    <div className="Description">
                        <p className="NormalText">Please confirm completeness of the review.</p>
                    </div>
                );
            case 7:
                return (
                    <div className="Description">
                        <p className="NormalText">Thank you for using ReviewDer!</p>
                    </div>
                );
            default:
                return null;
        }
    };

    // Return icon content based on current state and status
    const renderIconContent = () => {
        switch (status) {
            case 1:
                return (
                    <div className="IconStatus">
                        <img src={BlueMotorcycle} className="BlueMotorcycle" alt="Motorcycle" />
                        <img src={Line} className="DefaultLine" alt="Line" />
                        <img src={Destination} className="DefaultDestination" alt="Destination" />
                        <img src={Line} className="DefaultLine" alt="Line" />
                        <img src={Camera} className="DefaultCamera" alt="Camera" />
                        <img src={Line} className="DefaultLine" alt="Line" />
                        <img src={Confirm} className="DefaultConfirm" alt="Confirm" />
                    </div>
                );
            case 2:
                return (
                    <div className="IconStatus">
                        <img src={BlueMotorcycle} className="BlueMotorcycle" alt="Motorcycle" />
                        <img src={BlueLine} className="BlueLine" alt="Line" />
                        <img src={Destination} className="DefaultDestination" alt="Destination" />
                        <img src={Line} className="DefaultLine" alt="Line" />
                        <img src={Camera} className="DefaultCamera" alt="Camera" />
                        <img src={Line} className="DefaultLine" alt="Line" />
                        <img src={Confirm} className="DefaultConfirm" alt="Confirm" />
                    </div>
                );
            case 3:
                return (
                    <div className="IconStatus">
                        <img src={BlueMotorcycle} className="BlueMotorcycle" alt="Motorcycle" />
                        <img src={BlueLine} className="BlueLine" alt="Line" />
                        <img src={BlueDestination} className="BlueDestination" alt="Destination" />
                        <img src={Line} className="DefaultLine" alt="Line" />
                        <img src={Camera} className="DefaultCamera" alt="Camera" />
                        <img src={Line} className="DefaultLine" alt="Line" />
                        <img src={Confirm} className="DefaultConfirm" alt="Confirm" />
                    </div>
                );
            case 4:
                return (
                    <div className="IconStatus">
                        <img src={BlueMotorcycle} className="BlueMotorcycle" alt="Motorcycle" />
                        <img src={BlueLine} className="BlueLine" alt="Line" />
                        <img src={BlueDestination} className="BlueDestination" alt="Destination" />
                        <img src={BlueLine} className="BlueLine" alt="Line" />
                        <img src={Camera} className="DefaultCamera" alt="Camera" />
                        <img src={Line} className="DefaultLine" alt="Line" />
                        <img src={Confirm} className="DefaultConfirm" alt="Confirm" />
                    </div>
                );
            case 5:
                return (
                    <div className="IconStatus">
                        <img src={BlueMotorcycle} className="BlueMotorcycle" alt="Motorcycle" />
                        <img src={BlueLine} className="BlueLine" alt="Line" />
                        <img src={BlueDestination} className="BlueDestination" alt="Destination" />
                        <img src={BlueLine} className="BlueLine" alt="Line" />
                        <img src={BlueCamera} className="BlueCamera" alt="Camera" />
                        <img src={Line} className="DefaultLine" alt="Line" />
                        <img src={Confirm} className="DefaultConfirm" alt="Confirm" />
                    </div>
                );
            case 6:
                return (
                    <div className="IconStatus">
                        <img src={BlueMotorcycle} className="BlueMotorcycle" alt="Motorcycle" />
                        <img src={BlueLine} className="BlueLine" alt="Line" />
                        <img src={BlueDestination} className="BlueDestination" alt="Destination" />
                        <img src={BlueLine} className="BlueLine" alt="Line" />
                        <img src={BlueCamera} className="BlueCamera" alt="Camera" />
                        <img src={BlueLine} className="BlueLine" alt="Line" />
                        <img src={Confirm} className="DefaultConfirm" alt="Confirm" />
                    </div>
                );
            case 7:
                return (
                    <div className="IconStatus">
                        <img src={BlueMotorcycle} className="BlueMotorcycle" alt="Motorcycle" />
                        <img src={BlueLine} className="BlueLine" alt="Line" />
                        <img src={BlueDestination} className="BlueDestination" alt="Destination" />
                        <img src={BlueLine} className="BlueLine" alt="Line" />
                        <img src={BlueCamera} className="BlueCamera" alt="Camera" />
                        <img src={BlueLine} className="BlueLine" alt="Line" />
                        <img src={BlueConfirm} className="BlueConfirm" alt="Confirm" />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div
            className={`ReviewerStatus ${isMinimized ? 'minimized' : 'maximized'}`}
            onClick={handleLiveActivityClick}
        >
            {renderStatusContent()}
            {renderDescriptionContent()}
            {renderIconContent()}
        </div>
    );
}

export default LiveActivity;