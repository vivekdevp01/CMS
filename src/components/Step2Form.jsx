import React, { useState, useEffect } from "react";
import { doc, runTransaction, Timestamp } from "firebase/firestore";
import { db } from "../backend/config/firebase";
import {
  Calendar,
  Edit3,
  Clock,
  Bookmark,
  CheckCircle2,
  FileText,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";

export const Step2Form = ({ complaint, onSuccess }) => {
  const [status, setStatus] = useState("");
  const [enquiryFormFilled, setEnquiryFormFilled] = useState("");
  const [offerSent, setOfferSent] = useState("");
  const [warrantyStatus, setWarrantyStatus] = useState("");
  const [nextFollowUpDate, setNextFollowUpDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);

  /* 🔄 Prefill if Step-2 already exists */
  useEffect(() => {
    const s2 = complaint?.step2_warrantyCheck;
    if (s2) {
      setStatus(s2.status || "");
      setWarrantyStatus(s2.warrantyStatus || "");
      setEnquiryFormFilled(s2.enquiryFormFilled ? "Yes" : "No");
      setOfferSent(s2.offerSent ? "Yes" : "No");
      setNextFollowUpDate(
        s2.nextFollowUpDate?.toDate?.().toISOString().slice(0, 10) || ""
      );
      setRemarks(s2.remarks || "");
    }
  }, [complaint]);

  /* ✅ SAVE STEP-2 WITH TRANSACTION + TOAST */
  const handleSaveStep2 = async () => {
    if (
      !status ||
      !warrantyStatus ||
      !enquiryFormFilled ||
      !offerSent ||
      !nextFollowUpDate
    ) {
      toast.error("Please fill all mandatory fields");
      return;
    }

    setLoading(true);
    const leadRef = doc(db, "complaints", complaint.id);
    const toastId = toast.loading("Updating Step 2...");

    try {
      await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(leadRef);

        if (!snap.exists()) {
          throw new Error("Complaint not found");
        }

        const currentStep = snap.data().currentStep || 1;

        /* 🚫 Prevent skipping steps */
        if (currentStep !== 2) {
          throw new Error("Step order violation");
        }

        transaction.update(leadRef, {
          step2_warrantyCheck: {
            status: "Done",
            warrantyStatus,
            enquiryFormFilled: enquiryFormFilled === "Yes",
            offerSent: offerSent === "Yes",
            plannedTime: Timestamp.now(),
            actualTime: Timestamp.now(),
            nextFollowUpDate: Timestamp.fromDate(new Date(nextFollowUpDate)),
            remarks,
          },
          currentStep: 3, // ➡ Move to Step-3
          updatedAt: Timestamp.now(),
        });
      });

      toast.success("Step-2 completed successfully", { id: toastId });
      onSuccess?.(3);
    } catch (err) {
      console.error("Step-2 transaction failed:", err);
      toast.error(`Step-2 failed: ${err.message}`, { id: toastId });
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
          className={`w-full border rounded-lg py-2 px-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
            !status && "border-red-200"
          } focus:ring-blue-500/20`}
        >
          <option value="" disabled>
            Select Option
          </option>
          <option value="Done">Done</option>
        </select>
      </div>

      {/* WARRANTY STATUS */}
      <div>
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5">
          <Users size={14} className="text-blue-500" />
          Warranty Status <span className="text-red-500">*</span>
        </label>
        <select
          value={warrantyStatus}
          onChange={(e) => setWarrantyStatus(e.target.value)}
          className={`w-full border rounded-lg py-2 px-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
            !warrantyStatus && "border-red-200"
          } focus:ring-blue-500/20`}
        >
          <option value="" disabled>
            Select Option
          </option>
          <option value="IN-W">In Warranty</option>
          <option value="OUT-W">Out of Warranty</option>
        </select>
      </div>

      {/* ENQUIRY FORM */}
      <div>
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5">
          <FileText size={14} className="text-blue-500" />
          Enquiry Form Filled <span className="text-red-500">*</span>
        </label>
        <select
          value={enquiryFormFilled}
          onChange={(e) => setEnquiryFormFilled(e.target.value)}
          className={`w-full border rounded-lg py-2 px-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
            !enquiryFormFilled && "border-red-200"
          } focus:ring-blue-500/20`}
        >
          <option value="" disabled>
            Select Option
          </option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      {/* OFFER SENT */}
      <div>
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5">
          <FileText size={14} className="text-blue-500" />
          Offer Sent <span className="text-red-500">*</span>
        </label>
        <select
          value={offerSent}
          onChange={(e) => setOfferSent(e.target.value)}
          className={`w-full border rounded-lg py-2 px-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
            !offerSent && "border-red-200"
          } focus:ring-blue-500/20`}
        >
          <option value="" disabled>
            Select Option
          </option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      {/* FOLLOW UP SECTION */}
      <div className="bg-slate-50 border border-blue-100 rounded-lg p-4 relative">
        <div className="absolute top-0 left-0 w-1 bg-blue-500 h-full rounded-l-lg"></div>

        <div className="flex items-center gap-2 mb-4">
          <Clock size={16} className="text-blue-600" />
          <h2 className="text-sm font-bold text-slate-700">
            Follow up Section
          </h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <Calendar size={12} className="text-blue-400" />
              Next Follow Up Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={nextFollowUpDate}
              onChange={(e) => setNextFollowUpDate(e.target.value)}
              className={`w-full border rounded-md py-1.5 px-3 text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none ${
                !nextFollowUpDate && "border-red-200"
              }`}
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <Edit3 size={12} className="text-blue-400" />
              Remarks
            </label>
            <textarea
              rows="2"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter remarks..."
              className="w-full border border-gray-200 rounded-md py-1.5 px-3 text-sm resize-none focus:ring-1 focus:ring-blue-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveStep2}
          disabled={loading}
          className={`px-4 py-2 rounded-lg text-xs font-bold text-white transition-all flex items-center gap-2 ${
            loading
              ? "bg-gray-400"
              : "bg-amber-600 hover:bg-amber-700 active:scale-95"
          }`}
        >
          <Bookmark size={14} />
          {loading ? "Updating..." : "Update Step 2"}
        </button>
      </div>
    </div>
  );
};
