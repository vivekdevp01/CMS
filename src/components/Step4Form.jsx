import React, { useState, useEffect } from "react";
import { doc, runTransaction, Timestamp } from "firebase/firestore";
import { db } from "../backend/config/firebase";
import toast from "react-hot-toast";
import { Calendar, Edit3, Clock, Bookmark, CheckCircle2 } from "lucide-react";

export const Step4Form = ({ complaint, onSuccess }) => {
  const [consumableRequired, setConsumableRequired] = useState("");
  const [nextFollowUpDate, setNextFollowUpDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);

  /* 🔄 Prefill if Step-4 already exists */
  useEffect(() => {
    const s4 = complaint?.step4_consumable;
    if (s4) {
      setConsumableRequired(s4.consumableRequired ? "Yes" : "No");
      setNextFollowUpDate(
        s4.nextFollowUpDate?.toDate?.().toISOString().slice(0, 10) || ""
      );
      setRemarks(s4.remarks || "");
    }
  }, [complaint]);

  /* ✅ SAVE STEP-4 WITH TRANSACTION */
  const handleSaveStep4 = async () => {
    if (!consumableRequired || !nextFollowUpDate) {
      toast.error("Please fill all mandatory fields");
      return;
    }

    setLoading(true);
    const leadRef = doc(db, "complaints", complaint.id);

    try {
      await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(leadRef);
        if (!snap.exists()) throw new Error("Complaint not found");

        const currentStep = snap.data().currentStep || 1;

        /* 🚫 Prevent step skipping */
        if (currentStep !== 4) {
          throw new Error("Step order violation");
        }

        transaction.update(leadRef, {
          step4_consumable: {
            consumableRequired: consumableRequired === "Yes",
            plannedTime: Timestamp.now(),
            actualTime: Timestamp.now(),
            nextFollowUpDate: Timestamp.fromDate(new Date(nextFollowUpDate)),
            remarks,
          },
          currentStep: 5, // ➡ Move to Step-5
          updatedAt: Timestamp.now(),
        });
      });

      toast.success("Step-4 completed successfully");
      onSuccess?.(5);
    } catch (err) {
      console.error("Step-4 transaction failed:", err);
      toast.error(err.message || "Step-4 failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 text-sm text-slate-700">
      {/* CONSUMABLE REQUIRED */}
      <div>
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5">
          <CheckCircle2 size={14} className="text-blue-500" />
          Consumable Required <span className="text-red-500">*</span>
        </label>
        <select
          value={consumableRequired}
          onChange={(e) => setConsumableRequired(e.target.value)}
          className={`w-full border rounded-lg py-2 px-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
            !consumableRequired && "border-red-200"
          } focus:ring-blue-500/20`}
          required
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
              required
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
              placeholder="Enter notes..."
              className="w-full border border-gray-200 rounded-md py-1.5 px-3 text-sm resize-none focus:ring-1 focus:ring-blue-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveStep4}
          disabled={loading}
          className={`px-4 py-2 rounded-lg text-xs font-bold text-white flex items-center gap-2 transition-all ${
            loading
              ? "bg-gray-400"
              : "bg-amber-600 hover:bg-amber-700 active:scale-95"
          }`}
        >
          <Bookmark size={14} />
          {loading ? "Updating..." : "Update Step 4"}
        </button>
      </div>
    </div>
  );
};
