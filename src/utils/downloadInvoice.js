export const downloadInvoice = async (chkid, axios, invoiceNo = null) => {

  try {
    const res = await axios.get(
      `/api/v1/Hotel/HotelPrintInvoice/${chkid}`,
      {
        responseType: "blob",
      }
    );

    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;

    link.download = invoiceNo
      ? `invoice_${invoiceNo}.pdf`
      : `invoice_${chkid}.pdf`;

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Download failed:", err);
  }
};