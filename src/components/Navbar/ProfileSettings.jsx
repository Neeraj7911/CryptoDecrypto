/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { auth, db, storage } from "../../Firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile, updateEmail } from "firebase/auth";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  FaUser,
  FaPhone,
  FaVenusMars,
  FaIdCard,
  FaBirthdayCake,
  FaEnvelope,
  FaCamera,
} from "react-icons/fa";

const ProfileContainer = styled(motion.div)`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  color: #e94560;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
  color: #e94560;
`;

const Form = styled.form`
  display: grid;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  color: #fff;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #e94560;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  color: #fff;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #e94560;
  }
`;

const Button = styled.button`
  background-color: #e94560;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #d63851;
  }

  &:disabled {
    background-color: #888;
    cursor: not-allowed;
  }
`;

const ProfilePicture = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 1rem;
  border: 3px solid #e94560;
  position: relative;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #e94560;
  color: white;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #d63851;
  }
`;

const ErrorMessage = styled.p`
  color: #ff4757;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

export default function ProfileSettings() {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({
    name: "",
    phoneNumber: "",
    gender: "",
    aadhaarNumber: "",
    age: "",
    email: "",
    profilePicture: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserData(currentUser.uid);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setProfileData({
          name: userData.name || "",
          phoneNumber: userData.phoneNumber || "",
          gender: userData.gender || "",
          aadhaarNumber: userData.aadhaarNumber || "",
          age: userData.age || "",
          email: userData.email || "",
          profilePicture: userData.profilePicture || null,
        });
        setPreviewImage(userData.profilePicture || null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to fetch user data. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData((prevData) => ({ ...prevData, profilePicture: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setError("");
    setLoading(true);

    try {
      const userRef = doc(db, "users", user.uid);
      const updates = { ...profileData };

      if (profileData.name !== user.displayName) {
        await updateProfile(user, { displayName: profileData.name });
      }

      if (profileData.email !== user.email) {
        await updateEmail(user, profileData.email);
      }

      if (profileData.profilePicture instanceof File) {
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(storageRef, profileData.profilePicture);
        const downloadURL = await getDownloadURL(storageRef);
        updates.profilePicture = downloadURL;
        await updateProfile(user, { photoURL: downloadURL });
        setPreviewImage(downloadURL);
      }

      await updateDoc(userRef, updates);
      alert("Profile updated successfully!");
      await fetchUserData(user.uid);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to view your profile settings.</div>;
  }

  return (
    <ProfileContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Title>Profile Settings</Title>
      <Form onSubmit={handleSubmit}>
        <ProfilePicture>
          <ProfileImage
            src={previewImage || user.photoURL || "/placeholder-user.jpg"}
            alt="Profile"
          />
          <FileInputLabel htmlFor="profilePicture">
            <FaCamera />
          </FileInputLabel>
          <FileInput
            type="file"
            id="profilePicture"
            onChange={handleFileChange}
            accept="image/*"
          />
        </ProfilePicture>
        <FormGroup>
          <Label htmlFor="name">
            <FaUser /> Name
          </Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={profileData.name}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="phoneNumber">
            <FaPhone /> Phone Number
          </Label>
          <Input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={profileData.phoneNumber}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="gender">
            <FaVenusMars /> Gender
          </Label>
          <Select
            id="gender"
            name="gender"
            value={profileData.gender}
            onChange={handleInputChange}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Select>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="aadhaarNumber">
            <FaIdCard /> Aadhaar Number
          </Label>
          <Input
            type="text"
            id="aadhaarNumber"
            name="aadhaarNumber"
            value={profileData.aadhaarNumber}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="age">
            <FaBirthdayCake /> Age
          </Label>
          <Input
            type="number"
            id="age"
            name="age"
            value={profileData.age}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="email">
            <FaEnvelope /> Email
          </Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={profileData.email}
            onChange={handleInputChange}
          />
        </FormGroup>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </Button>
      </Form>
    </ProfileContainer>
  );
}
