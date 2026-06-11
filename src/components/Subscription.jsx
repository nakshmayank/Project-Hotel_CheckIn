import { useAppContext } from "../context/AppContext";
import { useEffect, useState } from "react";
import {
  ReceiptIndianRupee,
  BarChart3,
  TrendingUp,
  Headphones,
  Crown,
  FileSpreadsheet,
  Users,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import SubscriptionSuccess from "./SubscriptionSuccess";

const Subscription = () => {
  const { setShowSubscription, axios, user, userData } = useAppContext();

  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [plans, setPlans] = useState([]);
  const [checkoutStep, setCheckoutStep] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [invoiceNo, setInvoiceNo] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleContactSupport = () => {
    window.open("https://wa.me/917982634341", "_blank");
  };

  // const pricing = {
  //   pro: {
  //     monthly: 499,
  //     yearly: 4999,
  //   },
  //   business: {
  //     monthly: 799,
  //     yearly: 7999,
  //   },
  // };

  const getPrice = (planName) => {
    const plan = plans.find(
      (p) => p.PName.toLowerCase() === planName.toLowerCase(),
    );

    if (!plan) return "₹0";

    const amount =
      billingCycle === "monthly" ? plan.Amount_monthly : plan.Amount_yearly;

    return amount === 0 ? "Free" : `₹${amount}`;
  };

  // const getAmount = () => {
  //   if (selectedPlan === "pro") {
  //     return billingCycle === "monthly" ? 499 : 4999;
  //   }

  //   if (selectedPlan === "business") {
  //     return billingCycle === "monthly" ? 799 : 7999;
  //   }

  //   return 0;
  // };

  const getPlanId = () => {
    return plans.find(
      (p) => p.PName.toLowerCase() === selectedPlan.toLowerCase(),
    )?.PId;
  };

  const getNumericPrice = () => {
    const plan = plans.find(
      (p) => p.PName.toLowerCase() === selectedPlan.toLowerCase(),
    );

    if (!plan) return 0;

    return billingCycle === "monthly"
      ? plan.Amount_monthly
      : plan.Amount_yearly;
  };

  const subtotal = getNumericPrice();
  const gstAmount = +(subtotal * 0.18).toFixed(2);
  const totalAmount = Math.max(
    subtotal + gstAmount - (subtotal * couponDiscount) / 100,
    0,
  ).toFixed(2);

  const saveBreakup = async () => {
    try {
      const { data } = await axios.post(
        "/api/v1/Hotel/payment/HotelInsertPlanBreakUp",
        {
          pid: Number(getPlanId()),
          baseprice: subtotal,
          gstamount: gstAmount,
          discountamount: (subtotal * couponDiscount) / 100,
          finalamount: totalAmount,
          couponcode: couponCode,
        },
      );

      const breakupId = data?.output[0]?.result;

      return breakupId;
    } catch (error) {
      console.log(error)
    }
  };

  const applyCoupon = async () => {
    try {
      setCouponLoading(true);

      const { data } = await axios.post(
        "/api/v1/Hotel/payment/HotelValidateCoupon",
        {
          couponcode: couponCode,
          pid: Number(getPlanId()),
        },
      );

      if (data?.output[0]?.status === 1) {
        setCouponDiscount(data?.output[0]?.Discountpercent);
      } else {
        setCouponDiscount(0);
      }
      setCouponApplied(true);
    } catch (error) {
      setCouponApplied(false);
      setCouponDiscount(0);
    } finally {
      setCouponLoading(false);
    }
  };

  const createOrder = async () => {
    try {
      const breakupId = await saveBreakup();

      if (!breakupId || breakupId === "0") {
        toast.error(
          "Error in saving the breakup data. Cannot proceed with payment..",
        );
        return;
      }

      const response = await axios.post("/api/v1/Hotel/payment/create-order", {
        plan: Number(getPlanId()),
        billingCycle: billingCycle === "monthly" ? "M" : "Y",
      });

      return {
      ...response.data,
      breakupId,
    };
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpgrade = async () => {
    try {
      if (!window.Razorpay) {
        alert("Payment gateway failed to load");
        return;
      }

      const order = await createOrder();

      const options = {
        key: order.key,

        amount: order.amount,

        currency: order.currency,

        order_id: order.orderId,

        name: "Inndez",

        description: `${selectedPlan} Plan Subscription`,

        handler: async function (response) {
          const verifyResponse = await axios.post(
            "/api/v1/Hotel/payment/verify-payment",
            {
              ...response,
              inndez_PlanId: Number(getPlanId()),
              billingCycle: billingCycle === "monthly" ? "M" : "Y",
              breakupid: Number(order.breakupId),
            },
          );

          if (verifyResponse.data.success) {
            setInvoiceNo(verifyResponse.data.invoiceno);
            toast.success(
              "Congratulations!! Your subscription has been activated..",
            );
            setShowSuccess(true);
          } else {
            toast.error("Payment failed..");
          }

          setCheckoutStep(false);
          setCouponCode("");
          setCouponDiscount(0);
          setCouponApplied(false);
        },

        prefill: {
          name: user.FullName || userData.Name,
          email: user.EmailId || userData.email,
          contact: user.Mobile || userData.mobile,
        },

        theme: {
          color: "#f97316",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getPlans = async () => {
      try {
        const response = await axios.get("/api/v1/Hotel/HotelAllPlans");

        setPlans(response.data.output || []);
      } catch (error) {
        console.error(error);
      }
    };

    getPlans();
  }, []);

  useEffect(() => {
    setCouponCode("");
    setCouponDiscount(0);
    setCouponApplied(false);
  }, [selectedPlan, billingCycle]);

  const mainFeatures = [
    {
      icon: ReceiptIndianRupee,
      title: "GST Billing",
      desc: "Create professional invoices",
    },
    {
      icon: FileSpreadsheet,
      title: "Export Bills",
      desc: "PDF & Excel download",
    },
    {
      icon: BarChart3,
      title: "Reports",
      desc: "Daily & monthly insights",
    },
    {
      icon: TrendingUp,
      title: "Analytics",
      desc: "Track revenue trends",
    },
  ];

  const extraFeatures = [
    { icon: Users, title: "Guest History" },
    { icon: Headphones, title: "Priority Support" },
  ];

  // 🔥 Feature availability per plan
  const featureList = [
    { name: "Check-in / Check-out", starter: true, pro: true, business: true },
    { name: "Room allocation", starter: true, pro: true, business: true },
    { name: "Guest management", starter: true, pro: true, business: true },

    { name: "GST Billing", starter: false, pro: true, business: true },
    { name: "PDF / Excel Export", starter: false, pro: true, business: true },

    { name: "Reports", starter: false, pro: false, business: true },
    { name: "Analytics", starter: false, pro: false, business: true },

    { name: "Guest History", starter: false, pro: true, business: true },
    { name: "Priority Support", starter: false, pro: true, business: true },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={() => setShowSubscription(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl rounded-2xl bg-white/70 backdrop-blur-xl shadow-2xl overflow-hidden"
      >
        <button
          onClick={() => setShowSubscription(false)}
          className="absolute top-3 right-3 rounded-full bg-white/70 hover:bg-white shadow transition"
        >
          <span className="px-2 hover:font-bold hover:text-red-700">×</span>
        </button>
        <div className="h-[636px] grid md:grid-cols-2">
          {/* 🔥 LEFT SIDE (UNCHANGED) */}
          <div className="hidden sm:block p-6 space-y-6">
            {/* Header */}
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <span className="flex items-center gap-2 bg-primary-500/10 text-primary-500 px-3 py-1 rounded-full text-xs font-semibold">
                  <Crown size={14} />
                  PREMIUM PLAN
                </span>
              </div>

              <h2 className="text-xl font-semibold text-gray-900">
                Upgrade your hotel operations
              </h2>

              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Billing, reports & insights — all in one place
              </p>
            </div>

            {/* Highlight */}
            <div className="bg-gradient-to-r from-primary-500/10 to-orange-400/10 border border-primary-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <Sparkles size={18} className="text-primary-500 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Billing & Reports Suite
                  </p>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    Generate invoices, track payments, and monitor your business
                    growth effortlessly
                  </p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              {mainFeatures.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div
                    key={i}
                    className="flex gap-3 items-start bg-white/60 border border-gray-200 rounded-lg p-4"
                  >
                    <Icon size={18} className="text-primary-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {f.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{f.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Extras */}
            <div>
              <p className="text-[11px] uppercase tracking-wide text-gray-800 mb-2">
                Included extras
              </p>

              <div className="flex gap-3 flex-wrap text-xs text-gray-700">
                {extraFeatures.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 bg-gray-100/70 px-3 py-1.5 rounded-full"
                    >
                      <Icon className="text-primary-500" size={14} />
                      {f.title}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 🔥 RIGHT SIDE */}
          {!checkoutStep ? (
            <div className="p-6 border-l border-gray-200 bg-white/40">
              <div className="flex justify-center mb-5">
                <div className="bg-gray-100 p-1 rounded-full flex text-xs relative">
                  {/* Sliding background (modern effect) */}
                  <div
                    className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-white shadow transition-all duration-300 ${
                      billingCycle === "monthly" ? "left-1" : "left-1/2"
                    }`}
                  />

                  <button
                    onClick={() => setBillingCycle("monthly")}
                    className={`relative px-4 py-1.5 rounded-full z-10 transition ${
                      billingCycle === "monthly"
                        ? "text-primary-500 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    Monthly
                  </button>

                  <button
                    onClick={() => setBillingCycle("yearly")}
                    className={`relative px-4 py-1.5 rounded-full z-10 transition ${
                      billingCycle === "yearly"
                        ? "text-primary-500 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    Yearly
                  </button>
                </div>

                {/* Savings badge */}
                <span className="flex items-center ml-2">
                  <span className="text-[10px] bg-green-100 text-green-600 h-fit p-1 rounded-full px-1.5">
                    Save 20%
                  </span>
                </span>
              </div>

              <div></div>

              {/* Plans */}
              <div className="grid grid-cols-3 gap-3 mb-3">
                {/* Starter */}
                <div
                  onClick={() => setSelectedPlan("starter")}
                  className={`cursor-pointer relative rounded-xl p-4 text-center transition-all duration-300 ${
                    selectedPlan === "starter"
                      ? "bg-primary-500/10 border-2 border-primary-500 shadow-lg scale-[1.05] transition-all duration-300 ease-in-out"
                      : "bg-white border border-gray-200 hover:shadow-md"
                  }`}
                >
                  <p className="text-sm font-semibold text-gray-900">Starter</p>
                  <p className="text-xs text-gray-500">Basic</p>
                  <p className="mt-3 text-lg font-semibold">Free</p>
                </div>

                {/* Pro */}
                <div
                  onClick={() => setSelectedPlan("pro")}
                  className={`cursor-pointer relative rounded-xl p-4 text-center transition-all duration-300 ${
                    selectedPlan === "pro"
                      ? "bg-primary-500/10 border-2 border-primary-500 shadow-lg scale-[1.05] transition-all duration-300 ease-in-out"
                      : "bg-white border border-gray-200 hover:shadow-md"
                  }`}
                >
                  {/* Badge stays */}
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] bg-primary-500 text-white px-2 py-0.5 rounded">
                    POPULAR
                  </span>

                  <p className="text-sm font-semibold text-gray-900">Pro</p>
                  <p className="text-xs text-gray-500">Daily ops</p>
                  <p className="mt-3 text-lg font-semibold text-primary-600">
                    {getPrice("pro")}
                    <span className="text-xs text-gray-500">
                      {billingCycle === "monthly" ? "/mo" : "/yr"}
                    </span>
                  </p>
                </div>

                {/* Business */}
                <div
                  onClick={() => setSelectedPlan("business")}
                  className={`cursor-pointer relative rounded-xl p-4 text-center transition-all duration-300 ${
                    selectedPlan === "business"
                      ? "bg-primary-500/10 border-2 border-primary-500 shadow-lg scale-[1.05] transition-all duration-300 ease-in-out"
                      : "bg-white border border-gray-200 hover:shadow-md"
                  }`}
                >
                  <p className="text-sm font-semibold text-gray-900">
                    Business
                  </p>
                  <p className="text-xs text-gray-500">Insights</p>
                  <p className="mt-3 text-lg font-semibold">
                    {getPrice("business")}
                    <span className="text-xs text-gray-500">
                      {billingCycle === "monthly" ? "/mo" : "/yr"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Feature Comparison */}
              <div className="flex justify-between">
                {/* LEFT: Feature names */}
                <div className="space-y-3 py-2 text-sm flex-1">
                  {featureList.map((f, i) => (
                    <div key={i} className="h-6 flex items-center">
                      <span className="text-gray-800">{f.name}</span>
                    </div>
                  ))}
                </div>

                <div className="relative h-full py-2 w-[120px]">
                  <div
                    className={`absolute top-0 bottom-0 w-1/3 rounded-2xl bg-primary-500/10 border border-primary-500 transition-all duration-300 ${
                      selectedPlan === "starter"
                        ? "left-0"
                        : selectedPlan === "pro"
                          ? "left-1/3"
                          : "left-2/3"
                    }`}
                  />

                  {/* Indicators list */}
                  <div className="space-y-3 text-xs flex flex-col text-center relative z-10">
                    {featureList.map((f, i) => (
                      <div
                        key={i}
                        className="h-6 grid grid-cols-3 items-center justify-center"
                      >
                        {/* Starter */}
                        <span
                          className={`transition ${
                            f.starter
                              ? selectedPlan === "starter"
                                ? "text-primary-500 scale-125 font-bold"
                                : "text-green-500"
                              : "text-gray-400"
                          }`}
                        >
                          {f.starter ? "✔" : "-"}
                        </span>

                        {/* Pro */}
                        <span
                          className={`transition ${
                            f.pro
                              ? selectedPlan === "pro"
                                ? "text-primary-500 scale-125 font-bold"
                                : "text-green-500"
                              : "text-gray-400"
                          }`}
                        >
                          {f.pro ? "✔" : "-"}
                        </span>

                        {/* Business */}
                        <span
                          className={`transition ${
                            f.business
                              ? selectedPlan === "business"
                                ? "text-primary-500 scale-125 font-bold"
                                : "text-green-500"
                              : "text-gray-400"
                          }`}
                        >
                          {f.business ? "✔" : "-"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => {
                  if (selectedPlan === "starter") {
                    setShowSubscription(false);
                    return;
                  }

                  setCheckoutStep(true);
                }}
                className="w-full mt-3 bg-primary-500 text-white py-2.5 rounded-full font-medium hover:scale-[1.02] transition"
              >
                {selectedPlan === "starter"
                  ? "Continue with Free"
                  : selectedPlan === "business"
                    ? "Upgrade to Business"
                    : "Upgrade to Pro"}
              </button>

              <p className="text-xs text-center text-gray-500 mt-2">
                Cancel anytime • No hidden charges
              </p>
            </div>
          ) : (
            <div className="p-6 border-l border-gray-200 bg-white/40 flex flex-col justify-between">
              <div>
                <button
                  onClick={() => setCheckoutStep(false)}
                  className="w-fit flex gap-1 items-center text-sm mb-4"
                >
                  <img
                    className="w-4 hover:-translate-x-1 transition-all duration-300"
                    src="/back2.png"
                    alt=""
                  />
                  {/* <span className="text-primary-500 hover:font-medium">Back</span> */}
                </button>

                <h2 className="text-xl text-primary-500 font-semibold">
                  Checkout Summary
                </h2>

                <p className="text-sm text-gray-500 mt-0.5">
                  Review your subscription
                </p>

                <div className="mt-3 bg-gradient-to-r from-primary-500/10 to-orange-400/10 rounded-xl border border-primary-200 p-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium capitalize">{selectedPlan}</p>

                      <p className="text-xs text-gray-500">{billingCycle}</p>
                    </div>

                    <p className="font-semibold">₹{subtotal}</p>
                  </div>
                </div>

                <div className="border-t mt-4 border-dashed border-white/60"></div>

                {/* Coupon */}

                <div className="mt-3">
                  <label className="text-sm font-medium">Coupon Code</label>

                  <div className="flex gap-2 mt-0.5">
                    <input
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(e.target.value.toUpperCase())
                      }
                      placeholder="Enter coupon code"
                      className="w-full border-2 p-2 rounded-lg outline-none placeholder:text-primary-500 focus:placeholder:text-gray-400 focus:shadow-md focus:border-primary-500"
                    />

                    <button
                      onClick={applyCoupon}
                      disabled={couponLoading}
                      className="bg-primary-500 text-white my-0.5 px-5 rounded-full"
                    >
                      {couponLoading ? "..." : "Apply"}
                    </button>
                  </div>

                  {couponApplied ? couponDiscount > 0 ?  (
                    <p className="text-green-600 text-sm mt-2">
                      Coupon applied
                    </p>
                  ) : (
                    <p className="text-red-600 text-sm mt-2">
                      Invalid or expired coupon
                    </p>
                  ) : ""}
                </div>

                <div className="border-t mt-4 border-dashed border-white/60"></div>

                {/* Price Breakdown */}

                <div className="mt-4 text-sm bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between mb-3">
                    <span>Plan Price</span>
                    <span>₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between mb-3">
                    <span>GST (18%)</span>
                    <span>₹{gstAmount}</span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between mb-3 text-green-600">
                      <span>Discount</span>
                      <span>-₹{(subtotal * couponDiscount) / 100}</span>
                    </div>
                  )}

                  <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Benefits */}

              {/* <div className="mt-5 space-y-2 text-sm text-gray-600">
                <div>✓ GST Invoice Included</div>

                <div>✓ Instant Activation</div>

                <div>✓ Secure Razorpay Payment</div>

                <div>✓ Cancel Anytime</div>
              </div> */}

              <div>
                <button
                  onClick={handleUpgrade}
                  className="mt-5 w-full bg-primary-500 text-white py-2.5 rounded-full font-medium"
                >
                  Proceed To Payment
                </button>
                <p className="text-xs text-center text-gray-500 mt-2">
                  Cancel anytime • Secure Razorpay Payment
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {showSuccess && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
                <SubscriptionSuccess
                  setShowSuccess={setShowSuccess}
                  invoiceNo={invoiceNo}
                />
              </div>
            )}
    </div>
  );
};

export default Subscription;
