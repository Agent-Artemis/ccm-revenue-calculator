"use client";

import { useState } from "react";

export default function LandingPage() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong. Please try again.");
        setLoading(false);
      }
    } catch {
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="bg-[#1e3a5f] text-white">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold tracking-tight">
            Augeo <span className="text-[#22c55e]">Healthcare</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold px-5 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Loading..." : "Get Started"}
          </button>
        </nav>

        <div className="max-w-4xl mx-auto px-6 py-20 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 text-balance">
            Your Practice Is Leaving{" "}
            <span className="text-[#22c55e]">$_____</span> On The Table Every
            Month
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto text-balance">
            Most practices with 500+ Medicare patients are missing $30,000 to
            $150,000 per year in Chronic Care Management revenue. Find out your
            exact number.
          </p>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="bg-[#22c55e] hover:bg-[#16a34a] text-white text-lg md:text-xl font-bold px-10 py-5 rounded-xl transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none"
          >
            {loading
              ? "Redirecting to checkout..."
              : "Calculate My Revenue — $49"}
          </button>
          <p className="mt-4 text-blue-200 text-sm">
            One-time payment. Instant access. No subscription.
          </p>
        </div>
      </header>

      {/* Problem Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1e3a5f] mb-12">
            Why Most Practices Miss This Revenue
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">
                They Don&apos;t Know the Numbers
              </h3>
              <p className="text-gray-600">
                68% of Medicare patients qualify for CCM, but most practices
                have never calculated their actual revenue opportunity. The
                number is almost always bigger than expected.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="text-4xl mb-4">⚙️</div>
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">
                Implementation Feels Complex
              </h3>
              <p className="text-gray-600">
                Billing codes, staffing models, compliance requirements — it
                looks overwhelming from the outside. But with the right
                framework, it&apos;s straightforward.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">
                The Money Is Real
              </h3>
              <p className="text-gray-600">
                CMS pays $62-$109 per patient per month for CCM services. With
                proper enrollment, a 1,000-patient practice can generate
                $200,000+ annually.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1e3a5f] mb-4">
            What the Calculator Shows You
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Input your practice data, get actionable revenue projections in
            seconds.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Monthly & annual CCM revenue potential",
              "Revenue breakdown by payer (Medicare, Medicaid, Commercial)",
              "Staffing requirements and costs",
              "Net profit after staffing expenses",
              "ROI percentage on your staffing investment",
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

      {/* Credibility */}
      <section className="py-20 bg-[#1e3a5f] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Built by Healthcare Operations Experts
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            This calculator is built on real-world CCM implementation data from
            practices across the country. The billing rates, staffing models,
            and enrollment benchmarks come from years of hands-on experience
            running healthcare operations.
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
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="bg-[#22c55e] hover:bg-[#16a34a] text-white text-lg font-bold px-10 py-5 rounded-xl transition-all transform hover:scale-105 shadow-lg disabled:opacity-50"
          >
            {loading ? "Loading..." : "Calculate My Revenue — $49"}
          </button>
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
                q: "What is Chronic Care Management (CCM)?",
                a: "CCM is a Medicare program (CPT 99490, 99439, 99491) that reimburses practices for non-face-to-face care coordination for patients with two or more chronic conditions. It's one of the most under-utilized revenue streams in primary care.",
              },
              {
                q: "How accurate is this calculator?",
                a: "The calculator uses 2026 CMS reimbursement rates and industry-standard staffing benchmarks. Results are conservative estimates — actual revenue often exceeds projections once a program is optimized.",
              },
              {
                q: "Do I get to keep the calculator?",
                a: "Yes. One-time payment, lifetime access. Come back and recalculate as your practice grows or your payer mix changes.",
              },
              {
                q: "What if I need help implementing CCM?",
                a: "After you see your numbers, you can book a free 30-minute strategy call with our team. We'll walk through exactly how to capture that revenue.",
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
            For the cost of a team lunch, find out exactly how much CCM revenue
            your practice is leaving on the table.
          </p>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="bg-[#22c55e] hover:bg-[#16a34a] text-white text-xl font-bold px-12 py-5 rounded-xl transition-all transform hover:scale-105 shadow-lg disabled:opacity-50"
          >
            {loading ? "Loading..." : "Calculate My Revenue — $49"}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1e3a5f] text-blue-200 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} Augeo LLC. All rights reserved.
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
