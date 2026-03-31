"use client";

import { useState } from "react";

export default function LandingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (endpoint: string, id: string) => {
    setLoading(id);
    try {
      const res = await fetch(endpoint, { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong. Please try again.");
        setLoading(null);
      }
    } catch {
      alert("Something went wrong. Please try again.");
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="bg-[#1e3a5f] text-white">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/augeo-health-logo.jpg" alt="Augeo Health" className="h-8 w-8 rounded-full" />
            <span className="text-xl font-bold tracking-tight">Healthcare Industry Partners</span>
          </div>
          <button
            onClick={() => handleCheckout("/api/bundle-checkout", "nav")}
            disabled={loading === "nav"}
            className="bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold px-5 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading === "nav" ? "Loading..." : "Get Both Calculators"}
          </button>
        </nav>

        <div className="max-w-4xl mx-auto px-6 py-20 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 text-balance">
            Your Practice Is Leaving{" "}
            <span className="text-[#22c55e]">$_____</span> On The Table Every
            Month
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto text-balance">
            Most practices with 500+ Medicare patients are missing $50,000 to
            $300,000 per year in CCM and RPM revenue. Find out your exact
            number.
          </p>
          <button
            onClick={() => handleCheckout("/api/bundle-checkout", "hero")}
            disabled={loading === "hero"}
            className="bg-[#22c55e] hover:bg-[#16a34a] text-white text-lg md:text-xl font-bold px-10 py-5 rounded-xl transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none"
          >
            {loading === "hero"
              ? "Redirecting to checkout..."
              : "Calculate My Revenue — $49 for Both"}
          </button>
          <p className="mt-4 text-blue-200 text-sm">
            One-time payment. Instant access. No subscription. Save $9 with the
            bundle.
          </p>
        </div>
      </header>

      {/* Problem Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1e3a5f] mb-12">
            Two Revenue Streams Most Practices Ignore
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border-2 border-[#22c55e]">
              <div className="text-4xl mb-4">💊</div>
              <h3 className="text-2xl font-bold text-[#1e3a5f] mb-3">
                Chronic Care Management
              </h3>
              <p className="text-gray-600 mb-4">
                CMS pays $62-$109 per patient per month for coordinating care
                for patients with 2+ chronic conditions. 68% of Medicare
                patients qualify.
              </p>
              <div className="text-[#22c55e] font-bold text-lg">
                CPT 99490 / 99439 / 99491
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border-2 border-[#0891b2]">
              <div className="text-4xl mb-4">📡</div>
              <h3 className="text-2xl font-bold text-[#1e3a5f] mb-3">
                Remote Patient Monitoring
              </h3>
              <p className="text-gray-600 mb-4">
                CMS pays $103-$159 per patient per month for monitoring patients
                with connected devices. Hypertension, diabetes, COPD, CHF all
                qualify.
              </p>
              <div className="text-[#0891b2] font-bold text-lg">
                CPT 99453 / 99454 / 99457 / 99458
              </div>
            </div>
          </div>
          <div className="mt-8 bg-[#1e3a5f] rounded-xl p-6 text-center">
            <p className="text-white text-xl font-bold">
              Combined, a 1,000-patient practice can generate{" "}
              <span className="text-[#22c55e]">$300,000+</span> annually from
              CCM and RPM alone.
            </p>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1e3a5f] mb-4">
            What the Calculators Show You
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Input your practice data, get actionable revenue projections in
            seconds.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Monthly & annual revenue potential for CCM and RPM",
              "Revenue breakdown by payer (Medicare, Medicaid, Commercial)",
              "Staffing requirements, costs, and capacity utilization",
              "Device costs and leasing impact (RPM)",
              "Net profit and ROI on your staffing investment",
              "Revenue per provider in your practice",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4">
                <div className="text-[#22c55e] text-2xl font-bold mt-0.5">
                  ✓
                </div>
                <p className="text-lg text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1e3a5f] mb-12">
            Choose Your Calculator
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* CCM Only */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col">
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">
                CCM Calculator
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Chronic Care Management revenue projections
              </p>
              <div className="text-4xl font-extrabold text-[#1e3a5f] mb-6">
                $29
              </div>
              <ul className="space-y-2 mb-8 flex-grow">
                {[
                  "CCM revenue projections",
                  "Payer mix breakdown",
                  "Staffing ROI analysis",
                  "Downloadable PDF report",
                  "Lifetime access",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-[#22c55e] font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleCheckout("/api/checkout", "ccm")}
                disabled={loading === "ccm"}
                className="w-full bg-white border-2 border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e] hover:text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
              >
                {loading === "ccm" ? "Loading..." : "Get CCM Calculator"}
              </button>
            </div>

            {/* Bundle - Featured */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-[#22c55e] p-8 flex flex-col relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#22c55e] text-white text-sm font-bold px-4 py-1 rounded-full">
                BEST VALUE
              </div>
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">
                CCM + RPM Bundle
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Both calculators — save $19
              </p>
              <div className="text-4xl font-extrabold text-[#22c55e] mb-1">
                $49
              </div>
              <p className="text-sm text-gray-400 line-through mb-5">$58</p>
              <ul className="space-y-2 mb-8 flex-grow">
                {[
                  "Everything in CCM Calculator",
                  "Everything in RPM Calculator",
                  "Combined revenue dashboard",
                  "Downloadable PDF reports",
                  "Priority strategy call booking",
                  "Lifetime access to both",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-[#22c55e] font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() =>
                  handleCheckout("/api/bundle-checkout", "bundle")
                }
                disabled={loading === "bundle"}
                className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
              >
                {loading === "bundle" ? "Loading..." : "Get Both — $49"}
              </button>
            </div>

            {/* RPM Only */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col">
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">
                RPM Calculator
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Remote Patient Monitoring revenue projections
              </p>
              <div className="text-4xl font-extrabold text-[#1e3a5f] mb-6">
                $29
              </div>
              <ul className="space-y-2 mb-8 flex-grow">
                {[
                  "RPM revenue projections",
                  "Device cost analysis",
                  "Staffing ROI analysis",
                  "Downloadable PDF report",
                  "Lifetime access",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-[#0891b2] font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() =>
                  handleCheckout("/api/rpm-checkout", "rpm")
                }
                disabled={loading === "rpm"}
                className="w-full bg-white border-2 border-[#0891b2] text-[#0891b2] hover:bg-[#0891b2] hover:text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
              >
                {loading === "rpm" ? "Loading..." : "Get RPM Calculator"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Credibility */}
      <section className="py-20 bg-[#1e3a5f] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Built by Healthcare Operations Experts
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            These calculators are built on real-world CCM and RPM implementation
            data from practices across the country. The billing rates, staffing
            models, and enrollment benchmarks come from years of hands-on
            experience running healthcare operations.
          </p>
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mb-12">
            <div>
              <div className="text-4xl font-extrabold text-[#22c55e]">15+</div>
              <div className="text-blue-200 text-sm mt-1">
                Years in Healthcare
              </div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-[#22c55e]">MHA</div>
              <div className="text-blue-200 text-sm mt-1">
                Healthcare Administration
              </div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-[#22c55e]">
                100+
              </div>
              <div className="text-blue-200 text-sm mt-1">
                Practices Advised
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-[#1e3a5f] mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "What is CCM and RPM?",
                a: "CCM (Chronic Care Management) and RPM (Remote Patient Monitoring) are Medicare programs that reimburse practices for non-face-to-face patient care. CCM covers care coordination for patients with 2+ chronic conditions. RPM covers monitoring patients with connected devices like blood pressure cuffs and glucose monitors.",
              },
              {
                q: "How accurate are these calculators?",
                a: "The calculators use 2026 CMS reimbursement rates and industry-standard staffing benchmarks. Results are conservative estimates — actual revenue often exceeds projections once a program is optimized.",
              },
              {
                q: "Should I get CCM, RPM, or both?",
                a: "If your practice serves Medicare patients with chronic conditions, both programs apply. Many patients qualify for CCM and RPM simultaneously, and the revenue stacks. The bundle gives you the complete picture for just $49.",
              },
              {
                q: "What if I need help implementing?",
                a: "After you see your numbers, you can book a free 30-minute strategy call. We'll walk through exactly how to launch CCM, RPM, or both — and start generating revenue within 60-90 days.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-xl p-6"
              >
                <h3 className="text-lg font-bold text-[#1e3a5f] mb-2">
                  {faq.q}
                </h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-4">
            Stop Guessing. Start Calculating.
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            For less than the cost of a team lunch, find out exactly how much
            CCM and RPM revenue your practice is leaving on the table.
          </p>
          <button
            onClick={() =>
              handleCheckout("/api/bundle-checkout", "final")
            }
            disabled={loading === "final"}
            className="bg-[#22c55e] hover:bg-[#16a34a] text-white text-xl font-bold px-12 py-5 rounded-xl transition-all transform hover:scale-105 shadow-lg disabled:opacity-50"
          >
            {loading === "final"
              ? "Loading..."
              : "Get Both Calculators — $49"}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1e3a5f] text-blue-200 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} Healthcare Industry Partners. All rights reserved.
          </p>
          <p className="mt-2">
            Built by healthcare operations experts who&apos;ve been in the
            trenches.
          </p>
        </div>
      </footer>
    </div>
  );
}
