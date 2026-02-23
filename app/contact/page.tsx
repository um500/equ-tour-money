"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    address: "",
    service: "",
    message: "",
  });

  const [status, setStatus] = useState<null | "success" | "error">(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          country: "",
          address: "",
          service: "",
          message: "",
        });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f4efe6]">

      {/* ================= HERO ================= */}
      <section className="relative w-full h-[340px] md:h-[420px] flex items-center justify-center text-center overflow-hidden">

        <img
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
          alt="Contact Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-[#0f1f3d]/85"></div>

        <div className="relative z-10 px-6 text-white">
          <p className="text-yellow-400 text-sm tracking-widest mb-3">
            EQUATORIAL TOURS & FOREX
          </p>

          <h1 className="text-4xl md:text-6xl font-bold">
            Contact <span className="text-yellow-400">Us</span>
          </h1>

          <p className="mt-4 text-gray-200 max-w-2xl mx-auto text-sm md:text-base">
            A Division of Equatorial Group.  
            We provide premium Tours, Forex, IT Services & Luxury Car Solutions.
          </p>

          <div className="mt-6">
            <a
              href="tel:+919876543210"
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-lg transition"
            >
              📞 Call Now
            </a>
          </div>
        </div>
      </section>

      {/* ================= MAIN ================= */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-14">

        {/* LEFT INFO */}
        <div className="space-y-10">
          <InfoBox icon={<MapPin />} title="Office Address" text="Kolkata, West Bengal, India" />
          <InfoBox icon={<Phone />} title="Phone" text="+91 98765 43210" />
          <InfoBox icon={<Mail />} title="Email" text="info@equatorialtours.com" />
          <InfoBox icon={<Clock />} title="Working Hours" text="Mon – Sat: 9:00 AM – 6:00 PM" />

          <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-yellow-500">
            <iframe
              src="https://www.google.com/maps?q=Kolkata&output=embed"
              width="100%"
              height="300"
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="bg-white p-10 md:p-12 rounded-3xl shadow-xl border border-yellow-500/40 max-w-xl w-full mx-auto">

          <h3 className="text-3xl font-bold text-center mb-2">
            Send Us an <span className="text-yellow-600">Enquiry</span>
          </h3>

          <p className="text-center text-sm text-gray-500 mb-8">
            Equatorial Tours & Forex – A Division of Equatorial Group
          </p>

          {status === "success" && (
            <div className="mb-6 bg-green-100 text-green-800 p-4 rounded-xl text-center font-medium">
              ✅ We’ll get back to you soon!
            </div>
          )}

          {status === "error" && (
            <div className="mb-6 bg-red-100 text-red-800 p-4 rounded-xl text-center font-medium">
              ❌ Something went wrong. Please try again.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} />
            <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
            <InputField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
            <InputField label="Country" name="country" value={formData.country} onChange={handleChange} />
            <InputField label="Full Address" name="address" value={formData.address} onChange={handleChange} />

            <select
              name="service"
              required
              value={formData.service}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-4 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400 outline-none transition"
            >
              <option value="">Select Service</option>
              <option value="forex">Money Exchange (Forex)</option>
              <option value="tour">Tour & Travel</option>
              <option value="it">IT Services</option>
              <option value="car">Luxurious Car Sale</option>
            </select>

            <textarea
              name="message"
              rows={4}
              required
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400 outline-none transition"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition duration-300 disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Enquiry"}
            </button>

          </form>
        </div>
      </section>
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: any;
  type?: string;
}) {
  return (
    <input
      type={type}
      name={name}
      required
      value={value}
      onChange={onChange}
      placeholder={label}
      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400 outline-none transition"
    />
  );
}

function InfoBox({ icon, title, text }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className="text-yellow-600 mt-1">{icon}</div>
      <div>
        <h4 className="font-semibold text-lg">{title}</h4>
        <p className="text-gray-600">{text}</p>
      </div>
    </div>
  );
}