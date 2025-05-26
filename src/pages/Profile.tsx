import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Upload, Lock, Mail, User, Shield, Save } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, setUser } = useContext(UserContext);
  const [profileImage, setProfileImage] = useState<string>(user.avatar);
  const [editMode, setEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    phone: '+254 712 345 678',
    department: 'Administration',
    joinDate: '2021-05-15'
  });
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSaveProfile = () => {
    // Update context with new values
    setUser({
      ...user,
      name: userInfo.name,
      email: userInfo.email,
      avatar: profileImage,
      role: userInfo.role
    });
    
    // In a real app, you would save these changes to your backend
    console.log('Profile updated:', {
      ...userInfo,
      avatar: profileImage
    });
    
    setEditMode(false);
  };
  
  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          
          {editMode ? (
            <button 
              onClick={handleSaveProfile}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 flex items-center"
            >
              <Save size={18} className="mr-2" />
              Save Changes
            </button>
          ) : (
            <button 
              onClick={() => setEditMode(true)}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
            >
              Edit Profile
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-200">
              <img 
                src={profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {editMode && (
              <label className="cursor-pointer bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md transition duration-200 flex items-center">
                <Upload size={18} className="mr-2" />
                Change Photo
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange}
                />
              </label>
            )}
            
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-gray-600">{user.role}</p>
            </div>
          </div>
          
          {/* Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-lg font-medium text-gray-800 border-b pb-2">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                {editMode ? (
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                      <User size={16} />
                    </span>
                    <input
                      type="text"
                      value={userInfo.name}
                      onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                      className="block w-full rounded-none rounded-r-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                    />
                  </div>
                ) : (
                  <p className="text-gray-900">{userInfo.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                {editMode ? (
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                      <Mail size={16} />
                    </span>
                    <input
                      type="email"
                      value={userInfo.email}
                      onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                      className="block w-full rounded-none rounded-r-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                    />
                  </div>
                ) : (
                  <p className="text-gray-900">{userInfo.email}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                {editMode ? (
                  <input
                    type="tel"
                    value={userInfo.phone}
                    onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                    className="block w-full rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  />
                ) : (
                  <p className="text-gray-900">{userInfo.phone}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                {editMode ? (
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                      <Shield size={16} />
                    </span>
                    <select
                      value={userInfo.role}
                      onChange={(e) => setUserInfo({...userInfo, role: e.target.value})}
                      className="block w-full rounded-none rounded-r-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                    >
                      <option value="Administrator">Administrator</option>
                      <option value="Manager">Manager</option>
                      <option value="Supervisor">Supervisor</option>
                    </select>
                  </div>
                ) : (
                  <p className="text-gray-900">{userInfo.role}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={userInfo.department}
                    onChange={(e) => setUserInfo({...userInfo, department: e.target.value})}
                    className="block w-full rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  />
                ) : (
                  <p className="text-gray-900">{userInfo.department}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Join Date
                </label>
                <p className="text-gray-900">{userInfo.joinDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Security Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-medium text-gray-800 border-b pb-2 mb-6">Security Settings</h2>
        
        <div className="max-w-md">
          <form className="space-y-6">
            <div>
              <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  id="current-password"
                  placeholder="••••••••"
                  className="block w-full rounded-none rounded-r-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  id="new-password"
                  placeholder="••••••••"
                  className="block w-full rounded-none rounded-r-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  id="confirm-password"
                  placeholder="••••••••"
                  className="block w-full rounded-none rounded-r-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div>
              <button
                type="button"
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Account Preferences */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-medium text-gray-800 border-b pb-2 mb-6">Preferences</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
              <p className="text-sm text-gray-500">Receive email updates about system events</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={true} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">SMS Notifications</h3>
              <p className="text-sm text-gray-500">Receive text message alerts for critical events</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={false} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500">Enhance account security with 2FA</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={true} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;