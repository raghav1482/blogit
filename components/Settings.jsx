import React, { useEffect, useState } from 'react';
import './settings.css';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import axios from 'axios';

const SettingsPage = ({ posts, handleEdit, handleDelete, user }) => {
  const [emailInput, setEmail] = useState(user?.email);
  const [username, setUsername] = useState(user?.name);
  const [about, setAbout] = useState(user?.about); // State for the about section
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [activeSection, setActiveSection] = useState('Basic Info');
  const [editingPost, setEditingPost] = useState(null);
  const [postContent, setPostContent] = useState('');
  const [profilePic, setProfilePic] = useState(user?.image);

  // Edit modes for individual sections
  const [isEditingBasicInfo, setIsEditingBasicInfo] = useState(false);
  const [isEditingEmailSettings, setIsEditingEmailSettings] = useState(false);
  const [isEditingNotifications, setIsEditingNotifications] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.id) {
          const result = await axios.get(`/api/users/${user.id}`);
          setProfilePic(result.data?.image);
          setAbout(result.data?.about); // Fetch the 'about' information from the user data
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchData();
  }, [user?.id]);

  const handlePostEdit = (post) => {
    setEditingPost(post);
    setPostContent(post.content);
    setActiveSection('Posts');
  };

  const deleteOld = async (id) => {
    try {
      await axios.post(`/api/users/${user.id}`, { id });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveBasicInfo = async () => {
    try {
      const result = await axios.put(`/api/users/${user.id}`, {
        email: emailInput,
        username,
        about, // Include the about field when saving
        userId: user.id,
        image: profilePic,
      });
      await deleteOld(profilePic);

      setIsEditingBasicInfo(false);
      toast.success('Basic info saved successfully!');
    } catch (e) {
      setIsEditingBasicInfo(false);
      toast.error(e.response?.data?.message || 'Failed to save basic info.');
      console.log(e);
    }
  };

  const handleSaveEmailSettings = () => {
    setIsEditingEmailSettings(false);
    toast.success('Email settings saved successfully!');
  };

  const handleSaveNotifications = () => {
    setIsEditingNotifications(false);
    toast.success('Notification settings saved successfully!');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'blog_pic'); // Replace with your Cloudinary upload preset
    formData.append('cloud_name', 'dbtis6lsu'); // Replace with your Cloudinary cloud name

    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/dbtis6lsu/image/upload`, formData);
      const imageUrl = res.data.secure_url;
      setProfilePic(imageUrl); // Set the uploaded image URL to the profile pic state
      toast.success('Profile picture updated!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'Basic Info':
        return (
          <div className="settings-section card">
            <div className="profile-pic-container">
              <img src={profilePic} alt="Profile" className="profile-pic" />
              {isEditingBasicInfo && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </>
              )}
            </div>
            <label>
              Email
              <input
                type="text"
                value={emailInput}
                onChange={(e) => setEmail(e.target.value)}
                disabled={true}
              />
            </label>
            <label>
              Username
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={!isEditingBasicInfo}
              />
            </label>
            <label>
              About
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                disabled={!isEditingBasicInfo}
                style={{display:'block',width:'100%',borderWidth:'1px'}}
              />
            </label>
            <div style={{ display: 'flex', width: '200px', margin: 'auto', justifyContent: 'center' }}>
              {!isEditingBasicInfo ? (
                <button className="black_btn" onClick={() => setIsEditingBasicInfo(true)}>Edit</button>
              ) : (
                <button className="outline_btn" onClick={handleSaveBasicInfo}>Save</button>
              )}
            </div>
          </div>
        );
      case 'Email Settings':
        return (
          <div className="settings-section card">
            <label>
              Email
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditingEmailSettings}
              />
            </label>
          </div>
        );
      case 'Search History':
        return (
          <div className="settings-section card">
            <p>Your recent searches will be displayed here.</p>
          </div>
        );
      case 'Notifications':
        return (
          <div className="settings-section card">
            <label style={{ display: 'flex' }}>
              Enable notifications
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                disabled={!isEditingNotifications}
                style={{ width: '30px', marginLeft: '100px' }}
              />
            </label>
            <div style={{ display: 'flex', width: '200px', margin: 'auto', justifyContent: 'center' }}>
              {!isEditingNotifications ? (
                <button className="black_btn" onClick={() => setIsEditingNotifications(true)}>Edit</button>
              ) : (
                <button className="outline_btn" onClick={handleSaveNotifications}>Save</button>
              )}
            </div>
          </div>
        );
      case 'Posts':
        return (
          <div className="settings-section" style={{ overflowY: 'scroll' }}>
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="post-item">
                  <img src={`https://res.cloudinary.com/dbtis6lsu/image/upload/f_auto,q_auto/v1705092727/${post.img}`} alt="Post" />
                  <div>
                    <h3>{post.title}</h3>
                    <Link href={`/post/${post._id}`} className="black_btn" style={{ width: '70px' }}>Read</Link>
                  </div>
                </div>
              ))
            ) : (
              <p>No posts available.</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Toaster />
      <div className="settings-container">
        <div className="sidebar">
          <ul>
            <li onClick={() => setActiveSection('Basic Info')} className={activeSection === 'Basic Info' ? 'active' : ''}>Basic Info</li>
            <li onClick={() => setActiveSection('Email Settings')} className={activeSection === 'Email Settings' ? 'active' : ''}>Email Settings</li>
            <li onClick={() => setActiveSection('Search History')} className={activeSection === 'Search History' ? 'active' : ''}>Search History</li>
            <li onClick={() => setActiveSection('Notifications')} className={activeSection === 'Notifications' ? 'active' : ''}>Notifications</li>
            <li onClick={() => setActiveSection('Posts')} className={activeSection === 'Posts' ? 'active' : ''}>Posts</li>
          </ul>
        </div>
        <div className="main-content">
          <h1>Settings</h1>
          {renderSection()}
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
