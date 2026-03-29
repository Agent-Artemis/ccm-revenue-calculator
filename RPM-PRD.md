# PRD: RPM Revenue Calculator

## Overview
A paid calculator ($49 one-time) that helps healthcare practices calculate their Remote Patient Monitoring revenue potential. Added as a second product in the existing app alongside the CCM calculator.

## RPM Billing Codes (2026 CMS rates, approximate)
- **99453** (Initial setup, device education): ~$19 (one-time per patient)
- **99454** (Device supply, monthly): ~$55/month
- **99457** (First 20 min clinical monitoring): ~$48/month
- **99458** (Additional 20 min monitoring): ~$38/month
- **99091** (Data collection/interpretation, 30+ min): ~$56/month

Typical per-patient monthly revenue: $103-$159/month (99454 + 99457 + optional 99458)
Conservative default: $120/patient/month

## Qualifying Conditions for RPM
- Hypertension
- Diabetes
- COPD
- CHF (Congestive Heart Failure)
- Chronic Kidney Disease
- Obesity
- Estimated: 40-60% of Medicare patients may qualify

## Calculator Inputs
- Total patient panel size
- % of patients with RPM-qualifying conditions (default: 50%)
- Payer mix (Medicare %, Medicaid %, Commercial %)
- Estimated enrollment rate (default: 25% -- RPM typically lower than CCM)
- Average revenue per patient/month (default: $120)
- Number of providers
- Number of monitoring staff (RNs, LPNs, MAs)
- Device cost per patient (default: $50/month for lease, $0 if practice-owned)

## Calculator Outputs
- Monthly/Annual RPM revenue
- Revenue per provider
- Revenue by payer breakdown
- Device costs (monthly/annual)
- Staffing costs
- Net profit after devices + staffing
- ROI percentage
- Patients per staff member capacity

## RPM Staffing Benchmarks
- RN: 200 RPM patients (less time per patient than CCM -- mostly data review)
- LPN: 250 RPM patients
- MA: 300 RPM patients
- Salary costs same as CCM (RN: $75k, LPN: $55k, MA: $40k)

## Pages
- /rpm-calculator (protected, same cookie-based auth)
- /api/rpm-checkout (Stripe checkout for RPM product, $49)

## Combined Package
- /api/bundle-checkout (both calculators for $79)
- Landing page updated with three purchase options: CCM $49, RPM $49, Bundle $79

## Design
- Same healthcare theme as CCM calculator
- Color accent: teal/cyan (#0891b2) to differentiate from CCM green
- Same layout structure for consistency
