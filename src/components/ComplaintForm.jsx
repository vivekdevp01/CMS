import React, { useState } from "react";
import { createComplaint } from "../backend/services/complaintService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ComplaintForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    registeredContactNo: "", // 10-digit numeric string
    address: "",
    product: "",
    natureOfComplaint: "",
    complaintReceivedFrom: "",
    warrantyStatus: "",
    dateOfInstallation: "",
  });

  const [files, setFiles] = useState({
    siteImage: null,
    invoiceCopy: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * 1. Integrated Mobile Number Logic
   * Ensures only digits are entered and limits to 10 characters
   */
  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    // Remove any character that is not a digit
    const numericValue = value.replace(/\D/g, "");

    // Only update if the length is 10 or less
    if (numericValue.length <= 10) {
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFiles((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    /**
     * 2. Final Submission Validation
     * Ensures the number is exactly 10 digits and starts with valid Indian mobile prefix (6-9)
     */
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.registeredContactNo)) {
      alert(
        "❌ Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9."
      );
      return;
    }

    try {
      const payload = {
        name: formData.name,
        contactPerson: formData.contactPerson,
        registeredContactNo: formData.registeredContactNo,
        address: formData.address,
        product: formData.product,
        natureOfComplaint: formData.natureOfComplaint,
        complaintReceivedFrom: formData.complaintReceivedFrom,
        warrantyStatus: formData.warrantyStatus,
        dateOfInstallation: formData.dateOfInstallation
          ? new Date(formData.dateOfInstallation)
          : null,

        invoiceMeta: files.invoiceCopy
          ? {
              fileName: files.invoiceCopy.name,
              fileType: files.invoiceCopy.type,
              fileSize: files.invoiceCopy.size,
            }
          : null,

        imageMeta: files.siteImage
          ? {
              fileName: files.siteImage.name,
              fileType: files.siteImage.type,
              fileSize: files.siteImage.size,
            }
          : null,
      };

      await createComplaint(payload);
      toast.success("✅ Complaint submitted successfully");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("❌ Submission failed");
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      contactPerson: "",
      registeredContactNo: "",
      address: "",
      product: "",
      natureOfComplaint: "",
      complaintReceivedFrom: "",
      warrantyStatus: "",
      dateOfInstallation: "",
    });
    setFiles({ siteImage: null, invoiceCopy: null });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-indigo-600">
            Complaint Registration Form
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-8">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              👈 Back to Dashboard
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Name */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700">
                Name *
              </label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Contact Person */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700">
                Contact Person *
              </label>
              <input
                required
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="Enter contact person"
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Integrated Phone Field */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700">
                Registered Contact No. *
              </label>
              <input
                required
                type="tel"
                name="registeredContactNo"
                value={formData.registeredContactNo}
                onChange={handlePhoneChange} // Uses restricted numeric handler
                placeholder="Enter 10-digit number"
                className={`w-full p-2.5 border rounded-md focus:ring-2 outline-none transition-colors ${
                  formData.registeredContactNo &&
                  formData.registeredContactNo.length < 10
                    ? "border-amber-500 ring-amber-200"
                    : "border-gray-300 focus:ring-indigo-500"
                }`}
              />
              {formData.registeredContactNo &&
                formData.registeredContactNo.length < 10 && (
                  <p className="text-[10px] text-amber-600 font-bold">
                    Must be 10 digits
                  </p>
                )}
            </div>

            {/* Address */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700">
                Address *
              </label>
              <input
                required
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Product */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700">
                Product *
              </label>
              <input
                required
                name="product"
                value={formData.product}
                onChange={handleChange}
                placeholder="Enter product"
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Nature of Complaint */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700">
                Nature of Complaint *
              </label>
              <input
                required
                name="natureOfComplaint"
                value={formData.natureOfComplaint}
                onChange={handleChange}
                placeholder="Enter nature of complaint"
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Received From */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700">
                Complaint Received From *
              </label>
              <input
                required
                name="complaintReceivedFrom"
                value={formData.complaintReceivedFrom}
                onChange={handleChange}
                placeholder="Enter source"
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Site Image */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700">
                Site/Product Image
              </label>
              <input
                type="file"
                name="siteImage"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 border border-gray-300 rounded-md p-1"
              />
            </div>

            {/* Warranty Status */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700">
                Warranty Status *
              </label>
              <select
                required
                name="warrantyStatus"
                value={formData.warrantyStatus}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                <option value="">Select status...</option>
                <option value="In-Warranty">In Warranty</option>
                <option value="Out-of-Warranty">Out of Warranty</option>
              </select>
            </div>

            {/* Installation Date */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700">
                Date of Installation *
              </label>
              <input
                required
                type="date"
                name="dateOfInstallation"
                value={formData.dateOfInstallation}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Invoice Copy */}
            <div className="space-y-1 lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700">
                Copy of Invoice *
              </label>
              <input
                required
                type="file"
                name="invoiceCopy"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 border border-gray-300 rounded-md p-1"
              />
            </div>
          </div>

          <div className="mt-12 flex flex-col md:flex-row justify-end gap-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2.5 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50"
            >
              Reset Form
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 shadow-md"
            >
              Submit Complaint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintForm;
