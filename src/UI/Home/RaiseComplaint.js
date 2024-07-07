import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import GoogleMapReact from 'google-map-react';
import './Card.css';
import Loader from '../Loader/Loader'

const AnyReactComponent = ({ text }) => (
  <div className="pin">
    <div className="pin-icon" />
    <div className="pin-text">{text}</div>
  </div>
);

const RaiseComplaint = ({ name, email }) => {
  const [complaint, setComplaint] = useState('');
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [zoom, setZoom] = useState(2);
  const [image, setImage] = useState(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userDetails = {
    name,
    email,
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
          setZoom(15);
        },
        () => {
          console.log('Unable to retrieve your location');
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser');
    }
  }, []);

  const handleComplaintChange = (event) => {
    setComplaint(event.target.value);
  };

  const handleMapClick = (event) => {
    setCenter({ lat: event.lat, lng: event.lng });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true); // Activate the loader
  
      const db = getFirestore();
      const complaintsCollection = collection(db, 'complaints');
      const docRef = await addDoc(complaintsCollection, {
        complaint,
        coordinates: center,
        userDetails,
        status: 'pending', // Set the status field to 'pending'
      });
  
      if (image) {
        const storage = getStorage();
        const imageRef = ref(storage, `complaints/${docRef.id}/${image.name}`);
        await uploadBytes(imageRef, image);
        const imageUrl = await getDownloadURL(imageRef);
        // Update the document with the image URL and status
        await updateDoc(doc(db, 'complaints', docRef.id), { imageUrl, status: 'pending' });
      }
  
      console.log('Document written with ID:', docRef.id);
      // Reset the form fields
      setComplaint('');
      setCenter({ lat: 0, lng: 0 });
      setZoom(2);
      setImage(null);
    } catch (error) {
      console.error('Error adding document:', error);
    } finally {
      setIsLoading(false); // Deactivate the loader
    }
  };
  

  const loadMaps = async () => {
    await new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAcVh4lcGLXGey7WqdTFuSQGCqjRikOYZ0&libraries=places`;
      script.onload = resolve;
      document.body.appendChild(script);
    });
    setMapsLoaded(true);
  };

  useEffect(() => {
    loadMaps();
  }, []);

  return (
    <div className="card">
      <div className="form-container">
        <h3>Raise Complaint</h3>
        <h4>Upload Photo</h4>
        <div className="file-upload-container">
          <label htmlFor="file-upload" className="file-upload-label">
            Choose a file
          </label>
          <input
            type="file"
            id="file-upload"
            onChange={handleImageUpload}
            className="file-upload-input"
          />
        </div>

        <h4>Map Location</h4>
        <div className="map-container">
          {mapsLoaded ? (
            <GoogleMapReact
              bootstrapURLKeys={{ key: 'AIzaSyAcVh4lcGLXGey7WqdTFuSQGCqjRikOYZ0' }}
              defaultCenter={{ lat: 0, lng: 0 }}
              defaultZoom={2}
              center={center}
              zoom={zoom}
              onClick={handleMapClick}
            >
              <AnyReactComponent lat={center.lat} lng={center.lng} text="Your Location" />
            </GoogleMapReact>
          ) : (
            <div>Loading Maps...</div>
          )}
        </div>

        <h4>Complaint Details</h4>
        <div>
          <input type="text" value={complaint} onChange={handleComplaintChange} />
        </div>
        <button onClick={handleSubmit}>Submit</button>

        {isLoading && <Loader />} {/* Display the loader if isLoading is true */}
      </div>
    </div>
  );
};

export default RaiseComplaint;
