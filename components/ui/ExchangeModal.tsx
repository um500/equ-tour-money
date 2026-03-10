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

  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [error, setError] = useState("");

  /* CAPTCHA */

  const generateCaptcha = () => {

    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;

    setNum1(a);
    setNum2(b);

  };

  useEffect(() => {
    generateCaptcha();
  }, []);

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

  /* CONVERSION */

  const convertedAmount = formData.amount
    ? (Number(formData.amount) / liveRate).toFixed(2)
    : null;

  /* SUBMIT */

  const handleSubmit = async (e: any) => {

    e.preventDefault();

    if (Number(captchaAnswer) !== num1 + num2) {

      setError("Incorrect answer");
      generateCaptcha();
      setCaptchaAnswer("");
      return;

    }

    const res = await fetch("/api/exchange", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        ...formData,
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

  /* DROPDOWN OPTIONS */

  const currencyOptions = currencyList
    .filter((c) => c.code !== "INR")
    .map((c) => ({
      value: c.code,
      label: `${c.code} - ${c.name}`,
    }));

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

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

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

          <input
            type="number"
            name="amount"
            placeholder="How Much Forex Amount you want ?"
            required
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

         

          <textarea
            name="address"
            placeholder="Address"
            required
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          {/* CAPTCHA */}

          <div>

            <p className="text-sm mb-1">
              Verify: {num1} + {num2} = ?
            </p>

            <input
              type="number"
              value={captchaAnswer}
              onChange={(e) => setCaptchaAnswer(e.target.value)}
              required
              className="w-full border rounded-lg p-3"
            />

            {error && (
              <p className="text-red-500 text-xs mt-1">
                {error}
              </p>
            )}

          </div>

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