import React, { useState } from "react";
import { warrantyCheckStep } from "../services/complaintService";
import {
  X,
  Calendar,
  Edit3,
  Clock,
  Bookmark,
  CheckCircle2,
  FileText,
  MessageSquare,
} from "lucide-react";

/**
 * testStep2 - Professional Compact Scrollable Version
 */
export const testStep2 = ({ leadId = "V0OsujXIz3XNkyWU5Voe", onClose, onSuccess }) => {
  const [status, setStatus] = useState("");
  const [enqForm, setEnqForm] = useState("");
  const [offerSentStatus, setOfferSentStatus] = useState("");
  const [wStatus, setWStatus] = useState("");
  const [nextFollowUpDate, setNextFollowUpDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdateLead = async () => {
    if (!status || !nextFollowUpDate || !enqForm || !offerSentStatus || !wStatus) {
      alert("Please fill in all compulsory fields");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        status,
        enqForm,
        offerSentStatus,
        wStatus,
        plannedTime: new Date().toISOString(),
        nextFollowUpDate,
        remarks,
      };

      await warrantyCheckStep(leadId, payload);
      alert("✅ STEP-2 executed successfully");
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
      {/* Container fixed to max-w-lg with flex-col and max-height */}
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        
        {/* Fixed Header */}
        <div className="bg-gradient-to-r from-[#f472b6] to-[#fb7185] px-5 py-4 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Edit3 size={18} />
            </div>
            <div>
              <h1 className="text-lg font-bold">Edit Lead Details</h1>
              <p className="text-[10px] opacity-90 leading-tight">Step 2: Warranty & Enquiry Check</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-5 overflow-y-auto space-y-5 custom-scrollbar">
          
          {/* Status Dropdown */}
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

          {/* Enq Form Dropdown */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5">
              <FileText size={14} className="text-blue-500" />
              Enq Form Filled <span className="text-red-500">*</span>
            </label>
            <select
              value={enqForm}
              onChange={(e) => setEnqForm(e.target.value)}
              className={`w-full border rounded-lg py-2 px-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${!enqForm && "border-red-200"} focus:ring-blue-500/20`}
              required
            >
              <option value="" disabled>Select Option</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* Offer Sent Dropdown */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5">
              <MessageSquare size={14} className="text-blue-500" />
              Offer Sent Status <span className="text-red-500">*</span>
            </label>
            <select
              value={offerSentStatus}
              onChange={(e) => setOfferSentStatus(e.target.value)}
              className={`w-full border rounded-lg py-2 px-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${!offerSentStatus && "border-red-200"} focus:ring-blue-500/20`}
              required
            >
              <option value="" disabled>Select Option</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* W-Status Dropdown */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5">
              <CheckCircle2 size={14} className="text-blue-500" />
              W-Status <span className="text-red-500">*</span>
            </label>
            <select
              value={wStatus}
              onChange={(e) => setWStatus(e.target.value)}
              className={`w-full border rounded-lg py-2 px-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${!wStatus && "border-red-200"} focus:ring-blue-500/20`}
              required
            >
              <option value="" disabled>Select Option</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* Follow up Section */}
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
                  placeholder="Enter notes..."
                  className="w-full border border-gray-200 rounded-md py-1.5 px-3 text-sm resize-none focus:ring-1 focus:ring-blue-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="bg-gray-50 px-5 py-3 flex justify-end gap-3 border-t shrink-0">
          <button onClick={onClose} className="px-4 py-1.5 text-xs text-gray-500 font-semibold hover:text-gray-700 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleUpdateLead}
            disabled={loading}
            className={`px-5 py-1.5 rounded-md text-xs font-bold text-white shadow-sm transition-all flex items-center gap-2 ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 active:scale-95"}`}
          >
            <Bookmark size={14} />
            {loading ? "Updating..." : "Update Lead"}
          </button>
        </div>
      </div>
    </div>
  );
};