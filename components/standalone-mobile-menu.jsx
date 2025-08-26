"use client"

import { useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"

export function StandaloneMobileMenu() {
  const menuRef = useRef(null)
  const toggleButtonRef = useRef(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Create global variables to control floating components
    window.openMobileSearch = () => {
      const event = new CustomEvent("openMobileSearch")
      document.dispatchEvent(event)
    }

    window.openMobileChat = () => {
      const event = new CustomEvent("openMobileChat")
      document.dispatchEvent(event)
    }

    // Create the mobile menu elements
    const menuContainer = document.createElement("div")
    menuContainer.id = "standalone-mobile-menu"
    menuContainer.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: none;
    `

    // Create the overlay
    const overlay = document.createElement("div")
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background-color: rgba(0,0,0,0.5);
      backdrop-filter: blur(4px);
      z-index: 9999;
    `

    // Create the menu content
    const menuContent = document.createElement("div")
    menuContent.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: 280px;
      background-color: white;
      box-shadow: 0 0 20px rgba(0,0,0,0.3);
      z-index: 10000;
      overflow-y: auto;
      padding: 16px;
    `

    // Add the menu header
    menuContent.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div style="font-weight: bold;">Menu</div>
        <button id="close-menu-button" style="background: none; border: none; cursor: pointer; padding: 8px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <nav style="display: flex; flex-direction: column; gap: 8px;">
        <a href="/" style="display: flex; align-items: center; padding: 12px; border-radius: 8px; background-color: ${pathname === "/" ? "#f3f4f6" : "transparent"
      }; color: ${pathname === "/" ? "#374151" : "#374151"}; text-decoration: none;">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style="margin-right: 12px;"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
          <span>Home</span>
        </a>
        
        <button id="open-search-button" onclick="openMobileSearch(); closeMenu();" style="display: flex; align-items: center; padding: 12px; border-radius: 8px; background-color: transparent; color: #374151; border: none; text-align: left; cursor: pointer;">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style="margin-right: 12px;"
        >
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>  
        </svg>
        <span>Applications</span>
        </button>
        
        <a href="/upcoming" style="display: flex; align-items: center; padding: 12px; border-radius: 8px; background-color: ${pathname === "/upcoming" ? "#f3f4f6" : "transparent"
      }; color: ${pathname === "/upcoming" ? "#374151" : "#374151"}; text-decoration: none;">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style="margin-right: 12px;"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
          <span>Up Coming</span>
        </a>

        <a href="/dashboard" style="display: flex; align-items: center; padding: 12px; border-radius: 8px; background-color: ${pathname === "/dashboard" ? "#f3f4f6" : "transparent"
      }; color: ${pathname === "/dashboard" ? "#374151" : "#374151"}; text-decoration: none;">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          fill="none" 
          viewBox="0 0 24 24"
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round"
          strokeLinejoin="round"
          style="margin-right: 12px;"
        >
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
          <span>Dashboard</span>
        </a>

        <a href="/connect-to" style="display: flex; align-items: center; padding: 12px; border-radius: 8px;
      background-color: ${pathname === "/connect-to" ? "#f3f4f6" : "transparent"};
      color: #374151; text-decoration: none;">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        fill="none" 
        viewBox="0 0 24 24"
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round"
        strokeLinejoin="round"
        style="margin-right: 12px;"
      >
        <circle cx="18" cy="5" r="3"></circle>
        <circle cx="6" cy="12" r="3"></circle>
        <circle cx="18" cy="19" r="3"></circle>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
      </svg>
      <span>ConnectTo</span>
    </a>
        
    <button id="open-chat-button" onclick="openMobileChat(); closeMenu();" style="display: flex; align-items: center; padding: 12px; border-radius: 8px; background-color: #1E88E5; color: white; border: none; text-align: left; cursor: pointer; margin-top: 16px;">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style="margin-right: 12px;">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <span>Open AI Assistant</span>
    </button>
    </nav>
    `

    // Append elements to the container
    menuContainer.appendChild(overlay)
    menuContainer.appendChild(menuContent)

    // Append the container to the body
    document.body.appendChild(menuContainer)

    // Create the toggle button
    const toggleButton = document.createElement("button")
    toggleButton.id = "standalone-toggle-button"
    toggleButton.style.cssText = `
      position: fixed;
      top: 16px;
      left: 16px;
      z-index: 9998;
      display: none; /* Hidden by default, shown via media query */
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background-color: white;
      border-radius: 50%;
      border: 1px solid #e5e7eb;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      cursor: pointer;
    `
    toggleButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    `
    document.body.appendChild(toggleButton)

    // Add media query style to only show on mobile
    const mediaQueryStyle = document.createElement("style")
    mediaQueryStyle.textContent = `
      @media (max-width: 767px) {
        #standalone-toggle-button {
          display: flex !important;
        }
      }
      @media (min-width: 768px) {
        #standalone-toggle-button, #standalone-mobile-menu {
          display: none !important;
        }
      }
    `
    document.head.appendChild(mediaQueryStyle)

    // Add script for menu functions
    const menuScript = document.createElement("script")
    menuScript.textContent = `
      function openMenu() {
        console.log("Opening menu");
        document.getElementById('standalone-mobile-menu').style.display = "block";
        document.body.style.overflow = "hidden";
      }

      function closeMenu() {
        console.log("Closing menu");
        document.getElementById('standalone-mobile-menu').style.display = "none";
        document.body.style.overflow = "";
      }
    `
    document.head.appendChild(menuScript)

    // Add event listeners
    toggleButton.addEventListener("click", (e) => {
      console.log("Toggle button clicked", e)
      window.openMenu()
    })

    overlay.addEventListener("click", () => window.closeMenu())

    // We need to wait for the DOM to be fully updated
    setTimeout(() => {
      const closeButton = document.getElementById("close-menu-button")
      if (closeButton) {
        closeButton.addEventListener("click", () => window.closeMenu())
      }
    }, 100)

    // Store references
    menuRef.current = menuContainer
    toggleButtonRef.current = toggleButton

    // Clean up on unmount
    return () => {
      document.body.removeChild(menuContainer)
      document.body.removeChild(toggleButton)
      document.head.removeChild(mediaQueryStyle)
      document.head.removeChild(menuScript)
    }
  }, [pathname])

  return null
}
