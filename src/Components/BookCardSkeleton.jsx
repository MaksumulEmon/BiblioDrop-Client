import { Skeleton } from "@heroui/react";

const BookCardSkeleton = () => {
    return (
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-5">

            <Skeleton className="rounded-2xl">
                <div className="h-64 w-full rounded-2xl bg-[#262626]" />
            </Skeleton>

            <div className="mt-5 space-y-4">

                <Skeleton className="rounded-xl">
                    <div className="h-6 w-3/4 bg-[#262626]" />
                </Skeleton>

                <Skeleton className="rounded-xl">
                    <div className="h-4 w-1/2 bg-[#262626]" />
                </Skeleton>

                <Skeleton className="rounded-xl">
                    <div className="h-10 w-full bg-[#262626]" />
                </Skeleton>

            </div>
        </div>
    );
};

export default BookCardSkeleton;