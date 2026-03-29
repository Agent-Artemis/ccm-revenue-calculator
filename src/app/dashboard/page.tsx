"use client";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1e3a5f] text-white py-4">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="text-xl font-bold tracking-tight">
            Augeo <span className="text-[#22c55e]">Healthcare</span>
          </div>
          <div className="text-sm text-blue-200">Revenue Calculators</div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-extrabold text-[#1e3a5f] text-center mb-3">
          Your Revenue Calculators
        </h1>
        <p className="text-gray-600 text-center mb-12">
          Access both calculators below to see your full care management revenue
          potential.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <a
            href="/calculator"
            className="block bg-white rounded-xl border-2 border-[#22c55e] p-8 hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-4">💊</div>
            <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">
              CCM Calculator
            </h2>
            <p className="text-gray-600 mb-4">
              Calculate your Chronic Care Management revenue potential. CPT
              99490, 99439, 99491.
            </p>
            <span className="text-[#22c55e] font-bold">
              Open Calculator &rarr;
            </span>
          </a>

          <a
            href="/rpm-calculator"
            className="block bg-white rounded-xl border-2 border-[#0891b2] p-8 hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-4">📡</div>
            <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">
              RPM Calculator
            </h2>
            <p className="text-gray-600 mb-4">
              Calculate your Remote Patient Monitoring revenue potential. CPT
              99453, 99454, 99457, 99458.
            </p>
            <span className="text-[#0891b2] font-bold">
              Open Calculator &rarr;
            </span>
          </a>
        </div>

        <div className="mt-12 bg-[#1e3a5f] rounded-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-3">
            Ready to Capture This Revenue?
          </h3>
          <p className="text-blue-100 mb-6">
            Book a free 30-minute strategy call. We&apos;ll show you how to
            implement both CCM and RPM and start generating revenue within 60-90
            days.
          </p>
          <a
            href="https://cal.com/agentartemis/30-minutes-with-jeff-oldroyd"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#22c55e] hover:bg-[#16a34a] text-white text-lg font-bold px-10 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg"
          >
            Book Your Free Strategy Call
          </a>
        </div>
      </div>
    </div>
  );
}
