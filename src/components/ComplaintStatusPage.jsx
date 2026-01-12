import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../backend/config/firebase";
import { getPendingDays } from "../backend/utils/pendingDays";
import { getTimeDelay } from "../backend/utils/timeDelay";

const StepCard = ({ title, step }) => {
  const pendingDays = getPendingDays(step?.nextFollowUpDate);
  const delayHours = getTimeDelay(step?.plannedTime, step?.actualTime);

  const delayColor =
    delayHours === "—"
      ? "text-gray-400"
      : delayHours === 0
      ? "text-green-600"
      : "text-red-600";

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h3 className="font-bold text-indigo-600 mb-2">{title}</h3>

      <p>
        Status: <b>{step?.status || "—"}</b>
      </p>

      <p>
        Planned Time:{" "}
        {step?.plannedTime ? step.plannedTime.toDate().toLocaleString() : "—"}
      </p>

      <p>
        Actual Time:{" "}
        {step?.actualTime ? step.actualTime.toDate().toLocaleString() : "—"}
      </p>

      <p className={delayColor}>
        Delay (hrs): <b>{delayHours}</b>
      </p>

      <p>
        Next Follow-up:{" "}
        {step?.nextFollowUpDate
          ? step.nextFollowUpDate.toDate().toDateString()
          : "—"}
      </p>

      <p>
        Pending Days: <b>{pendingDays}</b>
      </p>

      <p className="mt-1 text-sm text-gray-600">
        Remarks: {step?.remarks || "—"}
      </p>
    </div>
  );
};

const ComplaintStatusPage = () => {
  const [complaint, setComplaint] = useState(null);

  useEffect(() => {
    const fetchComplaint = async () => {
      const ref = doc(db, "complaints", "V0OsujXIz3XNkyWU5Voe"); // 👈 change ID if needed
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setComplaint(snap.data());
      }
    };

    fetchComplaint();
  }, []);

  if (!complaint) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Complaint Time Validation Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        <StepCard
          title="Step-1 Assign Engineer"
          step={complaint.step1_assignEngineer}
        />
        <StepCard
          title="Step-2 Warranty Check"
          step={complaint.step2_warrantyCheck}
        />
        <StepCard title="Step-3 Site Visit" step={complaint.step3_siteVisit} />
        <StepCard
          title="Step-4 Consumable Check"
          step={complaint.step4_consumable}
        />
        <StepCard title="Step-5 Payment" step={complaint.step5_payment} />
        <StepCard title="Step-6 Completion" step={complaint.step6_completion} />
      </div>
    </div>
  );
};

export default ComplaintStatusPage;
