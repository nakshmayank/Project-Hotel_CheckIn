export const printInvoice = async (chkid, axios, invoiceNo = null) => {

  try {
    const res = await axios.get(
      `/api/v1/Hotel/HotelPrintInvoice/${chkid}`,
      {
        responseType: "blob",
      }
    );

    // Create blob URL
    const file = new Blob([res.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);

    // Open in new tab
    const printWindow = window.open(fileURL, "_blank");

    if (printWindow) {
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print(); // opens Ctrl+P dialog
      };
    }
  } catch (err) {
    console.error("Print failed:", err);
  }
};