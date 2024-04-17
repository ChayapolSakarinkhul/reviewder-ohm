import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { ref,onValue } from 'firebase/database'
import { database } from '../../Firebase/firebase';
const App = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_API_KEY,
  });

  const [driverLocation, setDriverLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [directionsFetched, setDirectionsFetched] = useState(false);
  useEffect(() => {
    const driverRef = ref(database, 'drivers/driver1');
  
    const onValueChange = (snapshot) => {
      const location = snapshot.val();
      if (location) {
        setDriverLocation({
          lat: location.latitude,
          lng: location.longitude
        });
      }
    };
  
    const unsubscribe = onValue(driverRef, onValueChange); 
  
    return () => {
      unsubscribe(); 
    };
  }, []);

  useEffect(() => {
    if (isLoaded && driverLocation && !directionsFetched) {
      const fetchDirections = () => {
        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
          {
            origin: driverLocation,
            destination: { lat: 18.7602084, lng: 99.0035027 },
            travelMode: 'DRIVING',
          },
          (result, status) => {
            if (status === 'OK') {
              setDirections(result);
              const route = result.routes[0];
              const leg = route.legs[0];
              setDistance(leg.distance.text);
              setDuration(leg.duration.text);
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
  }, [isLoaded, driverLocation, directionsFetched]);
  

  return isLoaded ? (
    <div>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '80vh' }}
        defaultCenter={driverLocation}
        zoom={15}
      >
        {directions && <DirectionsRenderer directions={directions} />}

        {driverLocation && (
          <Marker
            position={driverLocation}
            icon={{
              url: "https://media.discordapp.net/attachments/598881782594797588/1221382034040291400/101-1015767_map-marker-circle-png.png?ex=6624d4a9&is=66125fa9&hm=8dc9003f704a6b481627423e81767be37867543edb04e219ccafc50502baf208&=&format=webp&quality=lossless&width=462&height=462",
              scaledSize: { width: 60, height: 60 },
              anchor: { x: 30, y: 30 }
            }}
          />
        )}
      </GoogleMap>

      {directions && (
        <div>
          <p>Distance: {distance}</p>
          <p>Duration: {duration}</p>
        </div>
      )}
    </div>
  ) : (
    <div>
      <p>Loading...</p>
    </div>
  );
}

export default App;