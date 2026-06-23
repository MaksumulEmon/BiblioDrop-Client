import BookCardSkeleton from "@/Components/BookCardSkeleton";

export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto py-10">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {[...Array(8)].map((_, i) => (
                    <BookCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}