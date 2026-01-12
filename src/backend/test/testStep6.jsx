import React, { useState } from "react";
import { completionStep } from "../services/complaintService";
import { X, Calendar, Edit3, Clock, Bookmark, CheckCircle2, UploadCloud } from "lucide-react";

/**
 * testStep6 - Professional Compact Version
 * Status: Compulsory | Site Upload: Optional
 */
export const testStep6 = ({ leadId = "V0OsujXIz3XNkyWU5Voe", onClose }) => {
  const [status, setStatus] = useState(""); 
  const [siteUpload, setSiteUpload] = useState(null);
  const [remarks, setRemarks] = useState("Complaint resolved and closed");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSiteUpload({
        name: file.name,
        type: file.type,
        size: file.size,
      });
    }
  };

  const handleUpdateLead = async () => {
    // Only validate Status
    if (!status) {
      alert("Please select a final status.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        status,
        // Fallback provided if no file is uploaded
        siteUpload: siteUpload || {
          name: "not_provided.pdf",
          type: "application/pdf",
          size: 0,
        },
        plannedTime: new Date().toISOString(),
        remarks,
      };

      await completionStep(leadId, payload);
      alert("✅ STEP-6 executed: Complaint closed");
      if (onClose) onClose();
    } catch (err) {
      console.error("Resolution update failed:", err);
      alert("Failed to close complaint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#f472b6] to-[#fb7185] px-5 py-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Edit3 size={18} />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">Edit Lead Details</h1>
              <p className="text-[10px] opacity-90 leading-tight">Step 6: Final Resolution</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* COMPULSORY STATUS */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5">
                <CheckCircle2 size={14} className="text-blue-500" /> 
                Status <span className="text-red-500">*</span>
              </label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`w-full border rounded-lg py-2 px-3 text-sm focus:outline-none transition-all ${
                  !status ? 'border-orange-300 bg-orange-50' : 'border-gray-200 bg-white focus:ring-1 focus:ring-blue-400'
                }`}
              >
                <option value="">Select Status...</option>
                <option value="Done">Done</option>
                <option value="Hold">Hold</option>
              </select>
            </div>

            {/* OPTIONAL UPLOAD */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5">
                <UploadCloud size={14} className="text-blue-500" /> 
                Site Upload <span className="text-gray-400 font-normal ml-1">(Optional)</span>
              </label>
              <div className="relative">
                <input 
                  type="file" 
                  onChange={handleFileChange}
                  className="w-full text-[10px] text-gray-500 border border-gray-200 rounded-lg bg-gray-50 file:mr-2 file:py-2 file:px-3 file:border-0 file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 transition-all cursor-pointer"
                />
              </div>
              {siteUpload && <p className="text-[9px] text-green-600 mt-1 font-medium italic">✓ {siteUpload.name}</p>}
            </div>
          </div>

          {/* Remarks Section */}
          <div className="bg-slate-50 border border-blue-100 rounded-lg p-4 relative">
            <div className="absolute top-0 left-0 w-1 bg-blue-500 h-full rounded-l-lg"></div>
            <div className="flex items-center gap-2 mb-3">
              <Clock size={16} className="text-blue-600" />
              <h2 className="text-sm font-bold text-slate-700">Resolution Details</h2>
            </div>

            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Edit3 size={12} className="text-blue-400" /> Final Remarks
              </label>
              <textarea
                rows="3"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter final notes..."
                className="w-full border border-gray-200 rounded-md py-1.5 px-3 text-sm resize-none focus:ring-1 focus:ring-blue-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-5 py-3 flex justify-end gap-3 border-t">
          <button onClick={onClose} className="px-4 py-1.5 text-xs text-gray-500 font-semibold hover:text-gray-700 transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleUpdateLead}
            disabled={loading}
            className={`px-5 py-1.5 rounded-md text-xs font-bold text-white shadow-sm transition-all flex items-center gap-2 ${
              loading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700 active:scale-95'
            }`}
          >
            <Bookmark size={14} />
            {loading ? "Closing..." : "Close Complaint"}
          </button>
        </div>
      </div>
    </div>
  );
};
