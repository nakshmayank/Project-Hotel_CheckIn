import { useMemo, useRef, useState, useEffect } from "react";
import {
  Receipt,
  BedDouble,
  Users,
  CalendarDays,
  IndianRupee,
  Download,
  CreditCard,
  Percent,
} from "lucide-react";
import toast from "react-hot-toast";
import InvoicePrint from "../../template/InvoicePrint";
import html2pdf from "html2pdf.js";
import { useAppContext } from "../../context/AppContext";

const Billing = () => {
  const printRef = useRef();

  const { axios } = useAppContext();

  const [generatedInvoice, setGeneratedInvoice] = useState(null);
  const [billStatus, setBillStatus] = useState("draft");
  const [isPaid, setIsPaid] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const chkid = 2123; // dynamic later

  const [billingData, setBillingData] = useState({
    chkid: null,
    stayId: "",
    primaryGuest: "",
    checkIn: "",
    checkOut: "",
    nights: 0,
    stayPeriod: "",
    rooms: [],
    discount: 0,
    advancePaid: 0,
    gstPercent: 18,
  });

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      const [countRes, roomRes] = await Promise.all([
        axios.get(`/api/v1/Hotel/HotelGetBillingCount/${chkid}`),
        axios.get(`/api/v1/Hotel/HotelGetBillingroomdetails/${chkid}`),
      ]);

      const count = countRes.data.output.value[0];
      const rooms = roomRes.data.output.value;

      setBillingData({
        chkid,
        stayId: `STY-${chkid}`,
        primaryGuest: "Guest",
        checkIn: count.stayperiod.split("-")[0],
        checkOut: count.stayperiod.split("-")[1],
        nights: count.Noofstay,
        stayPeriod: count.stayperiod.split("-").join(" - "),
        rooms: rooms.map((r) => ({
          roomNo: r.roomno,
          type: r.roomtype,
          rate: r.rent,
          foodCharges: 0,
          laundry: 0,
          extras: 0,
        })),
        discount: 0,
        advancePaid: 0,
        gstPercent: 18,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load billing data");
    }
  };

  const updateRoom = (roomNo, field, value) => {
    setBillingData((prev) => ({
      ...prev,
      rooms: prev.rooms.map((r) =>
        r.roomNo === roomNo
          ? {
              ...r,
              [field]:
                value === ""
                  ? "" // allow empty while typing
                  : Math.max(0, Number(value)), // prevent negative
            }
          : r,
      ),
    }));
  };

  const calculations = useMemo(() => {
    const roomRentTotal = billingData.rooms.reduce(
      (sum, r) => sum + r.rate * billingData.nights,
      0,
    );

    const extrasTotal = billingData.rooms.reduce(
      (sum, r) => sum + r.foodCharges + r.laundry + r.extras,
      0,
    );

    const subtotal = roomRentTotal + extrasTotal;
    const tax = (subtotal * billingData.gstPercent) / 100;
    const grandTotal = subtotal + tax - billingData.discount;
    const due = grandTotal - billingData.advancePaid;

    return {
      roomRentTotal,
      extrasTotal,
      subtotal,
      tax,
      grandTotal,
      due,
    };
  }, [billingData]);

  const handleGenerateBill = async () => {
    try {
      const payload = {
        chkid: billingData.chkid,
        renttotal: calculations.roomRentTotal,
        addcharges: calculations.extrasTotal,
        discount: billingData.discount,
        gst: calculations.tax,
        advpay: billingData.advancePaid,
        ftotal: calculations.grandTotal,
      };

      const res = await axios.post(`/api/v1/Hotel/HotelCreateBill`, payload);

      const data = res.data.output.value[0];

      const invoiceData = {
        ...billingData,
        ...calculations,
        invoiceNo: data.invoiceno,
        email: data.email,
        date: new Date().toLocaleDateString("en-IN"),
        paid: false,
      };

      setGeneratedInvoice(invoiceData);
      setBillStatus("generated");

      toast.success("Bill generated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create bill");
    }
  };

  const handleDownloadPdf = async () => {
    if (!generatedInvoice) {
      toast.error("Please generate the bill first.");
      return;
    }

    try {
      setIsGeneratingPdf(true);

      const element = printRef.current;

      await html2pdf()
        .set({
          margin: 0.4,
          filename: `${generatedInvoice.invoiceNo}.pdf`,
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        })
        .from(element)
        .save();

      toast.success("Invoice downloaded successfully");
    } catch {
      toast.error("Failed to download invoice");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleMarkAsPaid = () => {
    if (!generatedInvoice) return toast.error("Generate bill first");

    setIsPaid(true);
    setGeneratedInvoice((prev) => ({
      ...prev,
      paid: true,
      paymentDate: new Date().toLocaleDateString("en-IN"),
    }));

    toast.success("Payment marked as paid");
  };

  return (
    <div className="py-12 px-5">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="bg-gray-100/40 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center shadow-md">
              <Receipt className="text-white" size={26} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">Stay Billing</h1>
              <p className="text-sm text-gray-600">
                Generate consolidated invoice for complete stay
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-gray-100/60 p-4 rounded-2xl shadow-md">
              <p className="text-xs text-primary-500 font-medium">Booking ID</p>
              <p className="font-semibold">{billingData.stayId}</p>
            </div>

            <div className="bg-gray-100/60 p-4 rounded-2xl shadow-md">
              <p className="text-xs text-primary-500 font-medium">Bill To</p>
              <p className="font-semibold">{billingData.primaryGuest}</p>
            </div>

            <div className="bg-gray-100/60 p-4 rounded-2xl shadow-md">
              <p className="text-xs text-primary-500 font-medium">Rooms</p>
              <p className="font-semibold">{billingData.rooms.length}</p>
            </div>

            <div className="bg-gray-100/60 p-4 rounded-2xl shadow-md">
              <p className="text-xs text-primary-500 font-medium">Nights</p>
              <p className="font-semibold">{billingData.nights}</p>
            </div>

            <div className="bg-gray-100/60 p-4 rounded-2xl shadow-md">
              <p className="text-xs text-primary-500 font-medium">
                Stay Period
              </p>
              <p className="font-semibold text-sm">{billingData.stayPeriod}</p>
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Rooms */}
          <div className="lg:col-span-2 bg-gray-100/40 p-6 rounded-2xl shadow-lg">
            <h2 className="text-lg font-bold mb-5">
              Room-wise Billing Breakdown
            </h2>

            <div className="space-y-4">
              {billingData.rooms.map((room) => {
                const roomTotal =
                  room.rate * billingData.nights +
                  room.foodCharges +
                  room.laundry +
                  room.extras;

                return (
                  <div
                    key={room.roomNo}
                    className="bg-gray-100/60 p-5 rounded-2xl shadow-md"
                  >
                    <div className="flex justify-between mb-4">
                      <div>
                        <h3 className="font-bold">
                          Room {room.roomNo} • {room.type}
                        </h3>

                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          ₹
                          <input
                            type="number"
                            value={room.rate}
                            min="0"
                            onFocus={(e) => {
                              if (e.target.value === "0") e.target.value = "";
                            }}
                            onBlur={(e) => {
                              if (e.target.value === "") {
                                updateRoom(room.roomNo, "rate", 0);
                              }
                            }}
                            onChange={(e) =>
                              updateRoom(room.roomNo, "rate", e.target.value)
                            }
                            className="w-14 text-primary-500 focus:text-gray-500 rounded-lg text-center border-2 focus:border-primary-500 bg-white outline-none"
                          />
                          / night
                        </p>
                      </div>

                      <div className="text-right">
                        <p>Total</p>
                        <p className="font-bold text-primary-500">
                          ₹ {roomTotal}
                        </p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-4 gap-3">
                      <div className="bg-white p-3 rounded-xl shadow-sm">
                        <p className="text-xs text-gray-500">Room Rent</p>
                        <p className="font-semibold">
                          ₹ {room.rate * billingData.nights}
                        </p>
                      </div>

                      <div className="bg-white p-3 rounded-xl shadow-sm">
                        <p className="text-xs text-gray-500">Food</p>
                        <input
                          type="number"
                          value={room.foodCharges}
                          min="0"
                          onFocus={(e) => {
                            if (e.target.value === "0") e.target.value = "";
                          }}
                          onBlur={(e) => {
                            if (e.target.value === "") {
                              updateRoom(room.roomNo, "foodCharges", 0);
                            }
                          }}
                          onChange={(e) =>
                            updateRoom(
                              room.roomNo,
                              "foodCharges",
                              e.target.value,
                            )
                          }
                          className="font-semibold w-full bg-transparent outline-none"
                        />
                      </div>

                      <div className="bg-white p-3 rounded-xl shadow-sm">
                        <p className="text-xs text-gray-500">Laundry</p>
                        <input
                          type="number"
                          value={room.laundry}
                          min="0"
                          onFocus={(e) => {
                            if (e.target.value === "0") e.target.value = "";
                          }}
                          onBlur={(e) => {
                            if (e.target.value === "") {
                              updateRoom(room.roomNo, "laundry", 0);
                            }
                          }}
                          onChange={(e) =>
                            updateRoom(room.roomNo, "laundry", e.target.value)
                          }
                          className="font-semibold w-full bg-transparent outline-none"
                        />
                      </div>

                      <div className="bg-white p-3 rounded-xl shadow-sm">
                        <p className="text-xs text-gray-500">Extras</p>
                        <input
                          type="number"
                          value={room.extras}
                          min="0"
                          onFocus={(e) => {
                            if (e.target.value === "0") e.target.value = "";
                          }}
                          onBlur={(e) => {
                            if (e.target.value === "") {
                              updateRoom(room.roomNo, "extras", 0);
                            }
                          }}
                          onChange={(e) =>
                            updateRoom(room.roomNo, "extras", e.target.value)
                          }
                          className="font-semibold w-full bg-transparent outline-none"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-100/40 p-6 rounded-2xl shadow-lg h-fit sticky top-24">
            <h2 className="text-lg font-bold mb-5">Invoice Summary</h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span>Room Rent Total</span>
                <span>₹ {calculations.roomRentTotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Additional Charges</span>
                <span>₹ {calculations.extrasTotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Discount</span>
                <input
                  type="number"
                  value={billingData.discount}
                  min="0"
                  onFocus={(e) => {
                    if (e.target.value === "0") e.target.value = "";
                  }}
                  onBlur={(e) => {
                    if (e.target.value === "") {
                      setBillingData((prev) => ({ ...prev, discount: 0 }));
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    setBillingData((prev) => ({
                      ...prev,
                      discount: value === "" ? "" : Math.max(0, Number(value)),
                    }));
                  }}
                  className="w-24 text-right bg-transparent outline-none"
                />
              </div>

              <div className="flex justify-between">
                <span>Advance Paid</span>
                <input
                  type="number"
                  value={billingData.advancePaid}
                  min="0"
                  onFocus={(e) => {
                    if (e.target.value === "0") e.target.value = "";
                  }}
                  onBlur={(e) => {
                    if (e.target.value === "") {
                      setBillingData((prev) => ({
                        ...prev,
                        advancePaid: 0,
                      }));
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    setBillingData((prev) => ({
                      ...prev,
                      advancePaid:
                        value === "" ? "" : Math.max(0, Number(value)),
                    }));
                  }}
                  className="w-24 text-right bg-transparent outline-none"
                />
              </div>

              <div className="flex justify-between">
                <span>GST ({billingData.gstPercent}%)</span>
                <span>₹ {calculations.tax}</span>
              </div>

              <hr />

              <div className="flex justify-between text-lg font-bold text-primary-500">
                <span>Amount Due</span>
                <span>₹ {calculations.due}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={handleGenerateBill}
                className="w-full bg-primary-500 text-white py-3 rounded-2xl font-bold"
              >
                Generate Bill
              </button>

              <button
                onClick={handleMarkAsPaid}
                disabled={isPaid}
                className="w-full py-3 rounded-2xl font-bold bg-green-500 text-white"
              >
                Mark as Paid
              </button>

              <button
                onClick={handleDownloadPdf}
                className="w-full bg-gray-800 text-white py-3 rounded-2xl font-bold"
              >
                Download Invoice PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {generatedInvoice && (
        <div className="fixed -left-[9999px] top-0">
          <InvoicePrint ref={printRef} invoiceData={generatedInvoice} />
        </div>
      )}
    </div>
  );
};

export default Billing;
