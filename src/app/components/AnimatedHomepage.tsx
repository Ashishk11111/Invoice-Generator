/* eslint-disable @typescript-eslint/no-explicit-any */


'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Moon, Sun, Plus, Minus, Download } from 'lucide-react';

// Type definitions
type Description = {
  details: string[];
  hsnCode: string;
  quantity: string;
  unit: string;
  rate: string;
  discount: string;
  [key: string]: string | string[];
};

type DescriptionsState = {
  [key: string]: Description;
};

type AnimatedHomepageProps = {
  billingData: any;
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBillChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDownload: () => void;
  descriptions: DescriptionsState;
  handleDescriptionChange: (
    descKey: string,
    field: keyof Description,
    value: string,
    index?: number | null
  ) => void;
  handleAddDescription: () => void;
  handleAddDetail: (descKey: string) => void;
  handleRemoveDescription: (descKey: string) => void;
  handleRemoveDetail: (descKey: string, index: number) => void;
};

const AnimatedHomepage: React.FC<AnimatedHomepageProps> = ({
  formData,
  billingData,
  handleChange,
  handleBillChange,
  handleDownload,
  descriptions,
  handleDescriptionChange,
  handleAddDescription,
  handleAddDetail,
  handleRemoveDescription,
  handleRemoveDetail
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const datekeys = ["date", "datePO", "DispatchedDate", "referenceDate"];
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`relative min-h-screen transition-all duration-500 ${isDarkMode
      ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900'
      : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>
      {/* Background Effects */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${isDarkMode
        ? 'bg-gradient-to-br from-slate-800/20 via-blue-800/20 to-indigo-800/20'
        : 'bg-gradient-to-br from-blue-100/30 via-indigo-100/30 to-purple-100/30'
        }`} />

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className={`absolute top-20 left-10 w-32 h-32 rounded-full ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-200/20'
            } blur-xl`}
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className={`absolute bottom-20 right-10 w-48 h-48 rounded-full ${isDarkMode ? 'bg-indigo-500/10' : 'bg-indigo-200/20'
            } blur-xl`}
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Dark Mode Toggle */}
      <motion.button
        onClick={toggleDarkMode}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full shadow-lg transition-all duration-300 ${isDarkMode
          ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700'
          : 'bg-white text-slate-600 hover:bg-gray-50'
          } border-2 ${isDarkMode ? 'border-slate-600' : 'border-gray-200'}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </motion.button>

      {/* Floating Logo */}
      <div className="fixed top-6 left-6 z-50">
        <motion.div
          className={`backdrop-blur-md p-3 rounded-2xl shadow-xl border ${isDarkMode
            ? 'bg-slate-800/90 border-slate-600'
            : 'bg-white/90 border-gray-200'
            }`}
          animate={{
            rotate: [0, 2, -2, 0],
            scale: [1, 1.02, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <img
            src="/logo2.png"
            alt="Mohan Enterprises"
            className="w-10 h-10 object-contain"
          />
        </motion.div>
      </div>

      {/* Main Container */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`relative max-w-6xl w-full rounded-3xl shadow-2xl overflow-hidden ${isDarkMode
            ? 'bg-slate-800/95 border-slate-600'
            : 'bg-white/95 border-gray-200'
            } border backdrop-blur-md`}
        >
          {/* Company Header */}
          <div className={`relative p-8 ${isDarkMode
            ? 'bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800'
            : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'
            }`}>
            <div className="absolute inset-0 bg-black/10" />
            <motion.div
              className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-6 lg:space-y-0"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                  <img
                    src="/logo2.png"
                    alt="Mohan Enterprises Logo"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="text-white">
                  <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                    Mohan Enterprises
                  </h1>
                  <p className="text-blue-100 font-medium text-sm lg:text-base max-w-2xl leading-relaxed">
                    Professional Solutions in Refrigeration & Air Conditioning Systems
                  </p>
                  <div className="mt-3 text-xs text-blue-200">
                    <span className="font-semibold">GSTIN:</span> 07CEGPS6132F1ZG
                  </div>
                </div>
              </div>

              <div className="text-white space-y-2">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-blue-200" />
                  <span className="font-semibold">+91-8076884285</span>
                </div>
                <div className="text-blue-200 text-sm space-y-1">
                  <div>9953366595</div>
                  <div>9528746236</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative mt-6 pt-6 border-t border-white/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <p className="text-blue-100 text-sm leading-relaxed">
                <span className="font-semibold text-white">Specializing in:</span> Kirloskar, Danfoss, Infos, Manik, Parker, Super Valve, Alfa Laval PHE Chiller & Condenser
              </p>
              <p className="text-blue-200 text-xs mt-2 leading-relaxed opacity-90">
                Complete solutions for Refrigeration Plants, Beer Plants, Ice Plants, Air Conditioning,
                Chilling Plants, Cold Storage with professional installation and commissioning services.
              </p>
            </motion.div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`text-3xl font-bold mb-8 text-center ${isDarkMode
                ? 'text-white'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'
                }`}
            >
              Professional Invoice Generator
            </motion.h2>

            {/* Billing Details Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8"
            >
              <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'
                }`}>
                Billing Information
              </h3>
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 rounded-2xl border-2 transition-all duration-300 ${isDarkMode
                ? 'bg-slate-700/50 border-slate-600 hover:border-blue-500'
                : 'bg-blue-50/80 border-blue-200 hover:border-blue-400'
                } hover:shadow-lg`}>
                {Object.keys(billingData).map((key, index) => (
                  <motion.div
                    key={key}
                    className="relative group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <label className={`block text-sm font-medium mb-2 capitalize ${isDarkMode ? 'text-slate-300' : 'text-gray-700'
                      }`}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <motion.input
                      type={datekeys.includes(key) ? "date" : "text"}
                      name={key}
                      value={billingData[key]}
                      placeholder={key.replace(/([A-Z])/g, ' $1').trim()}
                      className={`w-full p-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${isDarkMode
                        ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500'
                        : 'bg-white border-gray-200 text-gray-700 placeholder-gray-400 focus:border-blue-400'
                        }`}
                      onChange={handleBillChange}
                      whileHover={{ scale: 1.02 }}
                      whileFocus={{ scale: 1.03 }}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Form Details Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'
                }`}>
                Additional Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.keys(formData).map((key, index) => (
                  <motion.div
                    key={key}
                    className="relative group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <label className={`block text-sm font-medium mb-2 capitalize ${isDarkMode ? 'text-slate-300' : 'text-gray-700'
                      }`}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <motion.input
                      type={datekeys.includes(key) ? "date" : "text"}
                      name={key}
                      value={formData[key]}
                      placeholder={key.replace(/([A-Z])/g, ' $1').trim()}
                      className={`w-full p-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${isDarkMode
                        ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-indigo-500'
                        : 'bg-white border-gray-200 text-gray-700 placeholder-gray-400 focus:border-indigo-400'
                        }`}
                      onChange={handleChange}
                      whileHover={{ scale: 1.02 }}
                      whileFocus={{ scale: 1.03 }}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Descriptions Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-8"
            >
              <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-purple-300' : 'text-purple-700'
                }`}>
                Item Descriptions
              </h3>

              {Object.entries(descriptions)
                .sort((a, b) => {
                  const numA = parseInt(a[0].split(" ")[1]);
                  const numB = parseInt(b[0].split(" ")[1]);
                  return numA - numB;
                })
                .map(([key, desc], i) => (
                  <motion.div
                    key={i}
                    className={`border-2 p-6 mb-6 rounded-2xl shadow-lg transition-all duration-300 ${isDarkMode
                      ? 'bg-slate-700/50 border-slate-600 hover:border-blue-500'
                      : 'bg-blue-50/80 border-blue-200 hover:border-blue-400'
                      } hover:shadow-lg`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                        {key}
                      </h4>
                      <motion.button
                        onClick={() => handleRemoveDescription(key)}
                        className="flex items-center space-x-1 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Minus className="w-4 h-4" />
                        <span className="text-sm">Remove</span>
                      </motion.button>
                    </div>

                    {/* Details */}
                    <div className="space-y-3 mb-4">
                      {desc.details.map((detail, idx) => {
                        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                          const value = e.target.value;
                          if (value.length <= 30) {
                            handleDescriptionChange(key, "details", value, idx);
                          }
                        };

                        const isAtLimit = detail.length === 30;

                        return (
                          <div key={idx} className="flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                              <input
                                type="text"
                                value={detail}
                                onChange={handleInputChange}
                                placeholder={`Detail ${idx + 1}`}
                                className={`flex-1 p-2 rounded-lg border transition-all duration-200
            ${isDarkMode
                                    ? 'bg-slate-800 text-white placeholder-slate-400'
                                    : 'bg-gray-50 text-gray-700 placeholder-gray-400'}
            ${isAtLimit
                                    ? 'border-yellow-500'
                                    : isDarkMode
                                      ? 'border-slate-600'
                                      : 'border-gray-200'}
          `}
                              />

                              {desc.details.length > 1 && (
                                <motion.button
                                  onClick={() => handleRemoveDetail(key, idx)}
                                  className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors duration-200"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Minus className="w-4 h-4" />
                                </motion.button>
                              )}
                            </div>

                            {isAtLimit && (
                              <p className="text-sm text-yellow-600 ml-1">
                                ⚠️ You’ve reached the 30-character limit.
                              </p>
                            )}
                          </div>
                        );
                      })}


                      <motion.button
                        onClick={() => handleAddDetail(key)}
                        className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Plus className="w-4 h-4" />
                        <span className="text-sm">Add Detail</span>
                      </motion.button>
                    </div>

                    {/* Other Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <input
                        type="text"
                        value={desc.hsnCode}
                        onChange={(e) => handleDescriptionChange(key, 'hsnCode', e.target.value)}
                        placeholder="HSN Code"
                        className={`p-2 rounded-lg border transition-all duration-200 ${isDarkMode
                          ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400'
                          : 'bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400'
                          }`}
                      />
                      <input
                        type="text"
                        value={desc.quantity}
                        onChange={(e) => handleDescriptionChange(key, 'quantity', e.target.value)}
                        placeholder="Quantity"
                        className={`p-2 rounded-lg border transition-all duration-200 ${isDarkMode
                          ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400'
                          : 'bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400'
                          }`}
                      />
                      <input
                        type="text"
                        value={desc.unit}
                        onChange={(e) => handleDescriptionChange(key, 'unit', e.target.value)}
                        placeholder="Unit"
                        className={`p-2 rounded-lg border transition-all duration-200 ${isDarkMode
                          ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400'
                          : 'bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400'
                          }`}
                      />
                      <input
                        type="number"
                        value={desc.rate}
                        onChange={(e) => handleDescriptionChange(key, 'rate', e.target.value)}
                        placeholder="Rate"
                        className={`p-2 rounded-lg border transition-all duration-200 ${isDarkMode
                          ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400'
                          : 'bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400'
                          }`}
                      />
                      <input
                        type="number"
                        value={desc.discount}
                        onChange={(e) => handleDescriptionChange(key, 'discount', e.target.value)}
                        placeholder="Discount"
                        className={`p-2 rounded-lg border transition-all duration-200 ${isDarkMode
                          ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400'
                          : 'bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400'
                          }`}
                      />
                    </div>
                  </motion.div>
                ))}

              <motion.button
                onClick={handleAddDescription}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5" />
                <span>Add New Description</span>
              </motion.button>
            </motion.div>

            {/* Generate Button */}
            <motion.button
              onClick={handleDownload}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{
                scale: 1.02,
                boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)'
              }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold px-8 py-4 rounded-2xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-xl transition-all duration-300 text-lg tracking-wide flex items-center justify-center space-x-3"
            >
              <Download className="w-6 h-6" />
              <span>Generate Professional Invoice</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnimatedHomepage;
