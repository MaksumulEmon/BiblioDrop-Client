import { stripe } from '@/lib/stripe'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Truck, BookOpen, ArrowRight } from 'lucide-react'

export default async function Success({ searchParams }) {
    const { session_id } = await searchParams

    if (!session_id)
        throw new Error('Please provide a valid session_id (`cs_test_...`)')

    const session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ['line_items', 'payment_intent']
    })

    const { status, metadata, customer_details } = session

    if (status === 'open') {
        return redirect('/')
    }

    if (status === 'complete') {
        const addressObj = session.shipping_details?.address || customer_details?.address;
        const formattedAddress = addressObj
            ? `${addressObj.line1 || ""}, ${addressObj.line2 || ""}, ${addressObj.city || ""}, ${addressObj.state || ""}, ${addressObj.postal_code || ""}, ${addressObj.country || ""}`.replace(/^[,\s]+|[,\s]+$/g, '').replace(/\s*,\s*,+/g, ',')
            : "Not provided";

        let confirmError = null;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/payments/confirm`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    transactionId: session_id,
                    userId: metadata.userId,
                    userEmail: metadata.userEmail,
                    userName: customer_details?.name || "Reader",
                    bookId: metadata.productId,
                    amount: metadata.price,
                    address: formattedAddress
                })
            });
            if (!res.ok) {
                confirmError = "Backend confirmation returned non-200 status";
            }
        } catch (err) {
            console.error(err);
            confirmError = err.message;
        }

        return (
            <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
                {/* Background Glows */}
                <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-green-500/10 blur-3xl rounded-full pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />

                <div className="relative z-10 max-w-xl w-full bg-slate-900/60 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl text-center">
                    
                    {/* Success Icon */}
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 mb-6 animate-pulse">
                        <CheckCircle2 size={44} />
                    </div>

                    <h1 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                        Payment Successful!
                    </h1>
                    
                    <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                        Your delivery request has been successfully created. The librarian will prepare and dispatch your book shortly.
                    </p>

                    {/* Book & Delivery Summary Card */}
                    <div className="bg-slate-950/80 border border-white/5 rounded-2xl p-5 text-left mb-8 space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="p-2 bg-white/5 border border-white/10 rounded-lg text-purple-400">
                                <BookOpen size={18} />
                            </span>
                            <div>
                                <p className="text-xs text-slate-500">Book Requested</p>
                                <p className="text-sm font-bold text-white">{metadata.title}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 border-t border-white/5 pt-3">
                            <span className="p-2 bg-white/5 border border-white/10 rounded-lg text-blue-400">
                                <Truck size={18} />
                            </span>
                            <div className="overflow-hidden">
                                <p className="text-xs text-slate-500">Delivery Address</p>
                                <p className="text-sm font-semibold text-slate-300 truncate">{formattedAddress}</p>
                            </div>
                        </div>
                    </div>

                    {confirmError && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-left">
                            <p className="font-semibold mb-1">Warning: Confirmation Status</p>
                            <p>We recorded your payment but had trouble communicating with the delivery dispatch. Our librarians will manually verify this request. Trans ID: {session_id}</p>
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link 
                            href="/dashboard/user/deliveries"
                            className="flex-grow flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition py-3.5 px-6 rounded-xl font-bold"
                        >
                            Track Delivery
                            <ArrowRight size={16} />
                        </Link>
                        
                        <Link 
                            href="/all-books"
                            className="flex-grow py-3.5 px-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition font-bold text-slate-300 hover:text-white"
                        >
                            Browse More
                        </Link>
                    </div>

                </div>
            </div>
        )
    }
}