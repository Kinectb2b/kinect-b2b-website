import { useState } from 'react';

export default function ProfileModal({ isOpen, onClose, profileData, currentUser, supabase, onUpdate }) {
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(false);
  const [photoPosition, setPhotoPosition] = useState(
    profileData?.profile_picture_position || { x: 50, y: 50 }
  );
  const [isDragging, setIsDragging] = useState(false);

  const updateProfileData = async (updates) => {
    try {
      const { data, error } = await supabase
        .from('sales_reps')
        .upsert(
          {
            username: currentUser.username,
            ...updates
          },
          { 
            onConflict: 'username',
            ignoreDuplicates: false 
          }
        )
        .select()
        .single();

      if (error) throw error;

      onUpdate(data);
      setEditingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const uploadProfilePicture = async (file) => {
    try {
      // Convert to base64 like affiliate page - NO Supabase Storage!
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        
        // Save directly to database
        await updateProfileData({ 
          profile_picture_url: base64String,
          profile_picture_position: photoPosition 
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading picture:', error);
      alert('Failed to upload picture');
    }
  };

  const updatePhotoPosition = async (position) => {
    try {
      await updateProfileData({ profile_picture_position: position });
    } catch (error) {
      console.error('Error updating photo position:', error);
    }
  };

  const handlePhotoMouseMove = (e) => {
    if (!isDragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPhotoPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y))
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex justify-between items-center rounded-t-2xl">
          <h3 className="text-2xl font-black">Profile</h3>
          <button
            onClick={onClose}
            className="text-3xl hover:bg-white/20 w-10 h-10 rounded-full transition"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* Profile Picture Section */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              {profileData?.profile_picture_url ? (
                <div
                  className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-600 shadow-xl cursor-move"
                  onMouseMove={editingPhoto ? handlePhotoMouseMove : undefined}
                  onMouseDown={() => editingPhoto && setIsDragging(true)}
                  onMouseUp={() => editingPhoto && setIsDragging(false)}
                  onMouseLeave={() => editingPhoto && setIsDragging(false)}
                >
                  <img
                    src={profileData.profile_picture_url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    style={
                      editingPhoto
                        ? {
                            objectPosition: `${photoPosition.x}% ${photoPosition.y}%`
                          }
                        : {}
                    }
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center border-4 border-blue-600 shadow-xl">
                  <span className="text-6xl">👤</span>
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-2 justify-center flex-wrap">
              {editingPhoto ? (
                <>
                  <button
                    onClick={() => {
                      updatePhotoPosition(photoPosition);
                      setEditingPhoto(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700"
                  >
                    Save Position
                  </button>
                  <button
                    onClick={() => {
                      setEditingPhoto(false);
                      setPhotoPosition(
                        profileData.profile_picture_position || { x: 50, y: 50 }
                      );
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <label className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 cursor-pointer">
                    Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files[0] && uploadProfilePicture(e.target.files[0])}
                    />
                  </label>
                  {profileData?.profile_picture_url && (
                    <button
                      onClick={() => setEditingPhoto(true)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700"
                    >
                      Adjust Photo
                    </button>
                  )}
                </>
              )}
            </div>
            {editingPhoto && (
              <p className="text-sm text-gray-600 mt-2">
                Click and drag on the photo to reposition it
              </p>
            )}
          </div>

          {/* Profile Info */}
          {editingProfile ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    defaultValue={profileData?.first_name || ''}
                    id="firstName"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    defaultValue={profileData?.last_name || ''}
                    id="lastName"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Job Title</label>
                <input
                  type="text"
                  defaultValue={profileData?.job_title || ''}
                  id="jobTitle"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  defaultValue={profileData?.phone_number || ''}
                  id="phoneNumber"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={profileData?.email || ''}
                  id="email"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const updates = {
                      first_name: document.getElementById('firstName').value,
                      last_name: document.getElementById('lastName').value,
                      job_title: document.getElementById('jobTitle').value,
                      phone_number: document.getElementById('phoneNumber').value,
                      email: document.getElementById('email').value
                    };
                    updateProfileData(updates);
                  }}
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingProfile(false)}
                  className="flex-1 py-3 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">First Name</p>
                <p className="text-lg font-bold text-gray-900">
                  {profileData?.first_name || 'Not set'}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Last Name</p>
                <p className="text-lg font-bold text-gray-900">
                  {profileData?.last_name || 'Not set'}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Job Title</p>
                <p className="text-lg font-bold text-gray-900">
                  {profileData?.job_title || 'Not set'}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Phone Number</p>
                <p className="text-lg font-bold text-gray-900">
                  {profileData?.phone_number || 'Not set'}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-bold text-gray-900">
                  {profileData?.email || 'Not set'}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Username</p>
                <p className="text-lg font-bold text-gray-900">{currentUser?.username}</p>
              </div>

              <button
                onClick={() => setEditingProfile(true)}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-indigo-700"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}