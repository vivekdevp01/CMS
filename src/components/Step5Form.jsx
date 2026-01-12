import React, { useState, useEffect } from "react";
import {
  Calendar,
  Edit3,
  Clock,
  Bookmark,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { doc, runTransaction, Timestamp } from "firebase/firestore";
import { db } from "../backend/config/firebase";
import toast from "react-hot-toast";

export const Step5Form = ({ complaint, onSuccess }) => {
  const [paymentCollected, setPaymentCollected] = useState("");
  const [supportDoc, setSupportDoc] = useState(null);
  const [nextFollowUpDate, setNextFollowUpDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const s5 = complaint?.step5_payment;
    if (s5) {
      setPaymentCollected(s5.paymentCollected ? "Yes" : "No");
      setNextFollowUpDate(
        s5.nextFollowUpDate?.toDate?.().toISOString().slice(0, 10) || ""
      );
      setRemarks(s5.remarks || "");
    }
  }, [complaint]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSupportDoc({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      });
    }
  };

  const handleSaveStep5 = async () => {
    if (!paymentCollected || !nextFollowUpDate) {
      toast.error("Please fill mandatory fields");
      return;
    }

    setLoading(true);
    const leadRef = doc(db, "complaints", complaint.id);

    const toastId = toast.loading("Saving payment details...");

    try {
      await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(leadRef);
        if (!snap.exists()) throw new Error("Complaint not found");

        const currentStep = snap.data().currentStep;
        if (currentStep !== 5) {
          throw new Error("Step order violation");
        }

        transaction.update(leadRef, {
          step5_payment: {
            paymentCollected: paymentCollected === "Yes",
            supportDocMeta: supportDoc || null,
            plannedTime: Timestamp.now(),
            actualTime: Timestamp.now(),
            nextFollowUpDate: Timestamp.fromDate(new Date(nextFollowUpDate)),
            remarks,
          },
          currentStep: 6,
          updatedAt: Timestamp.now(),
        });
      });

      toast.success("Payment step completed", { id: toastId });
      onSuccess?.(6);
    } catch (err) {
      console.error(err);
      toast.error(`Failed: ${err.message}`, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 space-y-4 text-sm text-slate-700">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-1">
            <CheckCircle2 size={14} className="text-blue-600" />
            Payment Collected *
          </label>
          <select
            value={paymentCollected}
            onChange={(e) => setPaymentCollected(e.target.value)}
            className="w-full border rounded-lg py-2 px-3 text-sm bg-gray-50"
          >
            <option value="" disabled>
              Select...
            </option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-1">
            <FileText size={14} className="text-blue-400" />
            Support Document
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full text-[11px] border rounded-lg bg-gray-50"
          />
        </div>
      </div>

      <div className="bg-slate-50 border border-blue-100 rounded-lg p-4 relative">
        <div className="absolute top-0 left-0 w-1 bg-blue-500 h-full rounded-l-lg"></div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase text-slate-400">
            Next Follow Up *
          </label>
          <input
            type="date"
            value={nextFollowUpDate}
            onChange={(e) => setNextFollowUpDate(e.target.value)}
            className="w-full border rounded-md px-3 py-1.5"
          />

          <label className="text-[10px] font-bold uppercase text-slate-400">
            Remarks
          </label>
          <textarea
            rows="2"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full border rounded-md px-3 py-1.5"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSaveStep5}
          disabled={loading}
          className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-amber-600 hover:bg-amber-700"
        >
          <Bookmark size={14} /> {loading ? "Saving..." : "Save Step 5"}
        </button>
      </div>
    </div>
  );
};
