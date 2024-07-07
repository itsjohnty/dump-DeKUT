import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, getDocs, updateDoc, doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';


const AdminPage = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const db = getFirestore();
        const complaintsCollection = collection(db, 'complaints');
        const q = query(complaintsCollection);

        const querySnapshot = await getDocs(q);
        const fetchedComplaints = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedComplaints.push({
            id: doc.id,
            name: data.userDetails.name,
            email: data.userDetails.email,
            complaint: data.complaint,
            coordinates: data.coordinates,
            imageUrl: data.imageUrl,
            cleanImageUrl: data.cleanImageUrl, // Add cleanImageUrl field
            status: data.status || 'pending',
          });
        });

        setComplaints(fetchedComplaints);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }
    };

    fetchComplaints();
  }, []);

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      const db = getFirestore();
      const complaintRef = doc(db, 'complaints', complaintId);

      if (newStatus === 'completed') {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = async (e) => {
          const file = e.target.files[0];
          if (!file) return;

          try {
            const storage = getStorage();
            const storageRef = ref(storage, `cleanimg/${complaintId}`);
            await uploadBytes(storageRef, file);

            const downloadURL = await getDownloadURL(storageRef);
            await updateDoc(complaintRef, { status: newStatus, cleanImageUrl: downloadURL }); // Update cleanImageUrl field
            setComplaints((prevComplaints) =>
              prevComplaints.map((complaint) =>
                complaint.id === complaintId ? { ...complaint, status: newStatus, cleanImageUrl: downloadURL } : complaint
              )
            );
          } catch (error) {
            console.error('Error uploading image:', error);
          }
        };
        fileInput.click();
      } else {
        await updateDoc(complaintRef, { status: newStatus });
        setComplaints((prevComplaints) =>
          prevComplaints.map((complaint) =>
            complaint.id === complaintId ? { ...complaint, status: newStatus } : complaint
          )
        );
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const viewLocation = (lat, lng) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
  };

  const viewImage = (imageUrl) => {
    window.open(imageUrl, '_blank');
  };

  const viewCleanImage = (cleanImageUrl) => {
    window.open(cleanImageUrl, '_blank');
  };

  return (
    <div>
      <h1>All Complaints</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Complaint</th>
            <th>Coordinates</th>
            <th>Dirty Image</th>
            <th>Clean Image</th> {/* New column for clean image */}
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint) => (
            <tr
              key={complaint.id}
              style={{
                backgroundColor: complaint.status === 'completed' ? '#a5f6a5' : 'transparent',
                color: complaint.status === 'completed' ? 'black' : 'initial',
              }}
            >
              <td>{complaint.name}</td>
              <td>{complaint.email}</td>
              <td>{complaint.complaint}</td>
              <td>
                <button onClick={() => viewLocation(complaint.coordinates.lat, complaint.coordinates.lng)}>
                  View Location
                </button>
              </td>
              <td>
                {complaint.imageUrl && (
                  <button onClick={() => viewImage(complaint.imageUrl)}>Dirty Image</button>
                )}
              </td>
              <td>
                {complaint.status === 'completed' && complaint.cleanImageUrl && (
                  <button onClick={() => viewCleanImage(complaint.cleanImageUrl)}>Clean Image</button>
                )}
              </td>
              <td>
                <select
                  value={complaint.status}
                  onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
