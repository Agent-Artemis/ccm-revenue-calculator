# PRD: CCM Revenue Calculator

## Overview
A paid web tool ($49 one-time) that helps healthcare practices calculate their untapped Chronic Care Management (CCM) revenue. Built as a Next.js app deployed on Vercel with Stripe Checkout for payments.

## Why This Product
- Healthcare practices leave millions on the table by not implementing CCM programs
- Most practice administrators don't know how much revenue they're missing
- Jeff Oldroyd is a CCM/RPM implementation expert -- this is the top of his funnel
- Practices pay $49 to see their numbers, then book a consultation with Jeff to implement

## User Flow
1. **Landing page** -- compelling copy about untapped CCM revenue, social proof, CTA
2. **Click "Calculate My Revenue"** -- triggers Stripe Checkout ($49 one-time payment)
3. **Payment success** -- redirected to the calculator tool
4. **Calculator** -- interactive form with real-time calculations:
   - Input: Total patient panel size
   - Input: % of patients with 2+ chronic conditions (default: 68% for Medicare)
   - Input: Payer mix (Medicare %, Medicaid %, Commercial %)
   - Input: Estimated enrollment rate (default: 30%)
   - Input: Current staffing capacity (RNs, LPNs, MAs)
   - Output: Monthly CCM revenue potential
   - Output: Annual CCM revenue potential
   - Output: Revenue per provider
   - Output: Staffing ROI (revenue vs. staff costs)
   - Output: Net profit estimate
5. **Below results** -- CTA to book a free implementation strategy call (Cal.com link)
6. **Email capture** -- results emailed via Beehiiv (adds them to newsletter)

## Revenue Model
- $49 one-time payment via Stripe Checkout
- Upsell: Free strategy call -> Fractional COO contract ($5k-15k/month)
- Newsletter: Ongoing nurture via Beehiiv

## CCM Billing Rates (2026 CMS rates, approximate)
- **99490** (first 20 min): ~$62
- **99439** (each additional 20 min): ~$47
- **99491** (first 20 min, non-physician): ~$40
- Average revenue per patient per month: ~$62-109 depending on time spent
- Use $75/patient/month as conservative default

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Payments:** Stripe Checkout (one-time $49 payment)
- **Deployment:** Vercel
- **Domain:** TBD (Jeff sets DNS)

## Pages
1. `/` -- Landing page with sales copy + Stripe checkout button
2. `/api/checkout` -- API route: creates Stripe Checkout session
3. `/api/webhook` -- API route: Stripe webhook handler (marks payment complete)
4. `/calculator` -- The actual calculator (protected -- needs valid session/payment token)
5. `/success` -- Post-payment redirect, links to calculator

## Environment Variables (Vercel)
- `STRIPE_SECRET_KEY` = (set in Vercel env vars)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = (set in Vercel env vars)
- `STRIPE_WEBHOOK_SECRET` = (set after webhook creation)
- `NEXT_PUBLIC_APP_URL` = (Vercel deployment URL)

## Design Direction
- Clean, professional, healthcare-appropriate
- Color scheme: Deep blue (#1e3a5f) + white + accent green (#22c55e) for money/results
- No stock photos of doctors. Clean typography and data visualization.
- Mobile responsive
- Trust signals: "Built by healthcare operations experts" / "Used by 100+ practices" (aspirational)

## Calculator Logic
```
eligible_patients = total_patients * chronic_condition_pct
enrolled_patients = eligible_patients * enrollment_rate
monthly_revenue = enrolled_patients * revenue_per_patient_per_month
annual_revenue = monthly_revenue * 12

// Staffing ROI
patients_per_rn = 150 (typical CCM panel)
patients_per_lpn = 200
rn_cost_annual = 75000
lpn_cost_annual = 55000
ma_cost_annual = 40000

total_staff_cost = (num_rn * rn_cost_annual) + (num_lpn * lpn_cost_annual) + (num_ma * ma_cost_annual)
net_profit = annual_revenue - total_staff_cost
roi_pct = ((annual_revenue - total_staff_cost) / total_staff_cost) * 100
```

## Payment Protection (Simple)
- Stripe Checkout creates a session
- On success, redirect to `/success?session_id=xxx`
- `/success` page verifies the session with Stripe API server-side
- Sets a secure httpOnly cookie with a token
- Calculator page checks for valid cookie
- No database needed -- cookie-based access is fine for v1

## Copy Direction (Landing Page)
**Headline:** "Your Practice Is Leaving $_____ On The Table Every Month"
**Subhead:** "Most practices with 500+ Medicare patients are missing $30,000-$150,000/year in CCM revenue. Find out your exact number."
**CTA:** "Calculate My Revenue — $49"
**Below fold:** How CCM works, why most practices miss it, what the calculator shows you
**Social proof:** Jeff's credentials, practice transformation stats

## Cal.com Integration
- After calculator results, show: "Want help capturing this revenue? Book a free 30-minute implementation strategy call."
- Link to Jeff's Cal.com booking page
- This is the money conversion -- $49 product leads to $5k-15k/month contracts

## Deliverables
1. Complete Next.js application with all pages
2. Stripe Checkout integration (payment + webhook)
3. Calculator with all inputs/outputs and real-time calculation
4. Responsive design with Tailwind
5. Deployed to Vercel
6. GitHub repo with clean commits

## Out of Scope (v1)
- Database / user accounts
- Email delivery (v2: Beehiiv integration)
- PDF report generation (v2)
- Admin dashboard
- A/B testing
