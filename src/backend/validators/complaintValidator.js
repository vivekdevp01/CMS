export const validateComplaintCreate = (data) => {
  if (!data.name) throw new Error("Name required");
  if (!data.contactPerson) throw new Error("Contact person required");
  if (!data.product) throw new Error("Product required");
  if (!data.natureOfComplaint) throw new Error("Nature of complaint required");
};
