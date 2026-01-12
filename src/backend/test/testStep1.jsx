import React, { useState } from "react";
import { assignEngineerStep } from "../services/complaintService";
import { X, Calendar, Edit3, Clock, Bookmark, CheckCircle2, Hash, User, Users } from "lucide-react";

/**
 * testStep1 - Professional Compact Scrollable Version
 */
export const testStep1 = ({ leadId = "V0OsujXIz3XNkyWU5Voe", onClose, onSuccess }) => {
  const [status, setStatus] = useState("");
  const [isoNum, setIsoNum] = useState("");
  const [warrantyDate, setWarrantyDate] = useState("");
  const [division, setDivision] = useState("");
  const [engineer, setEngineer] = useState("");
  const [nextFollowUpDate, setNextFollowUpDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdateLead = async () => {
    if (!status || !isoNum || !warrantyDate || !division || !engineer || !nextFollowUpDate) {
      alert("Please fill in all compulsory fields.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        status,
        isoNum,
        warrantyDate,
        division,
        engineer,
        plannedTime: new Date().toISOString(),
        nextFollowUpDate,
        remarks,
      };

      await assignEngineerStep(leadId, payload);
      alert("✅ STEP-1 executed successfully");
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update lead.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4">
      {/* Container fixed to max-w-lg to match Step 4,5,6 */}
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        
        {/* Fixed Header */}
        <div className="bg-gradient-to-r from-[#f472b6] to-[#fb7185] px-5 py-4 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Edit3 size={18} />
            </div>
            <div>
              <h1 className="text-lg font-bold">Edit Lead Details</h1>
              <p className="text-[10px] opacity-90 leading-tight">Step 1: Assignment & Verification</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-5 overflow-y-auto space-y-5 custom-scrollbar">
          
          {/* Status Field */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5">
              <CheckCircle2 size={14} className="text-blue-500" />
              Status <span className="text-red-500">*</span>
            </label>
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`w-full border rounded-lg py-2 px-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${!status && "border-red-200"} focus:ring-blue-500/20`}
              required
            >
              <option value="" disabled>Select Option</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* ISO No Field */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5">
              <Hash size={14} className="text-blue-500" />
              Assigned ISO No. <span className="text-red-500">*</span>
            </label>
            <select 
              value={isoNum}
              onChange={(e) => setIsoNum(e.target.value)}
              className={`w-full border rounded-lg py-2 px-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${!isoNum && "border-red-200"} focus:ring-blue-500/20`}
              required
            >
              <option value="" disabled>Select Option</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* Warranty Date Field */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5">
              <Calendar size={14} className="text-blue-500" />
              Warranty Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={warrantyDate}
              onChange={(e) => setWarrantyDate(e.target.value)}
              className={`w-full border rounded-lg py-2 px-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${!warrantyDate && "border-red-200"} focus:ring-blue-500/20`}
              required
            />
          </div>

          {/* Division Field */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5">
              <Users size={14} className="text-blue-500" />
              Division <span className="text-red-500">*</span>
            </label>
            <select 
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              className={`w-full border rounded-lg py-2 px-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${!division && "border-red-200"} focus:ring-blue-500/20`}
              required
            >
              <option value="" disabled>Select Option</option>
              <option value="Service">Service</option>
              <option value="Installation">Installation</option>
            </select>
          </div>

          {/* Engineer Field */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5">
              <User size={14} className="text-blue-500" />
              Engineer <span className="text-red-500">*</span>
            </label>
            <select 
              value={engineer}
              onChange={(e) => setEngineer(e.target.value)}
              className={`w-full border rounded-lg py-2 px-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${!engineer && "border-red-200"} focus:ring-blue-500/20`}
              required
            >
              <option value="" disabled>Select Engineer</option>
              <option value="Eng_1">Engineer 1</option>
              <option value="Eng_2">Engineer 2</option>
            </select>
          </div>

          {/* Follow up Box */}
          <div className="bg-slate-50 border border-blue-100 rounded-lg p-4 relative">
            <div className="absolute top-0 left-0 w-1 bg-blue-500 h-full rounded-l-lg"></div>
            <div className="flex items-center gap-2 mb-4">
              <Clock size={16} className="text-blue-600" />
              <h2 className="text-sm font-bold text-slate-700">Follow up Section</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Calendar size={12} className="text-blue-400" /> Next Follow Up Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={nextFollowUpDate}
                  onChange={(e) => setNextFollowUpDate(e.target.value)}
                  className={`w-full border rounded-md py-1.5 px-3 text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none ${!nextFollowUpDate && "border-red-200"}`}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Edit3 size={12} className="text-blue-400" /> Remarks
                </label>
                <textarea
                  rows="2"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter assignment notes..."
                  className="w-full border border-gray-200 rounded-md py-1.5 px-3 text-sm resize-none focus:ring-1 focus:ring-blue-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="bg-gray-50 px-5 py-3 flex justify-end gap-3 border-t shrink-0">
          <button 
            onClick={onClose} 
            className="px-4 py-1.5 text-xs text-gray-500 font-semibold hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleUpdateLead}
            disabled={loading}
            className={`px-5 py-1.5 rounded-md text-xs font-bold text-white shadow-sm transition-all flex items-center gap-2 ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}`}
          >
            <Bookmark size={14} />
            {loading ? "Updating..." : "Update Lead"}
          </button>
        </div>
      </div>
    </div>
  );
};