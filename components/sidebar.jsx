// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { Grid, CalendarClock, Home, MessageSquare, ChevronDown, X, LayoutDashboard, Share2 } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// // import { UserButton, useUser } from "@clerk/nextjs"
// import OrgNameHeader from "./OrgNameHeader"
// import Loader from "@/components/Loader"; // Adjust the path according to your file structure

// const chatbotTypes = [
//   { name: "AI Assistant", id: "general" },
//   { name: "Traffic Bot", id: "traffic" },
//   { name: "Health Bot", id: "health" },
// ]

// export function Sidebar({
//   onOpenSearch,
//   onOpenChat,
//   isMobileOpen,
//   isDesktopOpen = true,
//   onMobileClose,
//   onDesktopToggle,
// }) {
//   const pathname = usePathname()
//   const [activeChatbot, setActiveChatbot] = useState(chatbotTypes[0])

//   // Close sidebar when clicking outside on mobile
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       const sidebar = document.getElementById("mobile-sidebar")
//       if (
//         isMobileOpen &&
//         sidebar &&
//         !sidebar.contains(event.target) &&
//         !event.target.closest('button[aria-label="Toggle sidebar"]')
//       ) {
//         onMobileClose()
//       }
//     }

//     if (isMobileOpen) {
//       document.addEventListener("mousedown", handleClickOutside)
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [isMobileOpen, onMobileClose])

//   return (
//     <>
//       {/* Desktop sidebar */}
//       <div
//         className={cn(
//           "hidden md:flex h-full bg-gray-200 text-gray-800 flex-col z-10",
//           "transition-all duration-300 ease-in-out",
//           isDesktopOpen ? "w-56" : "w-0 overflow-hidden",
//         )}
//       >
//         <SidebarContent
//           pathname={pathname}
//           activeChatbot={activeChatbot}
//           setActiveChatbot={setActiveChatbot}
//           onOpenSearch={onOpenSearch}
//           onOpenChat={onOpenChat}
//           onMobileClose={onMobileClose}
//         />
//       </div>

//       {/* Mobile sidebar - overlay style */}
//       <div
//         id="mobile-sidebar"
//         className={cn(
//           "fixed inset-y-0 left-0 z-50 w-56 bg-gray-200 transform transition-transform duration-300 ease-in-out md:hidden",
//           "flex flex-col h-full rounded-r-xl shadow-lg", // Added rounded corners and shadow
//           isMobileOpen ? "translate-x-0" : "-translate-x-full",
//         )}
//       >
//         <div className="flex justify-end p-4">
//           <Button variant="ghost" size="icon" onClick={onMobileClose} className="rounded-full hover:bg-gray-300">
//             <X className="h-5 w-5" />
//             <span className="sr-only">Close sidebar</span>
//           </Button>
//         </div>

//         <SidebarContent
//           pathname={pathname}
//           activeChatbot={activeChatbot}
//           setActiveChatbot={setActiveChatbot}
//           onOpenSearch={onOpenSearch}
//           onOpenChat={onOpenChat}
//           isMobile={true}
//           onMobileClose={onMobileClose}
//         />
//       </div>
//     </>
//   )
// }

// // Extracted sidebar content to avoid duplication
// function SidebarContent({
//   pathname,
//   activeChatbot,
//   setActiveChatbot,
//   onOpenSearch,
//   onOpenChat,
//   isMobile = false,
//   onMobileClose,
// }) {

//   // const { user,isLoaded } = useUser();

//   const [orgName, setOrgName] = useState("Holbox AI Demo"); // fallback for dev/local/test
//   const [loading, setLoading] = useState(true);

//   // useEffect(() => {
//   //   const fetchOrgName = async () => {
//   //     try {
//   //       const cachedName = localStorage.getItem("orgName"); // Check if it's already stored
//   //       if (cachedName) {
//   //         setOrgName(cachedName);
//   //         setLoading(false); // If it's already cached, no need to load again
//   //       } else {
//   //         const res = await fetch('/api/org-name');
//   //         const data = await res.json();
//   //         if (data.orgName) {
//   //           setOrgName(data.orgName); // Set the organization name after fetching
//   //           // localStorage.setItem("orgName", data.orgName); // Store it in localStorage
//   //         }
//   //         setLoading(false);
//   //       }
//   //     } catch (err) {
//   //       console.error("Error fetching organization name:", err);
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchOrgName(); // Call the fetch function
//   // }, []);
//   // Fetch orgName from localStorage or set the default

// //  const [email, setEmail] = useState(null);

// //   const [userId, setUserId] = useState(null);
// //    useEffect(() => {
// //     if (isLoaded && user) {
// //       console.log("User data loaded:", user); // Log the entire user object
// //       const uniqueUserId = user.id; // Access the unique user ID
// //       setUserId(uniqueUserId); // Set the unique user ID in state
// //       console.log("Unique User ID:", uniqueUserId); // Log unique user ID
// //     } else {
// //       console.log("User data is not yet loaded");
// //     }
// //   }, [isLoaded, user]);
// //  useEffect(() => {
// //     if (isLoaded && user) {
// //       console.log("User data loaded:", user); // Log the entire user object
// //       if (user.emailAddresses && user.emailAddresses.length > 0) {
// //         setEmail(user.emailAddresses[0].emailAddress); // Set the primary email
// //         console.log("User's email address:", user.emailAddresses[0].emailAddress); // Log email
// //       } else {
// //         console.log("No email found for the user");
// //       }
// //     } else {
// //       console.log("User data is not yet loaded");
// //     }
// //   }, [isLoaded, user]);

//   useEffect(() => {
//     const savedOrgName = localStorage.getItem("orgName");
//     if (savedOrgName) {
//       setOrgName(savedOrgName); // If saved in localStorage, use that
//       setLoading(false);

//     } else {
//       // If nothing is saved, set default value
//       setOrgName("Holbox AI Demo");
//       setLoading(false);
//     }
//   }, []);

//   return (
//     <div className="flex flex-col h-full p-3 rounded-xl border border-gray-300 bg-white shadow-sm">
//       <div className="p-2.5 mb-3 rounded-xl bg-gray-100 shadow-inner">
//         <div className="flex items-center justify-center md:justify-start">
//           <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               className="w-3.5 h-3.5 text-white"
//             >
//               <path d="M12 2L2 7l10 5 10-5-10-5z" />
//               <path d="M2 17l10 5 10-5" />
//               <path d="M2 12l10 5 10-5" />
//             </svg>
//           </div>
//           {/* Conditionally render the OrgNameHeader when orgName is fetched */}
//           {loading ? (
//             <Loader /> // Render your loader component while loading
//           ) : (
//             <OrgNameHeader orgName={orgName} setOrgName={setOrgName} />
//           )}

//         </div>
//       </div>

//       <div className="flex-1 py-3 overflow-y-auto">
//         <nav className="space-y-1.5">
//           <Link
//             href="/"
//             className={cn(
//               "flex items-center justify-center md:justify-start w-full p-2.5 rounded-xl",
//               "text-gray-700 hover:bg-gray-100 hover:shadow-sm transition-all",
//               pathname === "/" ? "bg-gray-100 shadow-sm text-blue-600 font-medium" : "",
//               "focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500",
//               isMobile ? "justify-start" : "",
//             )}
//             onClick={isMobile ? onMobileClose : undefined}
//           >
//             <Home className="w-3.5 h-3.5" />
//             <span className={cn("ml-2.5 text-xs", isMobile ? "inline-block" : "hidden md:inline-block")}>
//               Home
//             </span>
//           </Link>

//           <button
//             onClick={onOpenSearch}
//             className={cn(
//               "flex items-center justify-center md:justify-start w-full p-2.5 rounded-xl",
//               "text-gray-700 hover:bg-gray-100 hover:shadow-sm transition-all",
//               "focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500",
//               isMobile ? "justify-start" : "",
//             )}
//           >
//             <Grid className="w-3.5 h-3.5" />
//             <span className={cn("ml-2.5 text-xs", isMobile ? "inline-block" : "hidden md:inline-block")}>
//               Applications
//             </span>
//           </button>

//           <Link
//             href="/upcoming"
//             className={cn(
//               "flex items-center justify-center md:justify-start w-full p-2.5 rounded-xl",
//               "text-gray-700 hover:bg-gray-100 hover:shadow-sm transition-all",
//               pathname === "/upcoming" ? "bg-gray-100 shadow-sm text-blue-600 font-medium" : "",
//               "focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500",
//               isMobile ? "justify-start" : "",
//             )}
//             onClick={isMobile ? onMobileClose : undefined}
//           >
//             <CalendarClock className="w-3.5 h-3.5" />
//             <span className={cn("ml-2.5 text-xs", isMobile ? "inline-block" : "hidden md:inline-block")}>
//               Up Coming
//             </span>
//           </Link>
//           <Link
//             href="/dashboard"
//             className={cn(
//               "flex items-center justify-center md:justify-start w-full p-2.5 rounded-xl",
//               "text-gray-700 hover:bg-gray-100 hover:shadow-sm transition-all",
//               pathname === "/dashboard" ? "bg-gray-100 shadow-sm text-blue-600 font-medium" : "",
//               "focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500",
//               isMobile ? "justify-start" : "",
//             )}
//             onClick={isMobile ? onMobileClose : undefined}
//           >
//             <LayoutDashboard className="w-3.5 h-3.5" />
//             <span className={cn("ml-2.5 text-xs", isMobile ? "inline-block" : "hidden md:inline-block")}>
//               Dashboard
//             </span>
//           </Link>
//           <Link
//             href="/connect-to"
//             className={cn(
//               "flex items-center justify-center md:justify-start w-full p-2.5 rounded-xl",
//               "text-gray-700 hover:bg-gray-100 hover:shadow-sm transition-all",
//               pathname === "/connect-to" ? "bg-gray-100 shadow-sm text-blue-600 font-medium" : "",
//               "focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500",
//               isMobile ? "justify-start" : "",
//             )}
//             onClick={isMobile ? onMobileClose : undefined}
//           >
//             <Share2 className="w-3.5 h-3.5" />
//             <span className={cn("ml-2.5 text-xs", isMobile ? "inline-block" : "hidden md:inline-block")}>
//               ConnectTo
//             </span>
//           </Link>
//         </nav>
//       </div>

//         {/* <div className="flex items-center justify-center gap-2"> */}

//        {/* <div className="flex items-center justify-center gap-2">

//         <UserButton />
//         <div className="flex flex-col leading-tight">
//           <span className="text-sm font-medium text-gray-700">
//             {user?.fullName || "User"}
//           </span>
//           {user?.fullName === "GPT Subscription" && (
//             <span className="text-[11px] font-semibold text-gray-600 -mt-0.5">
//               Admin
//             </span>
//           )}
//         </div>

//       </div>

//       </div>  */}

//       {/* <div>

//        Display email address if it's available
//       {email ? (
//         <div>Email: {email}</div>
//       ) : (
//         <div>Loading email...</div>
//       )}
//     </div>
//      <div>
//       {/* Display user ID if it's available */}
//       {/* {userId ? (
//         <div>User ID: {userId}</div>
//       ) : (
//         <div>Loading user ID...</div>
//       )}
//     </div>  */}

//       <div className="p-2.5 mt-auto">
//         <div className="rounded-xl bg-white shadow-sm p-2.5">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button
//                 className={cn(
//                   "w-full bg-blue-600 text-white hover:bg-blue-700 border-0 rounded-lg py-1.5 px-2.5 h-auto text-xs",
//                   isMobile || !isMobile ? "justify-start" : "justify-center md:justify-start",
//                 )}
//               >
//                 <MessageSquare className="w-3.5 h-3.5 md:mr-2" />
//                 <span className={cn(isMobile ? "inline-block" : "hidden md:inline-block")}>{activeChatbot.name}</span>
//                 <ChevronDown
//                   className={cn("ml-auto h-2.5 w-2.5", isMobile ? "inline-block" : "hidden md:inline-block")}
//                 />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-[180px] bg-gray-100 shadow-lg  z-20 ">
//               {chatbotTypes.map((bot) => (
//                 <DropdownMenuItem
//                   key={bot.id}
//                   onClick={() => {
//                     setActiveChatbot(bot)
//                     onOpenChat(bot)
//                   }}
//                   className="text-xs py-1.5 bg-gray-100 hover:bg-white-200 rounded-lg transition-white-all"
//                 >
//                   {bot.name}
//                 </DropdownMenuItem>
//               ))}
//             </DropdownMenuContent>
//           </DropdownMenu>

//         </div>
//       </div>
//     </div>
//   )
// }

// 'use client';

// import Link from 'next/link';
// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { BarChart3, Briefcase, Settings, DollarSign, Crown, Grid, LayoutDashboard, Share2, About } from 'lucide-react';

// const OmniLogo = () => (
//   <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
//     <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
//   </div>
// );

// const TooltipLabel = ({ text, show }) => (
//   <div
//     className={`absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-md text-sm whitespace-nowrap z-[9999] transition-all duration-300 ease-out pointer-events-none ${
//       show ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-4 scale-95'
//     }`}
//     style={{
//       boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
//     }}
//   >
//     {text}
//     <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
//   </div>
// );

// export default function Sidebar({ onViewChange, isMobileOpen, onMobileToggle, onOpenSearch }) {
//   const [hoveredItem, setHoveredItem] = useState(null);

//   return (
//     <div
//       className={`fixed left-0 top-0 bottom-0 w-16 bg-white border-r border-gray-200 flex flex-col z-50 transition-transform duration-300 ease-in-out ${
//         isMobileOpen ? 'translate-x-0' : '-translate-x-full'
//       } md:translate-x-0`}
//     >
//       {/* Header */}
//       <Link href="/" className="p-4 border-b border-gray-200">
//         <div
//           className="relative flex items-center justify-center"
//           onMouseEnter={() => setHoveredItem('omni-agent')}
//           onMouseLeave={() => setHoveredItem(null)}
//         >
//           <OmniLogo />
//           {hoveredItem === 'omni-agent' && <TooltipLabel text="Agent AI" show={true} />}
//         </div>
//       </Link>

//       {/* Navigation */}
//       <div className="flex-1 py-4">
//         <nav className="space-y-2 px-2">
//           <Link
//             href="/dashboard"
//             className="relative"
//             onMouseEnter={() => setHoveredItem('dashboards')}
//             onMouseLeave={() => setHoveredItem(null)}
//           >
//             <Button
//               variant="ghost"
//               className="w-full justify-center text-gray-700 hover:bg-gray-100 h-10"
//               onClick={() => {
//                 onViewChange?.('dashboard');
//                 onMobileToggle?.(false);
//               }}
//               href="/dashboard"
//             >
//               <BarChart3 href="/dashboard" className="w-5 h-5" />
//             </Button>
//             {hoveredItem === 'dashboards' && <TooltipLabel text="Dashboards" show={true} />}
//           </Link>

//           {/* <div 
//             className="relative"
//             onMouseEnter={() => setHoveredItem("Applications")}
//             onMouseLeave={() => setHoveredItem(null)}
//              onClick={onOpenSearch}
//           > */}

//           <Link
//             href="/applications"
//             className="relative"
//             onMouseEnter={() => setHoveredItem('Applications')}
//             onMouseLeave={() => setHoveredItem(null)}
//           >
//             <Button
//               variant="ghost"
//               className="w-full justify-center text-gray-700 hover:bg-gray-100 h-10"
//               onClick={() => onMobileToggle?.(false)}
//             >
//               <Grid className="w-5 h-5" />
//             </Button>
//             {hoveredItem === 'Applications' && <TooltipLabel text="Applications" show={true} />}
//           </Link>
//           {/* </div> */}

//           <Link
//             href="/upcoming"
//             className="relative"
//             onMouseEnter={() => setHoveredItem('Up Coming')}
//             onMouseLeave={() => setHoveredItem(null)}
//           >
//             <Button
//               variant="ghost"
//               className="w-full justify-center text-gray-700 hover:bg-gray-100 h-10"
//               onClick={() => onMobileToggle?.(false)}
//             >
//               <Briefcase className="w-5 h-5" />
//             </Button>
//             {hoveredItem === 'Up Coming' && <TooltipLabel text="Up Coming" show={true} />}
//           </Link>

//           <Link
//             href="/connect-to"
//             className="relative"
//             onMouseEnter={() => setHoveredItem('ConnectTo')}
//             onMouseLeave={() => setHoveredItem(null)}
//           >
//             <Button
//               variant="ghost"
//               className="w-full justify-center text-gray-700 hover:bg-gray-100 h-10"
//               onClick={() => onMobileToggle?.(false)}
//             >
//               <Share2 className="w-5 h-5" />
//             </Button>
//             {hoveredItem === 'ConnectTo' && <TooltipLabel text="Connect To" show={true} />}
//           </Link>
//           <Link
//             href="/about"
//             className="relative"
//             onMouseEnter={() => setHoveredItem('about')}
//             onMouseLeave={() => setHoveredItem(null)}
//           >
//             <Button
//               variant="ghost"
//               className="w-full justify-center text-gray-700 hover:bg-gray-100 h-10"
//               onClick={() => onMobileToggle?.(false)}
//             >
//               <LayoutDashboard className="w-5 h-5" />
//             </Button>
//             {hoveredItem === 'about' && <TooltipLabel text="About" show={true} />}
//           </Link>
//         </nav>
//       </div>

//       {/* Premium Plan */}
//       <div className="p-2 border-t border-gray-200">
//         <div
//           className="relative"
//           onMouseEnter={() => setHoveredItem('premium')}
//           onMouseLeave={() => setHoveredItem(null)}
//         >
//           <Button
//             className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white h-10"
//             onClick={() => onMobileToggle?.(false)}
//           >
//             <Crown className="w-5 h-5" />
//           </Button>
//           {hoveredItem === 'premium' && <TooltipLabel text="Premium Plan" show={true} />}
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { LayoutDashboard, AppWindow, Clock, Plug, Info, Crown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Sidebar({ isMobileOpen }) {
  const [hoveredItem, setHoveredItem] = useState(null);
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', Icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/applications', Icon: AppWindow, label: 'Applications' },
    { href: '/upcoming', Icon: Clock, label: 'Upcoming' },
    { href: '/connect-to', Icon: Plug, label: 'Connect To' },
    { href: '/about', Icon: Info, label: 'About' },
  ];

  return (
    <div
      className={`fixed left-0 top-0 bottom-0 w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 z-50 transition-transform duration-300 ease-in-out ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      {/* Logo */}
      <Link href="/">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
          <div className="w-4 h-4 bg-white rotate-45 rounded-sm" />
        </div>
      </Link>

      {/* Navigation Items */}
      <div className="flex flex-col items-center space-y-4 mt-6">
        {navItems.map(({ href, Icon, label }) => {
          const isActive = pathname === href;

          return (
            <Link href={href} key={label}>
              <div
                onMouseEnter={() => setHoveredItem(label)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`relative flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 ${
                  isActive ? 'bg-blue-100 text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {hoveredItem === label && (
                  <div className="absolute left-14 z-50 bg-black text-white text-xs px-2 py-1 rounded shadow-md whitespace-nowrap">
                    {label}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Premium CTA */}
      <div className="mt-auto mb-4">
        <Link href="/premium">
          <div
            onMouseEnter={() => setHoveredItem('Premium Plan')}
            onMouseLeave={() => setHoveredItem(null)}
            className={`relative flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 ${
              pathname === '/premium' ? 'bg-yellow-100 text-yellow-600 shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Crown className="w-5 h-5" />
            {hoveredItem === 'Premium Plan' && (
              <div className="absolute left-14 z-50 bg-black text-white text-xs px-2 py-1 rounded shadow-md whitespace-nowrap">
                Premium Plan
              </div>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}
