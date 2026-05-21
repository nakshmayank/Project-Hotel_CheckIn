import { useMemo, useState, useEffect, useRef } from "react";
import { Receipt } from "lucide-react";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import { printInvoice } from "../../utils/printInvoice.js";
import BillingSuccess from "../../components/BillingSuccess.jsx";

const Billing = () => {
  const { axios, navigate } = useAppContext();

  const [generatedInvoice, setGeneratedInvoice] = useState(null);
  // const [billStatus, setBillStatus] = useState("draft");
  // const [isPaid, setIsPaid] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isBilled, setIsBilled] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [discountInput, setDiscountInput] = useState("");
  const [discountPercentInput, setDiscountPercentInput] = useState("");
  const [isGeneratingBill, setIsGeneratingBill] = useState(false);
  const [loading, setLoading] = useState(false);

  const firstRoomRentRef = useRef(null);

  const { chkid } = useParams();

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
    if (chkid) {
      fetchBillingData();
    }
  }, [chkid]);

  const fetchBillingData = async () => {
    try {
      setLoading(true);

      const [countRes, roomRes] = await Promise.all([
        axios.get(`/api/v1/Hotel/HotelGetBillingCount/${chkid}`),
        axios.get(`/api/v1/Hotel/HotelGetBillingroomdetails/${chkid}`),
      ]);

      const count = countRes?.data?.output?.[0] || {};
      const rooms = roomRes?.data?.output || [];

      const stayPeriodRaw = count?.stayperiod || "";
      const [start, end] = stayPeriodRaw.split("-");

      setBillingData({
        chkid,
        stayId: `STY-${chkid}`,
        primaryGuest: "Guest",
        checkIn: start || "",
        checkOut: end || "",
        nights: count.Noofstay || 0,
        stayPeriod: start && end ? `${start} - ${end}` : "",
        rooms: rooms.map((r) => ({
          rcid: r.rcid,
          roomNo: r.roomno,
          type: r.roomtype,
          rate: r.rent,
          days: r.days,
          checkOutDate: r.checkoutdate,
          totalCost: r.totalcost,
          foodCharges: 0,
          laundry: 0,
          extras: 0,
        })),
        discount: 0,
        advancePaid: count.advancepay,
        gstPercent: 18,
      });

      setDiscountInput("0");
      setDiscountPercentInput("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to load billing data");
    } finally {
      setLoading(false);
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

    const rentExtra = roomRentTotal + extrasTotal;

    const tax = (rentExtra * billingData.gstPercent) / 100;

    const subtotal = roomRentTotal + extrasTotal + tax;
    const grandTotal = subtotal - billingData.discount;
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

  const baseAmount = calculations.subtotal;

  const handleDiscountPercentChange = (value) => {
    setDiscountPercentInput(value);

    if (value === "") {
      setDiscountPercent("");
      setBillingData((prev) => ({ ...prev, discount: "" }));
      setDiscountInput("");
      return;
    }

    const percent = Math.max(0, Number(value));
    const roundedPercent = Number(percent.toFixed(2));

    setDiscountPercent(roundedPercent);

    const discountValue = Number(
      ((baseAmount * roundedPercent) / 100).toFixed(2),
    );

    setBillingData((prev) => ({
      ...prev,
      discount: discountValue,
    }));

    setDiscountInput(discountValue.toFixed(2));
  };

  const handleDiscountValueChange = (value) => {
    setDiscountInput(value);

    if (value === "") {
      setBillingData((prev) => ({ ...prev, discount: "" }));
      setDiscountPercentInput("");
      return;
    }

    const amount = Math.max(0, Number(value));

    setBillingData((prev) => ({
      ...prev,
      discount: amount,
    }));

    if (baseAmount === 0) return;

    const percent = (amount / baseAmount) * 100;
    const roundedPercent = Number(percent.toFixed(2));

    setDiscountPercent(roundedPercent);
    setDiscountPercentInput(roundedPercent.toString());
  };

  const handleGenerateBill = async () => {
    setIsGeneratingBill(true);
    try {
      const payload = {
        chkid: billingData.chkid,
        renttotal: calculations.roomRentTotal,
        addcharges: calculations.extrasTotal,
        discount: billingData.discount,
        gst: calculations.tax,
        advpay: billingData.advancePaid,
        ftotal: Math.round(calculations.due),
        _roomwisedetails: billingData.rooms.map((r) => ({
          rcid: r.rcid,
          rent: r.rate,
          extracost: r.foodCharges + r.laundry + r.extras,
          stotal:
            r.rate * billingData.nights + r.foodCharges + r.laundry + r.extras,
        })),
      };

      const res = await axios.post(`/api/v1/Hotel/HotelCreateBill`, payload);

      const data = res.data.output[0];

      if (data) {
        setGeneratedInvoice({
          invoiceNo: data.invoiceno,
        });
        // setBillStatus("generated");
        // navigate("/dashboard/billing-list");

        toast.success("Bill generated successfully");
      } else {
        toast.error("Bill already generated");
      }
      setShowSuccess(true);
      setIsBilled(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create bill");
    } finally {
      setIsGeneratingBill(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!isBilled && !generatedInvoice) {
      toast.error("Please generate the bill first");
      return;
    }

    try {
      setIsGeneratingPdf(true);

      // const element = printRef.current;

      // await html2pdf()
      //   .set({
      //     margin: 0.4,
      //     filename: `${generatedInvoice.invoiceNo}.pdf`,
      //     html2canvas: { scale: 2, useCORS: true },
      //     jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      //   })
      //   .from(element)
      //   .save();

      await printInvoice(
        billingData.chkid,
        axios,
        generatedInvoice?.invoiceNo,
      );

      toast.success("Invoice downloaded");
    } catch {
      toast.error("Failed to download invoice");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // const handleMarkAsPaid = () => {
  //   if (!generatedInvoice) return toast.error("Generate bill first");

  //   setIsPaid(true);
  //   setGeneratedInvoice((prev) => ({
  //     ...prev,
  //     paid: true,
  //     paymentDate: new Date().toLocaleDateString("en-IN"),
  //   }));

  //   toast.success("Payment marked as paid");
  // };

  const hasFocused = useRef(false);

  useEffect(() => {
    if (billingData.rooms.length > 0 && !hasFocused.current) {
      firstRoomRentRef.current?.focus();
      hasFocused.current = true;
    }
  }, [billingData.rooms]);

  const RoomBreakdownSkeleton = () => {
    return (
      <div className="bg-gray-100/60 p-5 rounded-2xl shadow-md animate-pulse">
        {/* top */}
        <div className="flex justify-between mb-4">
          <div className="space-y-2">
            <div className="h-5 w-40 bg-gray-300/50 rounded"></div>
            <div className="h-3 w-28 bg-gray-200/60 rounded"></div>
            <div className="h-8 w-24 bg-gray-300/40 rounded-lg"></div>
          </div>

          <div className="space-y-2 flex flex-col items-end">
            <div className="h-4 w-12 bg-gray-200/60 rounded"></div>
            <div className="h-5 w-24 bg-gray-300/50 rounded"></div>
          </div>
        </div>

        {/* bottom cards */}
        <div className="grid sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-white p-3 rounded-xl shadow-sm border border-gray-200"
            >
              <div className="space-y-2">
                <div className="h-3 w-16 bg-gray-200/60 rounded"></div>
                <div className="h-5 w-full bg-gray-300/50 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="py-12 px-5">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <button
          onClick={() => navigate("/dashboard/billing-list")}
          className=" text-primary-500 flex gap-1 items-center text-sm"
        >
          <img
            className="w-4 hover:-translate-x-1 transition-all duration-300"
            src="/back2.png"
            alt="back"
          />
          <span className="hover:font-medium">Back to Billing List</span>
        </button>

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
              {loading
                ? [...Array(3)].map((_, i) => <RoomBreakdownSkeleton key={i} />)
                : billingData.rooms
                    .sort((a, b) => a.roomNo - b.roomNo)
                    .map((room, index) => {
                      const roomTotal =
                        room.rate * billingData.nights +
                        room.foodCharges +
                        room.laundry +
                        room.extras;

                      return (
                        <div
                          key={index}
                          className="bg-gray-100/60 p-5 rounded-2xl shadow-md"
                        >
                          <div className="flex justify-between mb-4">
                            <div>
                              <h3 className="font-bold">
                                Room {room.roomNo} • {room.type}
                              </h3>
                              <p className="text-xs text-gray-500 mb-2">
                                Checked out on {room.checkOutDate}
                              </p>

                              <p className="text-sm text-gray-500 flex items-center gap-1">
                                ₹
                                <input
                                  type="number"
                                  ref={index === 0 ? firstRoomRentRef : null}
                                  value={room.rate}
                                  min="0"
                                  tabIndex={index * 4 + 1}
                                  onFocus={(e) => {
                                    if (e.target.value === "0")
                                      e.target.value = "";
                                  }}
                                  onBlur={(e) => {
                                    if (e.target.value === "") {
                                      updateRoom(room.roomNo, "rate", 0);
                                    }
                                  }}
                                  onChange={(e) =>
                                    updateRoom(
                                      room.roomNo,
                                      "rate",
                                      e.target.value,
                                    )
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
                            <div className="bg-white p-3 rounded-xl border-2 hover:border-primary-500 text-primary-500 hover:text-gray-500 shadow-sm">
                              <p className="text-xs">Room Rent</p>
                              <p className="font-semibold text-black">
                                ₹ {room.rate * billingData.nights}
                              </p>
                            </div>

                            <div className="bg-white border-2 hover:border-primary-500 text-primary-500 hover:text-gray-500 p-3 rounded-xl shadow-sm">
                              <p className="text-xs">Food</p>
                              <input
                                type="number"
                                value={room.foodCharges}
                                min="0"
                                tabIndex={index * 4 + 2}
                                onFocus={(e) => {
                                  if (e.target.value === "0")
                                    e.target.value = "";
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
                                className="font-semibold w-full text-black bg-transparent outline-none"
                              />
                            </div>

                            <div className="bg-white border-2 hover:border-primary-500 text-primary-500 hover:text-gray-500 p-3 rounded-xl shadow-sm">
                              <p className="text-xs">Laundry</p>
                              <input
                                type="number"
                                value={room.laundry}
                                min="0"
                                tabIndex={index * 4 + 3}
                                onFocus={(e) => {
                                  if (e.target.value === "0")
                                    e.target.value = "";
                                }}
                                onBlur={(e) => {
                                  if (e.target.value === "") {
                                    updateRoom(room.roomNo, "laundry", 0);
                                  }
                                }}
                                onChange={(e) =>
                                  updateRoom(
                                    room.roomNo,
                                    "laundry",
                                    e.target.value,
                                  )
                                }
                                className="font-semibold w-full text-black bg-transparent outline-none"
                              />
                            </div>

                            <div className="bg-white border-2 hover:border-primary-500 text-primary-500 hover:text-gray-500 p-3 rounded-xl shadow-sm">
                              <p className="text-xs">Extras</p>
                              <input
                                type="number"
                                value={room.extras}
                                min="0"
                                tabIndex={index * 4 + 4}
                                onFocus={(e) => {
                                  if (e.target.value === "0")
                                    e.target.value = "";
                                }}
                                onBlur={(e) => {
                                  if (e.target.value === "") {
                                    updateRoom(room.roomNo, "extras", 0);
                                  }
                                }}
                                onChange={(e) =>
                                  updateRoom(
                                    room.roomNo,
                                    "extras",
                                    e.target.value,
                                  )
                                }
                                className="font-semibold text-black w-full bg-transparent outline-none"
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
                <span>₹ {calculations.roomRentTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Additional Charges</span>
                <span>₹ {calculations.extrasTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>GST ({billingData.gstPercent}%)</span>
                <span>₹ {calculations.tax.toFixed(2)}</span>
              </div>

              <div className="border-t border-dashed border-gray-400"></div>

              <div className="flex justify-between">
                <p>Subtotal</p>
                <p>₹ {calculations.subtotal.toFixed(2)}</p>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-1 items-center">
                  <span>Discount</span>

                  {/* % input */}
                  <div>
                    <input
                      type="number"
                      value={discountPercentInput}
                      min="0"
                      placeholder="0"
                      onChange={(e) =>
                        handleDiscountPercentChange(e.target.value)
                      }
                      className="text-center border-2 rounded-lg bg-white placeholder:text-primary-500 focus:placeholder:text-gray-600 focus:border-primary-500 outline-none"
                      style={{
                        width: `${Math.max(discountPercentInput.length, 3)}ch`,
                        minWidth: "2ch",
                      }}
                    />

                    <span className="ml-1">%</span>
                  </div>
                </div>

                {/* ₹ input */}
                <div className="flex items-center gap-1">
                  - ₹
                  <input
                    type="number"
                    value={discountInput}
                    min="0"
                    placeholder="0.00"
                    onFocus={(e) => {
                      if (e.target.value === "0") e.target.value = "";
                    }}
                    onBlur={() => {
                      if (discountInput === "") {
                        handleDiscountValueChange(0);
                      } else {
                        // setDiscountInput(Number(discountInput).toFixed(2));
                        const formatted = Number(discountInput).toFixed(2);

                        setDiscountInput(formatted);

                        setBillingData((prev) => ({
                          ...prev,
                          discount: Number(formatted),
                        }));
                      }
                    }}
                    onChange={(e) => handleDiscountValueChange(e.target.value)}
                    className="text-right border-2 pr-1 rounded-lg bg-white text-primary-500 focus:text-gray-600 focus:border-primary-500 outline-none"
                    style={{
                      width: `${Math.max(discountInput.length, 3)}ch`,
                      minWidth: "5ch",
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <span>Advance Paid</span>
                {/* <input
                  type="number"
                  value={billingData.advancePaid.toFixed(2)}
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
                /> */}
                <span>- ₹ {billingData.advancePaid.toFixed(2)}</span>
              </div>

              <div className="bg-gray-400 h-px"></div>

              <div className="flex justify-between text-lg font-bold text-primary-500">
                <span>Amount Due</span>
                <span>₹ {Math.round(calculations.due).toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              {isBilled || generatedInvoice ? (
                <button
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="w-full bg-gray-800 text-white py-3 flex justify-center rounded-full font-bold"
                >
                  {isGeneratingPdf ? (
                    <div className="flex gap-2 items-center">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Downloading..</span>
                    </div>
                  ) : (
                    "Download Invoice"
                  )}
                </button>
              ) : (
                <button
                  onClick={handleGenerateBill}
                  className="w-full bg-primary-500 text-white py-3 flex justify-center rounded-full font-bold"
                >
                  {isGeneratingBill ? (
                    <div className="flex gap-2 items-center">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Generating..</span>
                    </div>
                  ) : (
                    "Generate Bill"
                  )}
                </button>
              )}

              {/* <button
                onClick={handleMarkAsPaid}
                disabled={isPaid}
                className="w-full py-3 rounded-2xl font-bold bg-green-500 text-white"
              >
                Mark as Paid
              </button> */}
            </div>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <BillingSuccess
            setShowSuccess={setShowSuccess}
            invoiceNo={generatedInvoice?.invoiceNo}
            onDownload={handleDownloadPdf}
            isGeneratingPdf={isGeneratingPdf}
          />
        </div>
      )}
    </div>
  );
};

export default Billing;
