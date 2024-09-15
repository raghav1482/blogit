import React, { useState } from 'react';
import './settings.css';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

const SettingsPage = ({ posts, handleEdit, handleDelete, user }) => {
  const [emailInput, setEmail] = useState(user?.email);
  const [username, setUsername] = useState(user?.name);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [activeSection, setActiveSection] = useState('Basic Info');
  const [editingPost, setEditingPost] = useState(null);
  const [postContent, setPostContent] = useState('');

  // Edit modes for individual sections
  const [isEditingBasicInfo, setIsEditingBasicInfo] = useState(false);
  const [isEditingEmailSettings, setIsEditingEmailSettings] = useState(false);
  const [isEditingNotifications, setIsEditingNotifications] = useState(false);

  const handlePostEdit = (post) => {
    setEditingPost(post);
    setPostContent(post.content);
    setActiveSection('Posts');
  };

  const handleSaveBasicInfo = () => {
    setIsEditingBasicInfo(false);
    toast.success('Basic info saved successfully!');
  };

  const handleSaveEmailSettings = () => {
    setIsEditingEmailSettings(false);
    toast.success('Email settings saved successfully!');
  };

  const handleSaveNotifications = () => {
    setIsEditingNotifications(false);
    toast.success('Notification settings saved successfully!');
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'Basic Info':
        return (
          <div className="settings-section card">
            <div className="profile-pic-container">
              <img src={user?.image} alt="Profile" className="profile-pic" />
            </div>
            <label>
              Email
              <input
                type="text"
                value={emailInput}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditingBasicInfo}
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
            <div style={{ display: 'flex', width: '200px', margin: 'auto', justifyContent: 'center' }}>
              {!isEditingEmailSettings ? (
                <button className="black_btn" onClick={() => setIsEditingEmailSettings(true)}>Edit</button>
              ) : (
                <button className="outline_btn" onClick={handleSaveEmailSettings}>Save</button>
              )}
            </div>
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
            <label>
              Enable notifications
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                disabled={!isEditingNotifications}
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
          <div className="settings-section" style={{overflowY:"scroll"}}>
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
          <h2></h2>
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
