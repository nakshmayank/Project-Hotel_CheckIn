import React, { forwardRef } from "react";
import { useAppContext } from "../context/AppContext";

const InvoicePrint = forwardRef(({ invoiceData }, ref) => {
  const {
    invoiceNo,
    date,
    stayId,
    primaryGuest,
    checkIn,
    checkOut,
    nights,
    rooms,
    subtotal,
    tax,
    discount,
    advancePaid,
    due,
  } = invoiceData;

  const { user } = useAppContext();

  return (
    <div
      ref={ref}
      className="bg-white text-gray-900 w-full max-w-4xl mx-auto p-10 print:p-8"
    >
      {/* Header */}
      <div className="border-b-2 border-primary-500 pb-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-primary-500">
              {user?.FullName}
            </h1>
            <p className="text-sm text-gray-500">
              Smart Stay Management
            </p>
          </div>

          <div className="text-right">
            <h2 className="text-2xl font-bold">INVOICE</h2>
            <p className="text-sm text-gray-600 mt-2">
              Invoice No: {invoiceNo}
            </p>
            <p className="text-sm text-gray-600">Date: {date}</p>
            <p className="text-sm text-gray-600">
              Booking ID: {stayId}
            </p>
          </div>
        </div>
      </div>

      {/* Guest Info */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-sm font-semibold text-primary-500 mb-2">
            Bill To
          </h3>
          <p className="font-semibold">{primaryGuest}</p>
          <p className="text-sm text-gray-600">
            Check-In: {checkIn}
          </p>
          <p className="text-sm text-gray-600">
            Check-Out: {checkOut}
          </p>
        </div>

        <div className="text-right">
          <h3 className="text-sm font-semibold text-primary-500 mb-2">
            Stay Summary
          </h3>
          <p className="text-sm">Rooms: {rooms.length}</p>
          <p className="text-sm">Nights: {nights}</p>
        </div>
      </div>

      {/* Table */}
      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="text-left p-3 text-sm">Room</th>
              <th className="text-left p-3 text-sm">Type</th>
              <th className="text-center p-3 text-sm">Nights</th>
              <th className="text-right p-3 text-sm">Rate</th>
              <th className="text-right p-3 text-sm">Extras</th>
              <th className="text-right p-3 text-sm">Amount</th>
            </tr>
          </thead>

          <tbody>
            {rooms.map((room) => {
              const extras =
                room.foodCharges +
                room.laundry +
                room.extras;

              const amount =
                room.rate * nights + extras;

              return (
                <tr key={room.roomNo} className="border-b">
                  <td className="p-3">{room.roomNo}</td>
                  <td className="p-3">{room.type}</td>
                  <td className="p-3 text-center">{nights}</td>
                  <td className="p-3 text-right">
                    ₹ {room.rate}
                  </td>
                  <td className="p-3 text-right">
                    ₹ {extras}
                  </td>
                  <td className="p-3 text-right font-semibold">
                    ₹ {amount}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="flex justify-end">
        <div className="w-80 space-y-3">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹ {subtotal}</span>
          </div>

          <div className="flex justify-between">
            <span>GST</span>
            <span>₹ {tax}</span>
          </div>

          <div className="flex justify-between">
            <span>Discount</span>
            <span>- ₹ {discount}</span>
          </div>

          <div className="flex justify-between">
            <span>Advance Paid</span>
            <span>- ₹ {advancePaid}</span>
          </div>

          <div className="border-t pt-3 flex justify-between text-lg font-bold text-primary-500">
            <span>Amount Due</span>
            <span>₹ {due}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t text-center text-xs text-gray-500">
        Thank you for choosing Inndez • This is a
        system-generated invoice
      </div>
    </div>
  );
});

export default InvoicePrint;