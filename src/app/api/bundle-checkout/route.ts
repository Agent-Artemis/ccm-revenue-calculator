import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  try {
    const stripe = getStripe();
    const appUrl = (
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    ).trim();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "CCM + RPM Revenue Calculator Bundle",
              description:
                "Both calculators: Chronic Care Management AND Remote Patient Monitoring. Calculate your complete care management revenue potential. One-time payment, lifetime access.",
            },
            unit_amount: 4900,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      allow_promotion_codes: true,
      success_url: `${appUrl}/bundle-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Bundle Checkout error:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to create checkout session", detail: message },
      { status: 500 }
    );
  }
}
