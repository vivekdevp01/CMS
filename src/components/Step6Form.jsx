import React, { useState, useEffect } from "react";
import {
  Bookmark,
  CheckCircle2,
  UploadCloud,
  Clock,
  Edit3,
} from "lucide-react";
import { doc, runTransaction, Timestamp } from "firebase/firestore";
import { db } from "../backend/config/firebase";
import toast from "react-hot-toast";

export const Step6Form = ({ complaint, onSuccess }) => {
  const [status, setStatus] = useState("");
  const [siteUpload, setSiteUpload] = useState(null);
  const [remarks, setRemarks] = useState("Complaint resolved and closed");
  const [loading, setLoading] = useState(false);

  /* 🔄 Prefill if already completed */
  useEffect(() => {
    const s6 = complaint?.step6_completion;
    if (s6) {
      setStatus(s6.status || "");
      setRemarks(s6.remarks || "Complaint resolved and closed");
    }
  }, [complaint]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSiteUpload({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      });
    }
  };

  /* ✅ FINAL CLOSE */
  const handleSaveStep6 = async () => {
    if (!status) {
      toast.error("Please select final status");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Closing complaint...");

    try {
      await runTransaction(db, async (tx) => {
        const ref = doc(db, "complaints", complaint.id);
        const snap = await tx.get(ref);

        if (!snap.exists()) throw new Error("Complaint not found");
        if (snap.data().currentStep !== 6)
          throw new Error("Step order violation");

        tx.update(ref, {
          step6_completion: {
            status,
            siteUploadMeta: siteUpload || null,
            remarks,
            actualTime: Timestamp.now(),
          },
          status: "CLOSED",
          isClosed: true,
          updatedAt: Timestamp.now(),
        });
      });

      toast.success("Complaint closed successfully 🎉", { id: toastId });
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error(err.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 text-sm text-slate-700">
      {/* STATUS + FILE */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5">
            <CheckCircle2 size={14} className="text-blue-500" />
            Final Status <span className="text-red-500">*</span>
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={`w-full border rounded-lg py-2 px-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
              !status && "border-red-200"
            } focus:ring-blue-500/20`}
          >
            <option value="" disabled>
              Select Status
            </option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5">
            <UploadCloud size={14} className="text-blue-500" />
            Final Report (Optional)
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full text-[11px] border rounded-lg bg-gray-50"
          />
          {siteUpload && (
            <p className="text-[10px] text-green-600 mt-1 italic">
              ✓ {siteUpload.fileName}
            </p>
          )}
        </div>
      </div>

      {/* RESOLUTION SECTION */}
      <div className="bg-slate-50 border border-blue-100 rounded-lg p-4 relative">
        <div className="absolute top-0 left-0 w-1 bg-blue-500 h-full rounded-l-lg"></div>

        <div className="flex items-center gap-2 mb-4">
          <Clock size={16} className="text-blue-600" />
          <h2 className="text-sm font-bold text-slate-700">
            Resolution Details
          </h2>
        </div>

        <div className="space-y-1">
          <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Edit3 size={12} className="text-blue-400" />
            Final Remarks
          </label>
          <textarea
            rows="3"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full border border-gray-200 rounded-md py-1.5 px-3 text-sm resize-none focus:ring-1 focus:ring-blue-400 focus:outline-none bg-white"
          />
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveStep6}
          disabled={loading}
          className={`px-4 py-2 rounded-lg text-xs font-bold text-white transition-all flex items-center gap-2 ${
            loading
              ? "bg-gray-400"
              : "bg-red-600 hover:bg-red-700 active:scale-95"
          }`}
        >
          <Bookmark size={14} />
          {loading ? "Closing..." : "Close Complaint"}
        </button>
      </div>
    </div>
  );
};
