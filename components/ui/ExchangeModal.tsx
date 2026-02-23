"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { currencyList, CurrencyType } from "@/lib/currencyList";
import { getRates } from "@/lib/currencyApi";

const Select = dynamic(() => import("react-select"), { ssr: false });

interface Props {
  currency: CurrencyType;
  rate: number;
  amount: number;
  onClose: () => void;
}

export default function ExchangeModal({
  currency,
  rate,
  amount,
  onClose,
}: Props) {

  const [from, setFrom] = useState<string>(currency.code);
  const [to, setTo] = useState<string>("USD");
  const [liveRate, setLiveRate] = useState<number>(rate || 0);
  const [loadingRate, setLoadingRate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

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

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setNum1(a);
    setNum2(b);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  useEffect(() => {
    async function fetchRate() {
      if (!from || !to) return;
      setLoadingRate(true);

      const data = await getRates(from);

      if (data.success && data.rates[to]) {
        setLiveRate(data.rates[to]);
      } else {
        setLiveRate(0);
      }

      setLoadingRate(false);
    }

    fetchRate();
  }, [from, to]);

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const convertedAmount =
    formData.amount && liveRate
      ? (Number(formData.amount) * liveRate).toFixed(2)
      : null;

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (Number(captchaAnswer) !== num1 + num2) {
      setError("Incorrect answer. Please try again.");
      generateCaptcha();
      setCaptchaAnswer("");
      return;
    }

    try {
      setSubmitting(true);
      setShowError(false);

      const res = await fetch("/api/exchange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, from, to, rate: liveRate }),
      });

      const data = await res.json();

      if (data.success) {
        setShowSuccess(true);

        // Close modal after showing message
        setTimeout(() => {
          setShowSuccess(false);
          onClose();
        }, 2000);
      } else {
        setShowError(true);
      }

    } catch {
      setShowError(true);
    }

    setSubmitting(false);
  };

  const options = currencyList.map((currency) => ({
    value: currency.code,
    label: `${currency.code} - ${currency.name}`,
  }));

  return (
    <>
      {/* SUCCESS MESSAGE */}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[999] bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg text-sm sm:text-base">
          ✅ We'll get back to you soon!
        </div>
      )}

      {/* ERROR MESSAGE */}
      {showError && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[999] bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg text-sm sm:text-base">
          ❌ Something went wrong. Please try again.
        </div>
      )}

      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

        <div className="bg-white rounded-2xl w-full max-w-lg p-5 sm:p-8 relative max-h-[95vh] overflow-y-auto">

          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl"
          >
            ✕
          </button>

          <h3 className="text-xl sm:text-2xl font-bold mb-5 text-center">
            Currency Exchange Request
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              onChange={handleChange}
              className="w-full border rounded-lg p-3 text-sm sm:text-base"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              onChange={handleChange}
              className="w-full border rounded-lg p-3 text-sm sm:text-base"
            />

            <input
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              required
              onChange={handleChange}
              className="w-full border rounded-lg p-3 text-sm sm:text-base"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                options={options}
                value={options.find(o => o.value === from)}
                onChange={(selected: any) => setFrom(selected?.value)}
                isSearchable
              />

              <Select
                options={options}
                value={options.find(o => o.value === to)}
                onChange={(selected: any) => setTo(selected?.value)}
                isSearchable
              />
            </div>

            <div className="bg-gray-100 p-3 rounded-lg text-xs sm:text-sm">
              {loadingRate
                ? "Fetching live rate..."
                : liveRate
                ? `Live Rate: 1 ${from} = ${liveRate.toFixed(4)} ${to}`
                : "Rate not available"}
            </div>

            <input
              type="number"
              name="amount"
              placeholder="Amount to Convert"
              required
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

            {convertedAmount && (
              <div className="bg-green-100 p-3 rounded-lg text-sm">
                Converted: {convertedAmount} {to}
              </div>
            )}

            <textarea
              name="address"
              placeholder="Address"
              required
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

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
                <p className="text-red-500 text-xs mt-1">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </button>

          </form>
        </div>
      </div>
    </>
  );
}