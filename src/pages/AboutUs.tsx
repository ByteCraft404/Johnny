import React, { useState } from 'react';
import { Edit, Save, X, Info, Mail, Phone, MapPin } from 'lucide-react';

const AboutUs: React.FC = () => {
  const [editing, setEditing] = useState(false);
  const [aboutInfo, setAboutInfo] = useState({
    companyName: 'Safari Njema Transportation',
    slogan: 'Your Journey, Our Priority',
    description: 'Safari Njema is a leading transportation company in Kenya, providing reliable, safe, and comfortable travel services across the country. Established in 2015, we have grown to become one of the most trusted names in the transportation industry, connecting major cities and towns with our fleet of modern buses and shuttles.',
    mission: 'To provide reliable, safe, and comfortable transportation services that exceed customer expectations while maintaining the highest standards of professionalism and integrity.',
    vision: 'To be the most preferred transportation service provider in East Africa, known for excellence, innovation, and customer satisfaction.',
    values: [
      'Safety First - We prioritize the safety of our passengers and staff above all else.',
      'Customer Satisfaction - We strive to exceed customer expectations in every interaction.',
      'Reliability - We are committed to punctuality and dependability in all our services.',
      'Integrity - We conduct our business with honesty and transparency.',
      'Innovation - We continuously seek to improve our services through innovation and technology.'
    ],
    contactInfo: {
      email: 'info@safarinjema.co.ke',
      phone: '+254 712 345 678',
      address: 'Moi Avenue, Central Business District, Nairobi, Kenya'
    }
  });
  
  const handleSave = () => {
    // In a real application, you would save the data to your backend
    console.log('Saving about info:', aboutInfo);
    setEditing(false);
  };
  
  const handleCancel = () => {
    // Reset any changes (in a real app, you would fetch the original data)
    setEditing(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">About Safari Njema</h1>
          
          {editing ? (
            <div className="flex space-x-2">
              <button 
                onClick={handleCancel}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
              >
                <X size={18} className="mr-1" />
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-3 py-1 bg-teal-600 text-white rounded-md hover:bg-teal-700 flex items-center"
              >
                <Save size={18} className="mr-1" />
                Save
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setEditing(true)}
              className="px-3 py-1 bg-teal-600 text-white rounded-md hover:bg-teal-700 flex items-center"
            >
              <Edit size={18} className="mr-1" />
              Edit
            </button>
          )}
        </div>
        
        <div className="space-y-8">
          {/* Company Overview */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Company Overview</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              {editing ? (
                <input
                  type="text"
                  value={aboutInfo.companyName}
                  onChange={(e) => setAboutInfo({...aboutInfo, companyName: e.target.value})}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              ) : (
                <p className="text-lg font-medium text-gray-900">{aboutInfo.companyName}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slogan
              </label>
              {editing ? (
                <input
                  type="text"
                  value={aboutInfo.slogan}
                  onChange={(e) => setAboutInfo({...aboutInfo, slogan: e.target.value})}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              ) : (
                <p className="text-md italic text-gray-600">{aboutInfo.slogan}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Description
              </label>
              {editing ? (
                <textarea
                  rows={4}
                  value={aboutInfo.description}
                  onChange={(e) => setAboutInfo({...aboutInfo, description: e.target.value})}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              ) : (
                <p className="text-gray-700">{aboutInfo.description}</p>
              )}
            </div>
          </section>
          
          {/* Mission, Vision, Values */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Mission, Vision & Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Our Mission
                </label>
                {editing ? (
                  <textarea
                    rows={3}
                    value={aboutInfo.mission}
                    onChange={(e) => setAboutInfo({...aboutInfo, mission: e.target.value})}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  />
                ) : (
                  <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded-r-md">
                    <p className="text-gray-700">{aboutInfo.mission}</p>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Our Vision
                </label>
                {editing ? (
                  <textarea
                    rows={3}
                    value={aboutInfo.vision}
                    onChange={(e) => setAboutInfo({...aboutInfo, vision: e.target.value})}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  />
                ) : (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md">
                    <p className="text-gray-700">{aboutInfo.vision}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Our Core Values
              </label>
              
              {editing ? (
                <div className="space-y-2">
                  {aboutInfo.values.map((value, index) => (
                    <div key={index} className="flex items-start">
                      <textarea
                        rows={2}
                        value={value}
                        onChange={(e) => {
                          const newValues = [...aboutInfo.values];
                          newValues[index] = e.target.value;
                          setAboutInfo({...aboutInfo, values: newValues});
                        }}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                      />
                      <button 
                        onClick={() => {
                          const newValues = aboutInfo.values.filter((_, i) => i !== index);
                          setAboutInfo({...aboutInfo, values: newValues});
                        }}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  
                  <button 
                    onClick={() => {
                      setAboutInfo({
                        ...aboutInfo, 
                        values: [...aboutInfo.values, '']
                      });
                    }}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
                  >
                    Add Value
                  </button>
                </div>
              ) : (
                <ul className="space-y-2 list-inside">
                  {aboutInfo.values.map((value, index) => (
                    <li key={index} className="flex items-start">
                      <Info size={18} className="text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{value}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
          
          {/* Contact Information */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                {editing ? (
                  <input
                    type="email"
                    value={aboutInfo.contactInfo.email}
                    onChange={(e) => setAboutInfo({
                      ...aboutInfo, 
                      contactInfo: {...aboutInfo.contactInfo, email: e.target.value}
                    })}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  />
                ) : (
                  <div className="flex items-center">
                    <Mail size={18} className="text-teal-600 mr-2" />
                    <span className="text-gray-700">{aboutInfo.contactInfo.email}</span>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                {editing ? (
                  <input
                    type="tel"
                    value={aboutInfo.contactInfo.phone}
                    onChange={(e) => setAboutInfo({
                      ...aboutInfo, 
                      contactInfo: {...aboutInfo.contactInfo, phone: e.target.value}
                    })}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  />
                ) : (
                  <div className="flex items-center">
                    <Phone size={18} className="text-teal-600 mr-2" />
                    <span className="text-gray-700">{aboutInfo.contactInfo.phone}</span>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={aboutInfo.contactInfo.address}
                    onChange={(e) => setAboutInfo({
                      ...aboutInfo, 
                      contactInfo: {...aboutInfo.contactInfo, address: e.target.value}
                    })}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  />
                ) : (
                  <div className="flex items-center">
                    <MapPin size={18} className="text-teal-600 mr-2" />
                    <span className="text-gray-700">{aboutInfo.contactInfo.address}</span>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;