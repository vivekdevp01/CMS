// import { collection, addDoc, Timestamp } from "firebase/firestore";
// import { db } from "../firebase";

// export async function submitComplaint(formData, files) {
//   const invoiceMeta = files.invoiceCopy
//     ? {
//         fileName: files.invoiceCopy.name,
//         fileType: files.invoiceCopy.type,
//         fileSize: files.invoiceCopy.size,
//       }
//     : { fileName: "", fileType: "", fileSize: 0 };

//   const imageMeta = files.siteImage
//     ? {
//         fileName: files.siteImage.name,
//         fileType: files.siteImage.type,
//         fileSize: files.siteImage.size,
//       }
//     : { fileName: "", fileType: "", fileSize: 0 };

//   await addDoc(collection(db, "complaints"), {
//     name: formData.name,
//     contactPerson: formData.contactPerson,
//     registeredContactNo: formData.registeredContactNo,
//     address: formData.address,
//     product: formData.product,
//     natureOfComplaint: formData.natureOfComplaint,
//     complaintReceivedFrom: formData.complaintReceivedFrom,
//     warrantyStatus: formData.warrantyStatus,
//     dateOfInstallation: Timestamp.fromDate(
//       new Date(formData.dateOfInstallation)
//     ),
//     invoiceMeta,
//     imageMeta,
//     createdAt: Timestamp.now(),
//   });
// }
