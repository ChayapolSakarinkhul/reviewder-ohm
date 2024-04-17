import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { ref,set } from 'firebase/database';
import { database } from '../../Firebase/firebase';

const App = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_API_KEY,
});

  const [position, setPosition] = useState(null);
  const [directions, setDirections] = useState(null);
  const [directionsFetched, setDirectionsFetched] = useState(false);
  useEffect(() => {
    const options = {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000
    };

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        const driverRef = ref(database, 'drivers/driver1');
        set(driverRef, {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }).then(() => {
          console.log('Driver location updated successfully!');
        }).catch((error) => {
          console.error('Error updating driver location:', error);
        });
      },
      (error) => {
        console.error('Error getting user location:', error.message);
      },
      options
    );


    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  useEffect(() => {
    if (isLoaded && position && !directionsFetched) {
      const fetchDirections = () => {
        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
          {
            origin: position,
            destination: { lat: 18.7602084, lng: 99.0035027 },
            travelMode: 'DRIVING',
          },
          (result, status) => {
            if (status === 'OK') {
              setDirections(result);
              setDirectionsFetched(true);
            } else {
              console.error(`Directions request failed: ${status}`);
            }
          }
        );
      };
  
      fetchDirections(); // Fetch directions initially
  
      const intervalId = setInterval(fetchDirections, 7000); // Fetch directions every 7 seconds
  
      // Clean up interval
      return () => clearInterval(intervalId);
    }
  }, [isLoaded, position, directionsFetched]);

  return isLoaded ? (
    <div>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '80vh' }}
        center={position}
        zoom={15}
      >
        {directions && <DirectionsRenderer directions={directions} />}

        {position && (
          <Marker
            position={position}
            icon={{
              url: "https://media.discordapp.net/attachments/598881782594797588/1221382034040291400/101-1015767_map-marker-circle-png.png?ex=6624d4a9&is=66125fa9&hm=8dc9003f704a6b481627423e81767be37867543edb04e219ccafc50502baf208&=&format=webp&quality=lossless&width=462&height=462",
              scaledSize: { width: 60, height: 60 },
              anchor: { x: 30, y: 30 }
            }}
          />
        )}
      </GoogleMap>
    </div>
  ) : (
    <div>
      <p>Loading...</p>
    </div>
  );
}

export default App;
