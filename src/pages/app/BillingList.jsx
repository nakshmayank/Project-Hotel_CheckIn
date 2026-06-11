import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import {
  Receipt,
  IndianRupee,
  CheckCircle,
  AlertCircle,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";
import { downloadInvoice } from "../../utils/downloadInvoice";

const BillingList = () => {
  const { axios, navigate } = useAppContext();

  const [stays, setStays] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(null);

  useEffect(() => {
    fetchStays();
  }, []);

  const fetchStays = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/api/v1/Hotel/HotelGetArchivedStayList");

      const data = res?.data?.output || [];

      // console.log(data);

      // 🔴 TEMP (replace with backend later)
      // const enriched = data.map((s) => ({
      //   ...s,
      //   isBilled: Math.random() > 0.5,
      //   amount: Math.floor(Math.random() * 4000) + 1500,
      // }));

      setStays(data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load billing data");
    } finally {
      setLoading(false);
    }
  };

  // 🔍 FILTER + SEARCH
  const filtered = stays.filter((s) => {
    // console.log(s.RoomType)
    const match =
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.mobile?.includes(search) ||
      s.RoomType?.includes(search);

    if (filter === "Paid") return s.isBilled && match;
    if (filter === "Unpaid") return !s.isBilled && match;

    return match;
  });

  const handleDownload = async (chkid, invoiceno) => {
    setIsDownloading(chkid);
    try {
      await downloadInvoice(axios, invoiceno);
      toast.success("Invoice downloaded");
    } catch (err) {
      toast.error("Failed to download invoice");
    } finally {
      setIsDownloading(null);
    }
  };

  // 📊 SUMMARY
  const totalRevenue = stays.reduce((sum, s) => sum + s.finaltotal, 0);
  const paid = stays.filter((s) => s.isBilled).length;
  const unpaid = stays.filter((s) => !s.isBilled).length;

  const BillingRowSkeleton = () => {
    return (
      <tr className="border-b border-gray-300/30 animate-pulse">
        <td className="p-4">
          <div className="h-4 w-20 bg-gray-300/50 rounded"></div>
        </td>

        <td className="p-4">
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-300/50 rounded"></div>
            <div className="h-3 w-24 bg-gray-200/60 rounded"></div>
          </div>
        </td>

        <td className="p-4">
          <div className="h-4 w-28 bg-gray-300/50 rounded"></div>
        </td>

        <td className="p-4">
          <div className="h-4 w-40 bg-gray-300/50 rounded"></div>
        </td>

        <td className="p-4">
          <div className="h-4 w-24 bg-gray-300/50 rounded"></div>
        </td>

        <td className="p-4">
          <div className="h-7 w-20 bg-gray-300/50 rounded-full"></div>
        </td>

        <td className="p-4 text-right">
          <div className="h-4 w-24 bg-gray-300/50 rounded ml-auto"></div>
        </td>
      </tr>
    );
  };

  const BillingCardSkeleton = () => {
    return (
      <div className="bg-gray-100/40 p-4 rounded-2xl shadow-md animate-pulse">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-4 w-20 bg-gray-300/50 rounded"></div>
            <div className="h-4 w-28 bg-gray-300/50 rounded"></div>
            <div className="h-3 w-40 bg-gray-200/60 rounded"></div>
          </div>

          <div className="space-y-2 flex flex-col items-end">
            <div className="h-4 w-16 bg-gray-300/50 rounded"></div>
            <div className="h-6 w-14 bg-gray-300/50 rounded-full"></div>
            <div className="h-3 w-20 bg-gray-200/60 rounded"></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="py-12 px-5">
      <div className="mx-auto flex flex-col gap-6">
        {/* 🔷 HEADER */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center shadow-md">
            <Receipt className="text-white" size={26} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Billing Management
            </h1>
            <p className="text-sm text-gray-600">
              Manage invoices and payments for all stays
            </p>
          </div>
        </div>

        {/* 🔷 SUMMARY CARDS */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gray-100/40 p-5 rounded-2xl shadow-md flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <IndianRupee className="text-primary-500" />
            </div>

            <div>
              <p className="text-xs text-gray-500">Today's Revenue</p>
              <p className="text-lg font-bold">₹ {totalRevenue.toFixed(2)}</p>
            </div>
          </div>

          <div className="bg-gray-100/40 p-5 rounded-2xl shadow-md flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <CheckCircle className="text-green-500" />
            </div>

            <div>
              <p className="text-xs text-gray-500">Paid Bills</p>
              <p className="text-lg font-bold text-green-600">{paid}</p>
            </div>
          </div>

          <div className="bg-gray-100/40 p-5 rounded-2xl shadow-md flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <AlertCircle className="text-red-500" />
            </div>

            <div>
              <p className="text-xs text-gray-500">Pending Bills</p>
              <p className="text-lg font-bold text-red-500">{unpaid}</p>
            </div>
          </div>
        </div>

        {/* 🔷 FILTER + SEARCH */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex gap-2">
            {["All", "Paid", "Unpaid"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-sm shadow-md transition ${
                  filter === f
                    ? "bg-primary-500 text-white scale-105"
                    : "bg-white border-2 hover:border-primary-500 hover:scale-95"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 border-2 hover:border-primary-500 bg-gray-100/60 px-4 py-1.5 rounded-full shadow-md">
            <Search
              size={16}
              className="text-gray-500 hover:text-primary-500"
            />
            <input
              type="text"
              placeholder="Search by room, guest or mobile..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm w-56 placeholder:text-primary-500 focus:placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* 🔷 TABLE */}
        <div className="bg-gray-100/40 rounded-2xl shadow-lg overflow-hidden">
          {/* TABLE HEADER */}
          {/* <div className="p-5 border-b border-gray-300/40">
            <h2 className="font-bold text-lg">All Invoices</h2>
          </div> */}

          {/* TABLE CONTENT */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-primary-500 text-xs uppercase">
                <tr className="border-b border-gray-300/40">
                  <th className="p-4 text-left">Stay</th>
                  <th className="p-4 text-left">Guest</th>
                  <th className="p-4 text-left">Rooms</th>
                  <th className="p-4 text-left">Period</th>
                  <th className="p-4 text-left">Amount</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  [...Array(6)].map((_, i) => <BillingRowSkeleton key={i} />)
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-6 text-center text-gray-500">
                      No billing data found
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => (
                    <tr
                      key={s.chkid}
                      className="border-b border-gray-300/30 hover:bg-white/40 transition"
                    >
                      <td className="p-4 font-medium text-gray-800">
                        STY-{s.chkid}
                      </td>

                      <td className="p-4">
                        <p className="font-medium">{s.name}</p>
                        <p className="text-xs text-gray-500">{s.mobile}</p>
                      </td>

                      <td className="p-4 text-gray-700">
                        {s.RoomType.split(",").join(", ")}
                      </td>

                      <td className="p-4 text-gray-600">
                        {new Date(s.chkindate).toLocaleDateString()}
                        <span className=" text-gray-600">
                          {" "}
                          - {new Date(s.chkoutdate).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="p-4 font-medium">
                        ₹ {s.finaltotal.toFixed(2)}
                      </td>

                      <td className="p-4">
                        {s.isBilled ? (
                          <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600 flex items-center gap-1 w-fit">
                            <CheckCircle size={12} />
                            Paid
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-500 flex items-center gap-1 w-fit">
                            <AlertCircle size={12} />
                            Pending
                          </span>
                        )}
                      </td>

                      <td className="p-4 font-medium text-right">
                        {s.isBilled ? (
                          <button
                            onClick={() => {
                              handleDownload(s.chkid, s.invoiceno);
                            }}
                            className="hover:underline text-sm disabled:opacity-60"
                            disabled={isDownloading === s.chkid}
                          >
                            {isDownloading === s.chkid ? (
                              <div className="flex gap-2 items-center">
                                <span className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></span>
                                <span>Downloading..</span>
                              </div>
                            ) : (
                              "Download Invoice"
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              navigate(`/dashboard/billing/${s.chkid}`)
                            }
                            className="hover:underline text-sm"
                          >
                            Generate Bill
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 🔷 MOBILE LIST VIEW */}
          <div className="md:hidden space-y-3">
            {loading
              ? [...Array(4)].map((_, i) => <BillingCardSkeleton key={i} />)
              : filtered.map((s) => (
                  <div
                    key={s.chkid}
                    className="bg-gray-100/40 p-4 rounded-2xl shadow-md flex justify-between items-center"
                  >
                    {/* LEFT */}
                    <div>
                      <p className="font-semibold text-sm text-gray-900">
                        STY-{s.chkid}
                      </p>
                      <p className="text-sm">{s.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(s.chkindate).toLocaleDateString()} -{" "}
                        {new Date(s.chkoutdate).toLocaleDateString()}
                      </p>
                    </div>

                    {/* RIGHT */}
                    <div className="text-right">
                      <p className="font-semibold text-primary-500 text-sm">
                        ₹ {s.finaltotal.toFixed(2)}
                      </p>

                      {s.isBilled ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
                          Paid
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-500">
                          Pending
                        </span>
                      )}

                      <div className="font-medium">
                        {s.isBilled ? (
                          <button
                            onClick={() => handleDownload(s.chkid, s.invoiceno)}
                            className="text-xs mt-1 hover:underline disbaled:opacity-60"
                            disabled={isDownloading === s.chkid}
                          >
                            {isDownloading === s.chkid ? (
                              <div className="flex gap-2 items-center">
                                <span className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></span>
                                <span>Downloading..</span>
                              </div>
                            ) : (
                              "Download Invoice"
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              navigate(`/dashboard/billing/${s.chkid}`)
                            }
                            className="text-xs hover:underline mt-1"
                          >
                            Generate Bill
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingList;
