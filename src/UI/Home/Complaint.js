import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./ComplaintsDashboard.css";

const Complaint = ({ email }) => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [cleanImage, setCleanImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const auth = getAuth();
        const db = getFirestore();

        // Fetch complaints collection based on matching email
        const q = query(
          collection(db, "complaints"),
          where("userDetails.email", "==", email)
        );
        const querySnapshot = await getDocs(q);
        const complaintData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setComplaints(complaintData);
      } catch (error) {
        console.error("Error fetching complaints: ", error);
      }
    };

    fetchComplaints();
  }, [email]);

  const getStatusColor = (status) => {
    if (status === "pending") {
      return "#e4ffbd";
    } else {
      return "#b3ebb5";
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setCleanImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (cleanImage && selectedComplaint) {
      try {
        setIsLoading(true); // Activate the loader

        const db = getFirestore();
        const storage = getStorage();
        const imageRef = ref(
          storage,
          `complaints/${selectedComplaint.id}/${cleanImage.name}`
        );
        await uploadBytes(imageRef, cleanImage);
        const cleanImageUrl = await getDownloadURL(imageRef);

        // Update the document with the clean image URL and status
        await updateDoc(doc(db, "complaints", selectedComplaint.id), {
          cleanImageUrl,
          status: "completed",
        });

        setComplaints((prevComplaints) =>
          prevComplaints.map((complaint) =>
            complaint.id === selectedComplaint.id
              ? { ...complaint, status: "completed", cleanImageUrl }
              : complaint
          )
        );

        setSelectedComplaint(null);
        setCleanImage(null);
      } catch (error) {
        console.error("Error updating complaint: ", error);
      } finally {
        setIsLoading(false); // Deactivate the loader
      }
    }
  };

  return (
    <div>
      <h2>Complaint Details</h2>
      <p>Email: {email}</p>
      <table>
        <thead>
          <tr>
            <th>Complaint</th>
            <th>Coordinates</th>
            <th>Dirty Image</th>
            <th>Clean Image</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint, index) => (
            <tr
              key={index}
              style={{ background: getStatusColor(complaint.status) }}
            >
              <td>{complaint.complaint}</td>
              <td>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${complaint.coordinates.lat},${complaint.coordinates.lng}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View on Google Maps
                </a>
              </td>
              <td>
                <a href={complaint.imageUrl} target="_blank" rel="noreferrer">
                  View Dirty Image
                </a>
              </td>
              <td>
                {complaint.status === "completed" ? (
                  <a
                    href={complaint.cleanImageUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Clean Image
                  </a>
                ) : (
                  "N/A"
                )}
              </td>
              <td>{complaint.status}</td>
              <td>
                {complaint.status === "pending" && (
                  <button onClick={() => setSelectedComplaint(complaint)}>
                    Completed
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedComplaint && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setSelectedComplaint(null)}>
              &times;
            </span>
            <h2>Upload Clean Image</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            {isLoading && <div>Loading...</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Complaint;
