
// import DashboardSideBar from "@/Components/dashboardComponents/DashboardSideBar";

// const DashboardLayout = ({ children }) => {

//     // console.log(role);

//     return (
//         <div className="min-h-screen flex bg-[#080c16]">
//             <DashboardSideBar />
//             <div className="px-6 py-10 max-w-5xl w-full">
//                 {children}
//             </div>
//         </div>
//     );
// };
// // /dashboard/organizer 
// export default DashboardLayout;


import DashboardSideBar from "@/Components/dashboardComponents/DashboardSideBar";

const DashboardLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex bg-[#0D0D0D]">

            <DashboardSideBar />

            <main className="flex-1 overflow-y-auto">
                <div className="relative min-h-screen p-4 md:p-8 lg:p-10">

                    {/* Background Glow */}
                    <div className="absolute top-0 left-0 w-[350px] h-[350px] bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />

                    <div className="relative z-10 max-w-7xl mx-auto">
                        {children}
                    </div>

                </div>
            </main>

        </div>
    );
};

export default DashboardLayout;