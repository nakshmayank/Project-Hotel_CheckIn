export const downloadInvoice = async (axios, invoiceNo) => {

  try {
    const res = await axios.get(
      `/api/v1/Hotel/HotelDownloadInvoice/${invoiceNo}`,
      {
        responseType: "blob",
      }
    );

    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;

    link.download = `invoice_${invoiceNo}.pdf`;

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Download failed:", err);
  }
};