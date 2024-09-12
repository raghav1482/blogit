import React, { useState } from 'react';
import './settings.css';
import toast, { Toaster } from 'react-hot-toast';

const SettingsPage = ({ 
  name, 
  posts, 
  handleEdit, 
  handleDelete,
  email 
}) => {
  const [emailInput, setEmail] = useState(email);
  const [username, setUsername] = useState(name);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [activeSection, setActiveSection] = useState('Basic Info'); // State to track active section
  const [editingPost, setEditingPost] = useState(null);
  const [postContent, setPostContent] = useState('');

  const handleSave = () => {
    // Handle saving settings and post edits here
    toast.success("Success")
  };

  const handlePostEdit = (post) => {
    setEditingPost(post);
    setPostContent(post.content); // Assuming post object has a content field
    setActiveSection('Posts');
  };

  const handlePostSave = async () => {
    if (editingPost) {
      try {
        await fetch(`/api/posts/${editingPost.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...editingPost, content: postContent }),
        });
        alert('Post updated successfully');
        setEditingPost(null);
        setPostContent('');
        // Optionally, refresh posts list or handle updates here
      } catch (error) {
        alert('Failed to update post');
      }
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'Basic Info':
        return (
          <div className="settings-section">
            <h2>Basic Info</h2>
            <label>
              Email
              <input
                type="text"
                value={emailInput}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              Username
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
          </div>
        );
      case 'Email Settings':
        return (
          <div className="settings-section">
            <h2>Email Settings</h2>
            <label>
              Email
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
          </div>
        );
      case 'Search History':
        return (
          <div className="settings-section">
            <h2>Search History</h2>
            <p>Your recent searches will be displayed here.</p>
          </div>
        );
      case 'Notifications':
        return (
          <div className="settings-section">
            <h2>Notifications</h2>
            <label>
              Enable notifications
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={() => setNotificationsEnabled(!notificationsEnabled)}
              />
            </label>
          </div>
        );
      case 'Posts':
        return (
          <div className="settings-section">
            <h2>Your Posts</h2>
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="post-item">
                  {editingPost && editingPost.id === post.id ? (
                    <>
                      <textarea
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                      />
                      <button onClick={handlePostSave}>Save</button>
                      <button onClick={() => setEditingPost(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <h3>{post.title}</h3>
                      <button onClick={() => handlePostEdit(post)}>Edit</button>
                      <button onClick={() => handleDelete(post.id)}>Delete</button>
                    </>
                  )}
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
    <Toaster/>
    <div className="settings-container">
      <div className="sidebar">
        <h2></h2>
        <ul>
          <li onClick={() => setActiveSection('Basic Info')}>Basic Info</li>
          <li onClick={() => setActiveSection('Email Settings')}>Email Settings</li>
          <li onClick={() => setActiveSection('Search History')}>Search History</li>
          <li onClick={() => setActiveSection('Notifications')}>Notifications</li>
          <li onClick={() => setActiveSection('Posts')}>Posts</li>
        </ul>
      </div>
      <div className="main-content">
        <h1>Settings</h1>
        {renderSection()} {/* Renders the active section content */}
        <button className="save-btn" onClick={handleSave}>
          Save Settings
        </button>
      </div>
    </div>
    </>
  );
};

export default SettingsPage;
