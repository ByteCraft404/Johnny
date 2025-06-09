import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';
import api from '../utils/api';

const AddDriver: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    age: '',
    email: '',
    phone: '',
    address: '',
    licenseNumber: '',
    licenseExpiry: '',
    vehicleReg: '',
    vehicleType: '',
    experience: ''
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<{ id: number; regNumber: string; type: string; status: string }[]>([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await api.get('/api/vehicles', {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        });
        // Only vehicles not "In Service"
        setVehicles(response.data.filter((v: { id: number; regNumber: string; type: string; status: string }) => v.status !== 'In Service'));
      } catch {
        // Optionally handle error
      }
    };
    fetchVehicles();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // If the user selects a vehicle, auto-set the vehicleType
    if (name === 'vehicleReg') {
      const selectedVehicle = vehicles.find(v => v.regNumber === value);
      setFormData(prev => ({
        ...prev,
        vehicleReg: value,
        vehicleType: selectedVehicle ? selectedVehicle.type : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const driverData = {
      ...formData,
      profileImage,
    };

    try {
      const token = localStorage.getItem('token');
      await api.post('/api/drivers', driverData, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      // If a vehicle was assigned, update its details
      if (formData.vehicleReg) {
        // Find the selected vehicle by regNumber
        const selectedVehicle = vehicles.find(v => v.regNumber === formData.vehicleReg);
        if (selectedVehicle) {
          await api.put(`/api/vehicles/${selectedVehicle.id}`, {
            driver: formData.name,
            status: 'In Service',
          }, {
            headers: {
              Authorization: token ? `Bearer ${token}` : '',
            },
          });
        }
      }

      navigate('/drivers');
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert('Error adding driver: ' + error.message);
      } else {
        alert('Error adding driver: Unknown error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <Link to="/drivers" className="mr-4 text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Add New Driver</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - Personal Information */}
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-700 border-b pb-2">Personal Information</h2>
              <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-2">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile preview" className="w-full h-full object-cover" />
                  ) : (
                    <Upload size={30} className="text-gray-400" />
                  )}
                </div>
                <label className="cursor-pointer bg-teal-600 hover:bg-teal-700 text-white text-sm py-1 px-3 rounded-md transition duration-200">
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  min="18"
                  required
                  value={formData.age}
                  onChange={handleChange}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              </div>
            </div>
            {/* Middle Column - Contact Information */}
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-700 border-b pb-2">Contact Information</h2>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Experience
                </label>
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  min="0"
                  value={formData.experience}
                  onChange={handleChange}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              </div>
            </div>
            {/* Right Column - License and Vehicle Information */}
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-700 border-b pb-2">License & Vehicle Information</h2>
              <div>
                <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  License Number
                </label>
                <input
                  type="text"
                  id="licenseNumber"
                  name="licenseNumber"
                  required
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="licenseExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                  License Expiry Date
                </label>
                <input
                  type="date"
                  id="licenseExpiry"
                  name="licenseExpiry"
                  required
                  value={formData.licenseExpiry}
                  onChange={handleChange}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="vehicleReg" className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned Vehicle Reg
                </label>
                <select
                  id="vehicleReg"
                  name="vehicleReg"
                  value={formData.vehicleReg}
                  onChange={handleChange}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                >
                  <option value="">Select Available Vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.regNumber}>
                      {vehicle.regNumber}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Type
                </label>
                <input
                  type="text"
                  id="vehicleType"
                  name="vehicleType"
                  value={formData.vehicleType}
                  readOnly
                  className="block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Link
              to="/drivers"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
            >
              Add Driver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDriver;