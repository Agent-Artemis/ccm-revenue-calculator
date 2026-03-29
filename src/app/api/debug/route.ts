import { NextResponse } from "next/server";

export async function GET() {
  const hasStripeKey = !!process.env.STRIPE_SECRET_KEY;
  const keyPrefix = process.env.STRIPE_SECRET_KEY
    ? process.env.STRIPE_SECRET_KEY.substring(0, 12) + "..."
    : "NOT SET";
  const hasPublishable = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "NOT SET";

  return NextResponse.json({
    hasStripeKey,
    keyPrefix,
    hasPublishable,
    appUrl,
    nodeEnv: process.env.NODE_ENV,
  });
}
