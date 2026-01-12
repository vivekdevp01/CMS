import React, { useState, useEffect } from "react";
import {
  Calendar,
  Edit3,
  Clock,
  Bookmark,
  CheckCircle2,
  Hash,
  User,
  Users,
} from "lucide-react";
import { assignEngineerStep } from "../backend/services/complaintService";
import toast from "react-hot-toast";

export const Step1Form = ({ complaint, onSuccess }) => {
  const [status, setStatus] = useState("");
  const [isoNum, setIsoNum] = useState("");
  const [warrantyDate, setWarrantyDate] = useState("");
  const [division, setDivision] = useState("");
  const [engineer, setEngineer] = useState("");
  const [nextFollowUpDate, setNextFollowUpDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);

  /* 🔄 Prefill */
  useEffect(() => {
    if (complaint) {
      setStatus(complaint.status || "");
      setIsoNum(complaint.isoNum || "");
      setWarrantyDate(complaint.warrantyDate || "");
      setDivision(complaint.division || "");
      setEngineer(complaint.engineer || "");
      setNextFollowUpDate(complaint.nextFollowUpDate || "");
      setRemarks(complaint.remarks || "");
    }
  }, [complaint]);

  /* ✅ SAVE STEP-1 WITH TOAST */
  const handleSaveStep1 = async () => {
    if (
      !status ||
      !isoNum ||
      !warrantyDate ||
      !division ||
      !engineer ||
      !nextFollowUpDate
    ) {
      toast.error("Please fill all mandatory fields");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Updating Step 1...");

    try {
      const payload = {
        status,
        isoNum,
        warrantyDate,
        division,
        plannedTime: new Date().toISOString(),
        nextFollowUpDate,
        remarks,
      };

      await assignEngineerStep(complaint.id, payload);

      toast.success("Step-1 updated successfully", { id: toastId });

      onSuccess?.(2); // move to Step-2
    } catch (err) {
      console.error("Step-1 Save Error:", err);
      toast.error("Failed to update Step-1", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* STATUS */}
      <div>
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5">
          <CheckCircle2 size={14} className="text-blue-500" />
          Status <span className="text-red-500">*</span>
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border rounded-lg py-2 px-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="" disabled>
            Select Option
          </option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      {/* ISO */}
      <div>
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5">
          <Hash size={14} className="text-blue-500" />
          Assigned ISO No. <span className="text-red-500">*</span>
        </label>
        <select
          value={isoNum}
          onChange={(e) => setIsoNum(e.target.value)}
          className={`w-full border rounded-lg py-2 px-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 ${
            !isoNum && "border-red-200"
          } focus:ring-blue-500/20`}
        >
          <option value="" disabled>
            Select Option
          </option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      {/* WARRANTY DATE */}
      <div>
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5">
          <Calendar size={14} className="text-blue-500" />
          Warranty Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={warrantyDate}
          onChange={(e) => setWarrantyDate(e.target.value)}
          className={`w-full border rounded-lg py-2 px-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 ${
            !warrantyDate && "border-red-200"
          } focus:ring-blue-500/20`}
        />
      </div>

      {/* DIVISION */}
      <div>
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5">
          <Users size={14} className="text-blue-500" />
          Division <span className="text-red-500">*</span>
        </label>
        <select
          value={division}
          onChange={(e) => setDivision(e.target.value)}
          className={`w-full border rounded-lg py-2 px-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 ${
            !division && "border-red-200"
          } focus:ring-blue-500/20`}
        >
          <option value="" disabled>
            Select Option
          </option>
          <option value="Service">Service</option>
          <option value="Installation">Installation</option>
        </select>
      </div>

      {/* ENGINEER */}
      <div>
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5">
          <User size={14} className="text-blue-500" />
          Engineer <span className="text-red-500">*</span>
        </label>
        <select
          value={engineer}
          onChange={(e) => setEngineer(e.target.value)}
          className={`w-full border rounded-lg py-2 px-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 ${
            !engineer && "border-red-200"
          } focus:ring-blue-500/20`}
        >
          <option value="" disabled>
            Select Engineer
          </option>
          <option value="Eng_1">Engineer 1</option>
          <option value="Eng_2">Engineer 2</option>
        </select>
      </div>

      {/* FOLLOW UP */}
      <div className="bg-slate-50 border border-blue-100 rounded-lg p-4 relative">
        <div className="absolute top-0 left-0 w-1 bg-blue-500 h-full rounded-l-lg"></div>

        <div className="flex items-center gap-2 mb-4">
          <Clock size={16} className="text-blue-600" />
          <h2 className="text-sm font-bold text-slate-700">
            Follow up Section
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <Calendar size={12} className="text-blue-400" />
              Next Follow Up Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={nextFollowUpDate}
              onChange={(e) => setNextFollowUpDate(e.target.value)}
              className={`w-full border rounded-md py-1.5 px-3 text-sm ${
                !nextFollowUpDate && "border-red-200"
              }`}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <Edit3 size={12} className="text-blue-400" />
              Remarks
            </label>
            <textarea
              rows="2"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full border border-gray-200 rounded-md py-1.5 px-3 text-sm"
            />
          </div>
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveStep1}
          disabled={loading}
          className={`px-4 py-2 rounded-lg text-xs font-bold text-white flex items-center gap-2 ${
            loading
              ? "bg-gray-400"
              : "bg-amber-600 hover:bg-amber-700 active:scale-95"
          }`}
        >
          <Bookmark size={14} />
          {loading ? "Updating..." : "Update Step 1"}
        </button>
      </div>
    </div>
  );
};
