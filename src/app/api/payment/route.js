import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";

export async function POST(request) {
    try {
        const headersList = await headers();
        const origin = headersList.get("origin");

        const userSession = await auth.api.getSession({
            headers: await headers(),
        });

        const user = userSession?.user;
        const formData = await request.formData();
        const price = formData.get('price')
        const title = formData.get('title')
        const productId = formData.get('productId')
        console.log(user, price, title, productId)

        // Enforce Rule 1: Max 2 orders per day
        if (user?.id) {
            try {
                const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
                const limitRes = await fetch(`${serverUrl}/api/orders/daily-limit-check/${user.id}`, { cache: "no-store" });
                if (limitRes.ok) {
                    const limitData = await limitRes.json();
                    if (limitData.ordersToday >= 2) {
                        return NextResponse.redirect(`${origin}/all-books/${productId}?error=daily_limit_reached`, 303);
                    }
                }
            } catch (limitErr) {
                console.warn("Could not verify daily order limit:", limitErr);
            }
        }

        const session = await stripe.checkout.sessions.create({
            customer_email: user?.email,
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        unit_amount: Number(price) * 100,
                        product_data: {
                            name: title,
                        }
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                price: Number(price),
                userId: user.id,
                userEmail: user.email,
                title,
                productId,
            },
            shipping_address_collection: {
                allowed_countries: ["US", "CA", "GB", "BD", "IN"],
            },
            mode: "payment",
            success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/all-books/${productId}?payment_cancelled=true&title=${encodeURIComponent(title)}`,
        });
        return NextResponse.redirect(session.url, 303);
    } catch (err) {
        return NextResponse.json(
            { error: err.message },
            { status: err.statusCode || 500 },
        );
    }
}