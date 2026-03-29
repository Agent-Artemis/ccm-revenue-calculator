"use client";

import { useState, useMemo, useCallback } from "react";
import jsPDF from "jspdf";

interface Inputs {
  totalPatients: number;
  qualifyingPct: number;
  medicarePct: number;
  medicaidPct: number;
  commercialPct: number;
  enrollmentRate: number;
  revenuePerPatient: number;
  deviceCostPerPatient: number;
  numProviders: number;
  numRNs: number;
  numLPNs: number;
  numMAs: number;
  rnCost: number;
  lpnCost: number;
  maCost: number;
}

const defaultInputs: Inputs = {
  totalPatients: 1000,
  qualifyingPct: 50,
  medicarePct: 70,
  medicaidPct: 15,
  commercialPct: 15,
  enrollmentRate: 25,
  revenuePerPatient: 112,
  deviceCostPerPatient: 50,
  numProviders: 3,
  numRNs: 1,
  numLPNs: 1,
  numMAs: 0,
  rnCost: 75000,
  lpnCost: 55000,
  maCost: 40000,
};
const PATIENTS_PER_RN = 200;
const PATIENTS_PER_LPN = 250;
const PATIENTS_PER_MA = 300;

function fmt(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtPct(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n / 100);
}

function InputField({
  label,
  value,
  onChange,
  suffix,
  min,
  max,
  step,
  helpText,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  helpText?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#1e3a5f] mb-1">
        {label}
      </label>
      {helpText && <p className="text-xs text-gray-500 mb-2">{helpText}</p>}
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min ?? 0}
          max={max}
          step={step ?? 1}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0891b2] focus:border-transparent outline-none text-lg"
        />
        {suffix && (
          <span className="text-gray-500 font-medium text-sm whitespace-nowrap">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function ResultCard({
  label,
  value,
  large,
  accent,
}: {
  label: string;
  value: string;
  large?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className={`p-6 rounded-xl ${accent ? "bg-[#0891b2] text-white" : "bg-white border border-gray-200"}`}
    >
      <p
        className={`text-sm font-medium mb-1 ${accent ? "text-cyan-100" : "text-gray-500"}`}
      >
        {label}
      </p>
      <p
        className={`font-extrabold ${large ? "text-3xl md:text-4xl" : "text-2xl"} ${accent ? "text-white" : "text-[#1e3a5f]"}`}
      >
        {value}
      </p>
    </div>
  );
}

type Scenario = "conservative" | "realistic" | "aggressive";

const scenarioPresets: Record<Scenario, { enrollmentRate: number; revenuePerPatient: number; label: string; description: string }> = {
  conservative: { enrollmentRate: 15, revenuePerPatient: 103, label: "Conservative", description: "15% enrollment, basic monitoring ($103/pt)" },
  realistic: { enrollmentRate: 25, revenuePerPatient: 112, label: "Realistic", description: "25% enrollment, new program mix ($112/pt)" },
  aggressive: { enrollmentRate: 40, revenuePerPatient: 135, label: "Aggressive", description: "40% enrollment, mature program ($135/pt)" },
};

export default function RPMCalculatorPage() {
  const [inputs, setInputs] = useState<Inputs>(defaultInputs);
  const [scenario, setScenario] = useState<Scenario>("realistic");

  const update = (key: keyof Inputs, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const applyScenario = (s: Scenario) => {
    setScenario(s);
    const preset = scenarioPresets[s];
    setInputs((prev) => ({
      ...prev,
      enrollmentRate: preset.enrollmentRate,
      revenuePerPatient: preset.revenuePerPatient,
    }));
  };

  const results = useMemo(() => {
    const eligiblePatients =
      inputs.totalPatients * (inputs.qualifyingPct / 100);
    const enrolledPatients =
      eligiblePatients * (inputs.enrollmentRate / 100);

    const monthlyRevenue = enrolledPatients * inputs.revenuePerPatient;
    const annualRevenue = monthlyRevenue * 12;

    const revenuePerProvider =
      inputs.numProviders > 0
        ? annualRevenue / inputs.numProviders
        : annualRevenue;

    const monthlyDeviceCost =
      enrolledPatients * inputs.deviceCostPerPatient;
    const annualDeviceCost = monthlyDeviceCost * 12;

    const totalStaffCost =
      inputs.numRNs * inputs.rnCost +
      inputs.numLPNs * inputs.lpnCost +
      inputs.numMAs * inputs.maCost;

    const totalAnnualCost = annualDeviceCost + totalStaffCost;
    const netProfit = annualRevenue - totalAnnualCost;
    const roiPct =
      totalAnnualCost > 0
        ? ((annualRevenue - totalAnnualCost) / totalAnnualCost) * 100
        : 0;

    const staffCapacity =
      inputs.numRNs * PATIENTS_PER_RN +
      inputs.numLPNs * PATIENTS_PER_LPN +
      inputs.numMAs * PATIENTS_PER_MA;

    const capacityUsed =
      staffCapacity > 0
        ? Math.min((enrolledPatients / staffCapacity) * 100, 100)
        : 0;

    const medicareRevenue =
      monthlyRevenue * (inputs.medicarePct / 100);
    const medicaidRevenue =
      monthlyRevenue * (inputs.medicaidPct / 100);
    const commercialRevenue =
      monthlyRevenue * (inputs.commercialPct / 100);

    return {
      eligiblePatients: Math.round(eligiblePatients),
      enrolledPatients: Math.round(enrolledPatients),
      monthlyRevenue,
      annualRevenue,
      revenuePerProvider,
      monthlyDeviceCost,
      annualDeviceCost,
      totalStaffCost,
      totalAnnualCost,
      netProfit,
      roiPct,
      staffCapacity,
      capacityUsed,
      medicareRevenue,
      medicaidRevenue,
      commercialRevenue,
    };
  }, [inputs]);

  const generatePDF = useCallback(() => {
    const doc = new jsPDF();
    const f = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
    doc.setFontSize(22);
    doc.setTextColor(30, 58, 95);
    doc.text("RPM Revenue Analysis", 20, 25);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Prepared by HCIP | ${new Date().toLocaleDateString()}`, 20, 33);
    doc.setDrawColor(30, 58, 95);
    doc.line(20, 37, 190, 37);
    doc.setFontSize(14);
    doc.setTextColor(8, 145, 178);
    doc.text(`Monthly Revenue: ${f(results.monthlyRevenue)}`, 20, 48);
    doc.text(`Annual Revenue: ${f(results.annualRevenue)}`, 20, 57);
    doc.setFontSize(12);
    doc.setTextColor(30, 58, 95);
    doc.text("Practice Inputs", 20, 72);
    doc.setFontSize(10);
    doc.setTextColor(60);
    [
      `Total Patient Panel: ${inputs.totalPatients.toLocaleString()}`,
      `Patients with RPM-Qualifying Conditions: ${inputs.qualifyingPct}%`,
      `Enrollment Rate: ${inputs.enrollmentRate}%`,
      `Revenue per Patient/Month: $${inputs.revenuePerPatient}`,
      `Device Cost per Patient/Month: $${inputs.deviceCostPerPatient}`,
      `Staffing: ${inputs.numRNs} RN ($${(inputs.rnCost/1000).toFixed(0)}k), ${inputs.numLPNs} LPN ($${(inputs.lpnCost/1000).toFixed(0)}k), ${inputs.numMAs} MA ($${(inputs.maCost/1000).toFixed(0)}k)`,
      `Providers: ${inputs.numProviders}`,
      `Payer Mix: Medicare ${inputs.medicarePct}% / Medicaid ${inputs.medicaidPct}% / Commercial ${inputs.commercialPct}%`,
    ].forEach((line, i) => doc.text(line, 20, 80 + i * 7));
    doc.setFontSize(12);
    doc.setTextColor(30, 58, 95);
    doc.text("Key Results", 20, 135);
    doc.setFontSize(10);
    doc.setTextColor(60);
    [
      `Eligible Patients: ${results.eligiblePatients.toLocaleString()}`,
      `Enrolled Patients: ${results.enrolledPatients.toLocaleString()}`,
      `Revenue per Provider: ${f(results.revenuePerProvider)}`,
      `Annual Staff Cost: ${f(results.totalStaffCost)}`,
      `Annual Device Cost: ${f(results.annualDeviceCost)}`,
      `Total Annual Cost: ${f(results.totalAnnualCost)}`,
      `Net Annual Profit: ${f(results.netProfit)}`,
      `ROI: ${results.roiPct.toFixed(0)}%`,
    ].forEach((line, i) => doc.text(line, 20, 143 + i * 7));
    doc.setFontSize(12);
    doc.setTextColor(30, 58, 95);
    doc.text("Payer Breakdown (Monthly)", 20, 205);
    doc.setFontSize(10);
    doc.setTextColor(60);
    doc.text(`Medicare (${inputs.medicarePct}%): ${f(results.medicareRevenue)}/mo`, 20, 213);
    doc.text(`Medicaid (${inputs.medicaidPct}%): ${f(results.medicaidRevenue)}/mo`, 20, 220);
    doc.text(`Commercial (${inputs.commercialPct}%): ${f(results.commercialRevenue)}/mo`, 20, 227);
    doc.setDrawColor(30, 58, 95);
    doc.line(20, 242, 190, 242);
    doc.setFontSize(11);
    doc.setTextColor(30, 58, 95);
    doc.text("Ready to launch your RPM program?", 20, 252);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Book a free 30-minute strategy call:", 20, 259);
    doc.setTextColor(8, 145, 178);
    doc.text("https://cal.com/agentartemis/30-minutes-with-jeff-oldroyd", 20, 266);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("HCIP - Health Care Industry Partners | Confidential", 20, 280);
    doc.save("RPM-Revenue-Analysis.pdf");
  }, [inputs, results]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1e3a5f] text-white py-4">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="text-xl font-bold tracking-tight">
            HCIP <span className="text-[#0891b2]">Healthcare</span>
          </div>
          <div className="text-sm text-blue-200">RPM Revenue Calculator</div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1e3a5f] mb-2">
            Your RPM Revenue Potential
          </h1>
          <p className="text-gray-600">
            Adjust the inputs below to match your practice. Results update
            instantly.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Inputs Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-[#1e3a5f] mb-4">
                Practice Size
              </h2>
              <div className="space-y-4">
                <InputField
                  label="Total Patient Panel"
                  value={inputs.totalPatients}
                  onChange={(v) => update("totalPatients", v)}
                  helpText="Total active patients across all providers"
                />
                <InputField
                  label="Patients with RPM-Qualifying Conditions"
                  value={inputs.qualifyingPct}
                  onChange={(v) => update("qualifyingPct", v)}
                  suffix="%"
                  max={100}
                  helpText="Hypertension, diabetes, COPD, CHF, CKD, obesity. ~50% typical."
                />
                <InputField
                  label="Estimated Enrollment Rate"
                  value={inputs.enrollmentRate}
                  onChange={(v) => update("enrollmentRate", v)}
                  suffix="%"
                  max={100}
                  helpText="25% is conservative; mature programs hit 35-45%"
                />
                <InputField
                  label="Number of Providers"
                  value={inputs.numProviders}
                  onChange={(v) => update("numProviders", v)}
                  min={1}
                />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-[#1e3a5f] mb-4">
                Payer Mix
              </h2>
              <div className="space-y-4">
                <InputField
                  label="Medicare"
                  value={inputs.medicarePct}
                  onChange={(v) => update("medicarePct", v)}
                  suffix="%"
                  max={100}
                />
                <InputField
                  label="Medicaid"
                  value={inputs.medicaidPct}
                  onChange={(v) => update("medicaidPct", v)}
                  suffix="%"
                  max={100}
                />
                <InputField
                  label="Commercial"
                  value={inputs.commercialPct}
                  onChange={(v) => update("commercialPct", v)}
                  suffix="%"
                  max={100}
                />
                {inputs.medicarePct +
                  inputs.medicaidPct +
                  inputs.commercialPct !==
                  100 && (
                  <p className="text-amber-600 text-sm font-medium">
                    Payer mix should total 100% (currently{" "}
                    {inputs.medicarePct +
                      inputs.medicaidPct +
                      inputs.commercialPct}
                    %)
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-[#1e3a5f] mb-4">
                Revenue & Device Costs
              </h2>
              <div className="space-y-4">
                <InputField
                  label="Average Revenue per Patient/Month"
                  value={inputs.revenuePerPatient}
                  onChange={(v) => update("revenuePerPatient", v)}
                  suffix="$/mo"
                  helpText="$112 default based on new program mix: 82% basic ($103) + 18% full ($159)."
                />
                <InputField
                  label="Device Cost per Patient/Month"
                  value={inputs.deviceCostPerPatient}
                  onChange={(v) => update("deviceCostPerPatient", v)}
                  suffix="$/mo"
                  helpText="$50/mo lease typical. $0 if practice-owned devices."
                />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-[#1e3a5f] mb-4">
                RPM Staffing
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label="RNs (count)"
                    value={inputs.numRNs}
                    onChange={(v) => update("numRNs", v)}
                    helpText={`~${PATIENTS_PER_RN} patients/RN`}
                  />
                  <InputField
                    label="RN Salary ($/yr)"
                    value={inputs.rnCost}
                    onChange={(v) => update("rnCost", v)}
                    helpText="Nat'l avg: $75,000"
                    step={1000}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label="LPNs (count)"
                    value={inputs.numLPNs}
                    onChange={(v) => update("numLPNs", v)}
                    helpText={`~${PATIENTS_PER_LPN} patients/LPN`}
                  />
                  <InputField
                    label="LPN Salary ($/yr)"
                    value={inputs.lpnCost}
                    onChange={(v) => update("lpnCost", v)}
                    helpText="Nat'l avg: $55,000"
                    step={1000}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label="MAs (count)"
                    value={inputs.numMAs}
                    onChange={(v) => update("numMAs", v)}
                    helpText={`~${PATIENTS_PER_MA} patients/MA`}
                  />
                  <InputField
                    label="MA Salary ($/yr)"
                    value={inputs.maCost}
                    onChange={(v) => update("maCost", v)}
                    helpText="Nat'l avg: $40,000"
                    step={1000}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-3 space-y-6">
            {/* Scenario Toggle */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-[#1e3a5f] mb-3">
                ROI Scenario
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(scenarioPresets) as Scenario[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => applyScenario(s)}
                    className={`p-3 rounded-lg text-sm font-semibold transition-all ${scenario === s ? "bg-[#1e3a5f] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  >
                    <div>{scenarioPresets[s].label}</div>
                    <div className={`text-xs mt-1 ${scenario === s ? "text-blue-200" : "text-gray-400"}`}>
                      {scenarioPresets[s].description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <ResultCard
                label="Monthly RPM Revenue"
                value={fmt(results.monthlyRevenue)}
                large
                accent
              />
              <ResultCard
                label="Annual RPM Revenue"
                value={fmt(results.annualRevenue)}
                large
                accent
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <ResultCard
                label="Eligible Patients"
                value={results.eligiblePatients.toLocaleString()}
              />
              <ResultCard
                label="Enrolled Patients"
                value={results.enrolledPatients.toLocaleString()}
              />
              <ResultCard
                label="Revenue per Provider"
                value={fmt(results.revenuePerProvider)}
              />
            </div>

            {/* Payer Breakdown */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-[#1e3a5f] mb-4">
                Monthly Revenue by Payer
              </h3>
              <div className="space-y-3">
                {[
                  {
                    label: "Medicare",
                    value: results.medicareRevenue,
                    pct: inputs.medicarePct,
                    color: "bg-blue-500",
                  },
                  {
                    label: "Medicaid",
                    value: results.medicaidRevenue,
                    pct: inputs.medicaidPct,
                    color: "bg-purple-500",
                  },
                  {
                    label: "Commercial",
                    value: results.commercialRevenue,
                    pct: inputs.commercialPct,
                    color: "bg-amber-500",
                  },
                ].map((payer) => (
                  <div key={payer.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">
                        {payer.label} ({payer.pct}%)
                      </span>
                      <span className="font-bold text-[#1e3a5f]">
                        {fmt(payer.value)}/mo
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div
                        className={`${payer.color} h-3 rounded-full transition-all duration-300`}
                        style={{ width: `${Math.min(payer.pct, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-[#1e3a5f] mb-4">
                Cost Breakdown & ROI
              </h3>
              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Annual Staff Cost</p>
                  <p className="text-xl font-bold text-gray-700">
                    {fmt(results.totalStaffCost)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Annual Device Cost</p>
                  <p className="text-xl font-bold text-gray-700">
                    {fmt(results.annualDeviceCost)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Staff Capacity</p>
                  <p className="text-xl font-bold text-gray-700">
                    {results.staffCapacity} patients
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Capacity Utilization</span>
                  <span
                    className={`font-bold ${results.capacityUsed > 90 ? "text-red-500" : results.capacityUsed > 70 ? "text-amber-500" : "text-[#0891b2]"}`}
                  >
                    {fmtPct(results.capacityUsed)}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${results.capacityUsed > 90 ? "bg-red-500" : results.capacityUsed > 70 ? "bg-amber-500" : "bg-[#0891b2]"}`}
                    style={{ width: `${results.capacityUsed}%` }}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-sm text-gray-500">Net Annual Profit</p>
                  <p
                    className={`text-3xl font-extrabold ${results.netProfit >= 0 ? "text-[#0891b2]" : "text-red-500"}`}
                  >
                    {fmt(results.netProfit)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Return on Investment</p>
                  <p
                    className={`text-3xl font-extrabold ${results.roiPct >= 0 ? "text-[#0891b2]" : "text-red-500"}`}
                  >
                    {results.roiPct.toFixed(0)}%
                  </p>
                </div>
              </div>
            </div>

            {/* PDF Export */}
            <button
              onClick={generatePDF}
              className="w-full bg-white border-2 border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white font-bold py-4 rounded-xl transition-colors text-lg"
            >
              Download PDF Report
            </button>

            {/* CTA */}
            <div className="bg-[#1e3a5f] rounded-xl p-8 text-center text-white">
              <h3 className="text-2xl font-bold mb-3">
                Ready to Launch Your RPM Program?
              </h3>
              <p className="text-blue-100 mb-6">
                Book a free 30-minute strategy call. We&apos;ll show you how to
                select devices, enroll patients, and start generating RPM
                revenue within 60-90 days.
              </p>
              <a
                href="https://cal.com/agentartemis/30-minutes-with-jeff-oldroyd"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#0891b2] hover:bg-[#0e7490] text-white text-lg font-bold px-10 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg"
              >
                Book Your Free Strategy Call
              </a>
              <p className="text-blue-300 text-sm mt-3">
                No pressure. No pitch. Just a clear roadmap for RPM revenue.
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-[#1e3a5f] text-blue-200 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} Augeo LLC. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
