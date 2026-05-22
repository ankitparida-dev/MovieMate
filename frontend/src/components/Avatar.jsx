import React, { useState, useEffect, useRef } from 'react';
import CartoonAvatar from './CartoonAvatar';
import styles from './Avatar.module.css';

const Avatar = ({ name, size = 'medium', onAvatarChange }) => {
  const [avatarType, setAvatarType] = useState('initials');
  const [photoAvatar, setPhotoAvatar] = useState(null);
  const [cartoonAvatar, setCartoonAvatar] = useState(null);
  const [showCartoonEditor, setShowCartoonEditor] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const savedPhoto = localStorage.getItem('user_avatar');
    const savedCartoon = localStorage.getItem('cartoon_avatar_svg');
    const savedType = localStorage.getItem('avatar_type');
    
    if (savedPhoto) setPhotoAvatar(savedPhoto);
    if (savedCartoon) setCartoonAvatar(savedCartoon);
    if (savedType) setAvatarType(savedType);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
const handlePhotoUpload = async (event) => {

  const file = event.target.files[0];

  if (!file) return;

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/gif',
    'image/webp'
  ];

  if (!allowedTypes.includes(file.type)) {
    alert('Please upload a valid image file');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert('File size must be less than 5MB');
    return;
  }

  try {

    const user =
      JSON.parse(
        localStorage.getItem('user')
      );

    const formData =
      new FormData();

    formData.append(
      'image',
      file
    );

    formData.append(
      'userId',
      user.id
    );

    const rawApiUrl = import.meta.env.VITE_API_URL;
    const apiBaseUrl = rawApiUrl ? rawApiUrl.replace(/\/$/, '') : 'http://localhost:5000/api';

    const response =
      await fetch(
        `${apiBaseUrl}/auth/upload-profile`,
        {
          method: 'POST',
          body: formData
        }
      );

    const data =
      await response.json();

    if (data.success) {

      setPhotoAvatar(
        data.imageUrl
      );

      setAvatarType(
        'photo'
      );

      localStorage.setItem(
        'user_avatar',
        data.imageUrl
      );

      localStorage.setItem(
        'avatar_type',
        'photo'
      );

      if (onAvatarChange) {
        onAvatarChange(
          data.imageUrl
        );
      }

      alert(
        'Profile photo updated!'
      );

    } else {

      alert(
        data.message ||
        'Upload failed'
      );

    }

  } catch (error) {

    console.error(error);

    alert(
      'Upload failed'
    );

  }

};

  const handleCartoonSave = (svg) => {
    setCartoonAvatar(svg);
    setAvatarType('cartoon');
    localStorage.setItem('cartoon_avatar_svg', svg);
    localStorage.setItem('avatar_type', 'cartoon');
    if (onAvatarChange) onAvatarChange(svg);
    setShowCartoonEditor(false);
    setShowMenu(false);
  };

  const resetToInitials = () => {
    setAvatarType('initials');
    localStorage.setItem('avatar_type', 'initials');
    if (onAvatarChange) onAvatarChange(null);
    setShowMenu(false);
  };

  const getInitials = () => {
    if (!name) return '??';
    const words = name.trim().split(' ');
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const getAvatarColor = () => {
    const colors = ['#2ec4b6', '#ff9f1c', '#e63946', '#4fd1c5', '#ffb347', '#1cecff', '#6c5ce7', '#a29bfe'];
    const index = (name?.length || 0) % colors.length;
    return colors[index];
  };

  const sizeMap = {
    small: { width: 32, height: 32, fontSize: 12, iconSize: 12 },
    medium: { width: 48, height: 48, fontSize: 18, iconSize: 14 },
    large: { width: 80, height: 80, fontSize: 30, iconSize: 18 },
    xlarge: { width: 120, height: 120, fontSize: 48, iconSize: 24 },
  };
  const dimensions = sizeMap[size] || sizeMap.medium;

  const renderAvatar = () => {
    if (avatarType === 'cartoon' && cartoonAvatar) {
      return (
        <div 
          dangerouslySetInnerHTML={{ __html: cartoonAvatar }}
          className={`${styles.avatar} ${styles[size]}`}
          style={{ width: dimensions.width, height: dimensions.height }}
        />
      );
    }
    
    if (avatarType === 'photo' && photoAvatar) {
      return (
        <img
          src={photoAvatar}
          alt="Avatar"
          className={`${styles.avatar} ${styles[size]}`}
          style={{ width: dimensions.width, height: dimensions.height, objectFit: 'cover' }}
        />
      );
    }
    
    return (
      <div
        className={`${styles.avatar} ${styles[size]} ${styles.initialsAvatar}`}
        style={{
          backgroundColor: getAvatarColor(),
          width: dimensions.width,
          height: dimensions.height,
          fontSize: dimensions.fontSize,
        }}
      >
        {getInitials()}
      </div>
    );
  };

  return (
    <div className={styles.avatarContainer} ref={menuRef}>
      <div className={styles.avatarWrapper} onClick={() => setShowMenu(!showMenu)}>
        {renderAvatar()}
        <div className={styles.editBadge}>
          <i className="fas fa-edit" style={{ fontSize: dimensions.iconSize }}></i>
        </div>
      </div>

      {showMenu && (
        <div className={styles.dropdownMenu}>
          <label className={styles.menuItem}>
            <i className="fas fa-camera"></i> Upload Photo
            <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
          </label>
          <button className={styles.menuItem} onClick={() => {
            setShowMenu(false);
            setShowCartoonEditor(true);
          }}>
            <i className="fas fa-paintbrush"></i> Create Cartoon Avatar
          </button>
          <button className={styles.menuItem} onClick={resetToInitials}>
            <i className="fas fa-undo"></i> Reset to Initials
          </button>
        </div>
      )}

      {/* Cartoon Editor - Rendered at body level */}
      {showCartoonEditor && (
        <CartoonAvatar 
          name={name}
          onSave={handleCartoonSave}
          onClose={() => setShowCartoonEditor(false)}
        />
      )}
    </div>
  );
};

export default Avatar;