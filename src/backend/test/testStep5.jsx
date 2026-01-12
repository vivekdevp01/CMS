import React, { useState } from "react";
import { paymentCollectionStep } from "../services/complaintService";
import { X, Calendar, Edit3, Clock, Bookmark, CheckCircle2, FileText } from "lucide-react";

/**
 * testStep5 - Professional Compact Version
 * Focused UI for Payment Collection with Mandatory Fields
 */
export const testStep5 = ({ leadId = "V0OsujXIz3XNkyWU5Voe", onClose }) => {
  // 1. Initialized to empty to force a selection
  const [paymentCollected, setPaymentCollected] = useState("");
  const [supportDoc, setSupportDoc] = useState(null);
  const [nextFollowUpDate, setNextFollowUpDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSupportDoc({
        name: file.name,
        type: file.type,
        size: file.size,
      });
    }
  };

  const handleUpdateLead = async () => {
    // 2. Validation Logic
    if (!paymentCollected) {
      alert("Please select if payment was collected.");
      return;
    }
    if (!nextFollowUpDate) {
      alert("Please select a next follow-up date.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        paymentCollected,
        supportDoc: supportDoc || {
          name: "receipt.pdf",
          type: "application/pdf",
          size: 345678,
        },
        plannedTime: new Date().toISOString(), // Dynamic timestamp
        nextFollowUpDate,
        remarks,
      };

      await paymentCollectionStep(leadId, payload);
      alert("✅ STEP-5 executed successfully");
      if (onClose) onClose();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update lead.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Compact Pink Header */}
        <div className="bg-gradient-to-r from-[#f472b6] to-[#fb7185] px-5 py-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Edit3 size={18} />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">Edit Lead Details</h1>
              <p className="text-[10px] opacity-90 leading-tight">Step 5: Collect Payment</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Section 1: Payment and Document */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5">
                <CheckCircle2 size={14} className="text-blue-500" /> 
                Payment <span className="text-red-500">*</span>
              </label>
              <select 
                value={paymentCollected}
                onChange={(e) => setPaymentCollected(e.target.value)}
                className={`w-full border rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 transition-all ${
                    !paymentCollected ? 'border-orange-200 bg-orange-50' : 'border-gray-200 bg-gray-50 focus:ring-blue-400'
                }`}
              >
                <option value="">Select...</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5">
                <FileText size={14} className="text-blue-500" /> Supp. Doc
              </label>
              <div className="relative">
                <input 
                  type="file" 
                  onChange={handleFileChange}
                  className="w-full text-[10px] text-gray-500 border border-gray-200 rounded-lg bg-gray-50 file:mr-2 file:py-2 file:px-3 file:border-0 file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 transition-all cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Follow up Box */}
          <div className="bg-slate-50 border border-blue-100 rounded-lg p-4 relative">
            <div className="absolute top-0 left-0 w-1 bg-blue-500 h-full rounded-l-lg"></div>
            <div className="flex items-center gap-2 mb-3">
              <Clock size={16} className="text-blue-600" />
              <h2 className="text-sm font-bold text-slate-700">Follow up Section</h2>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Calendar size={12} className="text-blue-400" /> 
                  Next Follow Up <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={nextFollowUpDate}
                  onChange={(e) => setNextFollowUpDate(e.target.value)}
                  className={`w-full border rounded-md py-1.5 px-3 text-sm focus:outline-none focus:ring-1 ${
                    !nextFollowUpDate ? 'border-orange-200 ring-orange-100' : 'border-gray-200 focus:ring-blue-400'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Edit3 size={12} className="text-blue-400" /> Remarks
                </label>
                <textarea
                  rows="2"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Payment notes..."
                  className="w-full border border-gray-200 rounded-md py-1.5 px-3 text-sm resize-none focus:ring-1 focus:ring-blue-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="bg-gray-50 px-5 py-3 flex justify-end gap-3 border-t">
          <button 
            onClick={onClose} 
            className="px-4 py-1.5 text-xs text-gray-500 font-semibold hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleUpdateLead}
            disabled={loading}
            className={`px-5 py-1.5 rounded-md text-xs font-bold text-white shadow-sm transition-all flex items-center gap-2 ${
              loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
            }`}
          >
            <Bookmark size={14} />
            {loading ? "Updating..." : "Update Lead"}
          </button>
        </div>
      </div>
    </div>
  );
};