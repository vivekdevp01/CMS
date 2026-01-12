export const ComplaintModel = {
  complaintDetails: {
    name: "",
    contactPerson: "",
    registeredContactNo: "",
    address: "",
    product: "",
    natureOfComplaint: "",
    complaintReceivedFrom: "",
    warrantyStatus: "",
    dateOfInstallation: null,
    invoiceMeta: null,
    imageMeta: null,
    createdAt: null,
  },

  step1_assignEngineer: {},
  step2_warrantyCheck: {},
  step3_siteVisit: {},
  step4_consumable: {},
  step5_payment: {},
  step6_completion: {},

  currentStep: 1,
  status: "OPEN",
};
