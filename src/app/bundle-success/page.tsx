import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getStripe } from "@/lib/stripe";

interface PageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function BundleSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sessionId = params.session_id;

  if (!sessionId) {
    redirect("/");
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      redirect("/");
    }

    const tokenData = JSON.stringify({
      sessionId: session.id,
      paid: true,
      product: "bundle",
      ts: Date.now(),
    });
    const token = Buffer.from(tokenData).toString("base64");

    const cookieStore = await cookies();

    // Set both cookies for bundle access
    cookieStore.set("ccm_access", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
    cookieStore.set("rpm_access", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  } catch {
    redirect("/");
  }

  redirect("/dashboard");
}
