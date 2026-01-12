import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  Timestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { STEPS } from "../constants/stepsConstant";

/* ======================
   CREATE COMPLAINT
====================== */
export const createComplaint = async (data) => {
  return await addDoc(collection(db, "complaints"), {
    complaintDetails: {
      ...data,
      createdAt: Timestamp.now(),
    },
    step1_assignEngineer: {},
    step2_warrantyCheck: {},
    step3_siteVisit: {},
    step4_consumable: {},
    step5_payment: {},
    step6_completion: {},
    currentStep: STEPS.ASSIGN_ENGINEER,
    status: "OPEN",
  });
};

/* ======================
   STEP 1 – ASSIGN ENGINEER
====================== */
export const assignEngineerStep = async (complaintId, data) => {
  if (!complaintId) {
    throw new Error("Complaint ID is required");
  }

  return await updateDoc(doc(db, "complaints", complaintId), {
    step1_assignEngineer: {
      status: data.status || "Done", // Dropdown
      assignedIsoNo: data.assignedIsoNo || null, // Input / dropdown
      warrantyDate: data.warrantyDate
        ? Timestamp.fromDate(new Date(data.warrantyDate))
        : null,
      division: data.division || null, // Dropdown
      engineer: data.engineer || null, // Dropdown
      nextFollowUpDate: data.nextFollowUpDate
        ? Timestamp.fromDate(new Date(data.nextFollowUpDate))
        : null,
      remarks: data.remarks || null, // Textarea
      actualTime: Timestamp.now(), // Auto (hidden)
    },

    // Move workflow forward
    currentStep: STEPS.WARRANTY_CHECK,
  });
};

/* ======================
   STEP 2 – WARRANTY CHECK
====================== */
export const warrantyCheckStep = async (complaintId, data) => {
  if (!complaintId) {
    throw new Error("Complaint ID is required");
  }

  return await updateDoc(doc(db, "complaints", complaintId), {
    step2_warrantyCheck: {
      status: data.status || "Done", // Done / Pending
      warrantyStatus: data.warrantyStatus || null, // IN-W / OUT-W
      enquiryFormFilled: !!data.enquiryFormFilled, // true / false
      offerSent: !!data.offerSent, // true / false
      nextFollowUpDate: data.nextFollowUpDate
        ? Timestamp.fromDate(new Date(data.nextFollowUpDate))
        : null,
      remarks: data.remarks || null,
      actualTime: Timestamp.now(), // auto
    },

    // Move workflow forward
    currentStep: STEPS.SITE_VISIT,
  });
};

/* ======================
   STEP 3 – SITE VISIT
====================== */
export const siteVisitStep = async (complaintId, data) => {
  if (!complaintId) {
    throw new Error("Complaint ID is required");
  }
  return await updateDoc(doc(db, "complaints", complaintId), {
    step3_siteVisit: {
      status: data.status || "Done",
      nextFollowUpDate: data.nextFollowUpDate
        ? Timestamp.fromDate(new Date(data.nextFollowUpDate))
        : null,
      remarks: data.remarks || null,
      actualTime: Timestamp.now(),
    },
    currentStep: STEPS.CONSUMABLE_CHECK,
  });
};

export const consumableCheckStep = async (complaintId, data) => {
  if (!complaintId) {
    throw new Error("Complaint ID is required");
  }
  return await updateDoc(doc(db, "complaints", complaintId), {
    step4_consumable: {
      consumableRequired:
        data.consumableRequired === "Yes" || data.consumableRequired === true,
      nextFollowUpDate: data.nextFollowUpDate
        ? Timestamp.fromDate(new Date(data.nextFollowUpDate))
        : null,
      remarks: data.remarks || null,
      actualTime: Timestamp.now(),
    },

    // Move workflow forward
    currentStep: STEPS.PAYMENT,
  });
};

/* ======================
   STEP 5 – PAYMENT COLLECTION
====================== */
export const paymentCollectionStep = async (complaintId, data) => {
  if (!complaintId) {
    throw new Error("Complaint ID is required");
  }

  return await updateDoc(doc(db, "complaints", complaintId), {
    step5_payment: {
      paymentCollected:
        data.paymentCollected === "Yes" || data.paymentCollected === true,

      supportDocMeta: data.supportDoc
        ? {
            fileName: data.supportDoc.name,
            fileType: data.supportDoc.type,
            fileSize: data.supportDoc.size,
          }
        : null,

      nextFollowUpDate: data.nextFollowUpDate
        ? Timestamp.fromDate(new Date(data.nextFollowUpDate))
        : null,

      remarks: data.remarks || null,
      actualTime: Timestamp.now(),
    },

    // Move workflow forward
    currentStep: STEPS.COMPLETION,
  });
};

/* ======================
   STEP 6 – COMPLETION / RESOLUTION
====================== */
export const completionStep = async (complaintId, data) => {
  if (!complaintId) {
    throw new Error("Complaint ID is required");
  }

  return await updateDoc(doc(db, "complaints", complaintId), {
    step6_completion: {
      status: data.status || "Done", // Done / Pending / Archive
      siteUploadMeta: data.siteUpload
        ? {
            fileName: data.siteUpload.name,
            fileType: data.siteUpload.type,
            fileSize: data.siteUpload.size,
          }
        : null,

      nextFollowUpDate: data.nextFollowUpDate
        ? Timestamp.fromDate(new Date(data.nextFollowUpDate))
        : null,

      remarks: data.remarks || null,
      actualTime: Timestamp.now(),
    },

    // FINAL STATUS
    status: "CLOSED",
  });
};
