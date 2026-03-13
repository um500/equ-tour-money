"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { currencyList, CurrencyType } from "@/lib/currencyList";

const Select = dynamic(() => import("react-select"), { ssr: false });

interface Props {
  currency: CurrencyType;
  buyRate: number;
  sellRate: number;
  amount: number;
  onClose: () => void;
}

export default function ExchangeModal({
  currency,
  buyRate,
  sellRate,
  onClose,
}: Props) {

  const [transactionType, setTransactionType] =
    useState<"buy" | "sell">("buy");

  const [city, setCity] = useState("");

  const [from, setFrom] = useState("INR");
  const [to, setTo] = useState(currency.code);

  const [liveRate, setLiveRate] = useState(buyRate);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    amount: "",
    address: "",
  });

  /* BUY / SELL LOGIC */

  useEffect(() => {

    if (transactionType === "buy") {
      setFrom("INR");
      setTo(currency.code);
      setLiveRate(buyRate);
    } else {
      setFrom(currency.code);
      setTo("INR");
      setLiveRate(sellRate);
    }

  }, [transactionType, currency.code, buyRate, sellRate]);

  /* FORM CHANGE */

  const handleChange = (e: any) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  /* SUBMIT */

  const handleSubmit = async (e: any) => {

    e.preventDefault();

    const res = await fetch("/api/exchange", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        ...formData,
        city,
        from,
        to,
        rate: liveRate,
        type: transactionType,
      }),

    });

    const data = await res.json();

    if (data.success && data.whatsapp) {

      window.open(data.whatsapp, "_blank");
      onClose();

    }

  };

  /* CURRENCY OPTIONS */

  const currencyOptions = currencyList
    .filter((c) => c.code !== "INR")
    .map((c) => ({
      value: c.code,
      label: `${c.code} - ${c.name}`,
    }));

  const cities = [
    { value: "Kolkata", label: "Kolkata" },
    { value: "Mumbai", label: "Mumbai" },
    { value: "Bengalore", label: "Bengalore" },
    { value: "Agartala", label: "Agartala" },
  ];

  return (

    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

      <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
        >
          ✕
        </button>

        <h3 className="text-xl font-bold mb-4 text-center">
          Currency Exchange Request
        </h3>

        {/* BUY SELL */}

        <div className="flex gap-2 mb-4">

          <button
            type="button"
            onClick={() => setTransactionType("buy")}
            className={`flex-1 py-2 rounded-lg ${
              transactionType === "buy"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Buy Currency
          </button>

          <button
            type="button"
            onClick={() => setTransactionType("sell")}
            className={`flex-1 py-2 rounded-lg ${
              transactionType === "sell"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Sell Currency
          </button>

        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* CITY */}

          <Select
            options={cities}
            placeholder="Select City"
            onChange={(s: any) => setCity(s.value)}
          />

          {/* NAME */}

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          {/* EMAIL */}

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          {/* MOBILE */}

          <input
            type="tel"
            name="mobile"
            placeholder="Mobile Number"
            required
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          {/* CURRENCY SELECT */}

          <div className="grid grid-cols-2 gap-3">

            {/* FROM */}

            <div>

              {transactionType === "buy" ? (

                <div className="border p-3 rounded-lg">
                  INR - Indian Rupee
                </div>

              ) : (

                <Select
                  options={currencyOptions}
                  value={currencyOptions.find(
                    (o) => o.value === from
                  )}
                  onChange={(s: any) => setFrom(s.value)}
                />

              )}

            </div>

            {/* TO */}

            <div>

              {transactionType === "sell" ? (

                <div className="border p-3 rounded-lg">
                  INR - Indian Rupee
                </div>

              ) : (

                <Select
                  options={currencyOptions}
                  value={currencyOptions.find(
                    (o) => o.value === to
                  )}
                  onChange={(s: any) => setTo(s.value)}
                />

              )}

            </div>

          </div>

          {/* LIVE RATE */}

          <div className="bg-gray-100 p-3 rounded-lg text-sm">

            {transactionType === "buy"
              ? `Live Rate: 1 ${currency.code} = ₹${buyRate.toFixed(2)}`
              : `Live Rate: 1 ${currency.code} = ₹${sellRate.toFixed(2)}`}

          </div>

          {/* AMOUNT */}

          <input
            type="number"
            name="amount"
            placeholder="How Much Forex Amount you want ?"
            required
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          {/* ADDRESS */}

          <textarea
            name="address"
            placeholder="Address"
            required
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          {/* SUBMIT */}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-xl cursor-pointer hover:bg-green-700 transition duration-300"
          >
            Submit & Send via WhatsApp
          </button>

        </form>

      </div>

    </div>

  );

}