import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import "./ComplaintsDashboard.css";

const Complaint = ({ email }) => {
  const [complaints, setComplaints] = useState([]);

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
        const complaintData = querySnapshot.docs.map((doc) => doc.data());

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
                  <a href={complaint.cleanImageUrl} target="_blank" rel="noreferrer">
                    View Clean Image
                  </a>
                ) : (
                  "N/A"
                )}
              </td>
              <td>{complaint.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Complaint;
