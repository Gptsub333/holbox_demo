import HeroSection from "./_components/hero-section"
import IntegrationsGrid from "./_components/integrations-grid"
import Header from "./_components/header"

// Data for all the integrations, categorized for easy display.
const integrations = [
  { name: "Google Workspace", category: "Productivity/Office", icon: "https://cdn.brandfetch.io/id6O2oGzv-/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1731911483528"},
  { name: "Microsoft 365", category: "Productivity/Office", icon: "https://cdn.brandfetch.io/idEzoI2jXq/w/400/h/400/theme/dark/icon.png?c=1bxid64Mup7aczewSAYMX&t=1741363620635" },
  { name: "Notion", category: "Productivity/Office", icon: "https://cdn.brandfetch.io/idYnkdM3Ni/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1667896752278" },
   { name: "Slack", category: "Productivity/Office", icon: "https://cdn.brandfetch.io/idJ_HhtG0Z/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1745381282564" },
  { name: "confluence", category: "Productivity/Office", icon: "https://images.seeklogo.com/logo-png/33/1/confluence-logo-png_seeklogo-338595.png" },
  { name: "Trello", category: "Productivity/Office", icon: "https://cdn.brandfetch.io/idsyKUPKCC/w/400/h/400/theme/dark/icon.png?c=1bxid64Mup7aczewSAYMX&t=1748887969383" },
  { name: "Zoom", category: "Communication", icon: "https://cdn.brandfetch.io/id3aO4Szj3/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1667574547253" },
  { name: "Microsoft Teams", category: "Communication", icon: "https://www.bvoip.com/hs-fs/hubfs/microsoft%20teams%20logo.jpg?width=827&name=microsoft%20teams%20logo.jpg" },
  { name: "Discord", category: "Communication", icon: "https://cdn.brandfetch.io/idM8Hlme1a/w/400/h/400/theme/dark/icon.png?c=1bxid64Mup7aczewSAYMX&t=1667560105720" },
  { name: "Twilio", category: "Communication", icon: "https://cdn.brandfetch.io/idT7wVo_zL/w/349/h/349/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1694015441225" },
  { name: "WhatsApp", category: "Communication", icon: "https://cdn.brandfetch.io/id5qKmlGj8/w/400/h/400/theme/dark/icon.png?c=1bxid64Mup7aczewSAYMX&t=1744580518351" },
  { name: "Telegram", category: "Communication", icon: "https://cdn.brandfetch.io/id68S6e-Gp/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1740375618395" },
  { name: "Google Search", category: "Web/Data/Search", icon: "https://cdn.brandfetch.io/idjEIFBMpp/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1751271913568" },
  { name: "Wolfram Alpha", category: "Web/Data/Search", icon: "https://play-lh.googleusercontent.com/OceHg5bH7EsTRwl-lD7jjV9WM0mpj0oH4YfA-CSbjvfa7NCLQBu5-4cLwNlDvCUp5Q4" },
  { name: "Wikipedia", category: "Web/Data/Search", icon: "https://cdn.brandfetch.io/idAo3WRIoq/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1679406640804" },
  { name: "SerpAPI", category: "Web/Data/Search", icon: "https://cdn.brandfetch.io/idDaDfAv6E/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1747726778836" },
  { name: "GitHub", category: "Dev Tools/Automation", icon: "https://cdn.brandfetch.io/idZAyF9rlg/w/400/h/400/theme/dark/icon.png?c=1bxid64Mup7aczewSAYMX&t=1719469970995" },
  { name: "Jira", category: "Dev Tools/Automation", icon: "https://play-lh.googleusercontent.com/_AZCbg39DTuk8k3DiPRASr9EwyW058pOfzvAu1DsfN9ygtbOlbuucmXaHJi5ooYbokQX" },
  { name: "Zapier", category: "Dev Tools/Automation", icon: "https://cdn.brandfetch.io/idNMs_nMA0/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1667563370395" },
  { name: "IFTTT", category: "Dev Tools/Automation", icon: "https://cdn.brandfetch.io/id3lvq5eTN/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1749264827147" },
  { name: "Make", category: "Dev Tools/Automation", icon: "https://cdn.brandfetch.io/idVHU5hl7_/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1690469452864" },
  { name: "n8n", category: "Dev Tools/Automation", icon: "https://cdn.brandfetch.io/idO6_6uqJ9/w/600/h/600/theme/dark/icon.png?c=1bxid64Mup7aczewSAYMX&t=1667631203666" },
  { name: "LangChain", category: "Dev Tools/Automation", icon: "https://cdn.brandfetch.io/idzf7Sjo28/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1743558261168" },
  { name: "Shopify", category: "E-commerce/Payments", icon: "https://cdn.brandfetch.io/idAgPm7IvG/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1720758853203" },
  { name: "Stripe", category: "E-commerce/Payments", icon: "https://cdn.brandfetch.io/idxAg10C0L/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1746435900077" },
  { name: "PayPal", category: "E-commerce/Payments", icon: "https://cdn.brandfetch.io/id-Wd4a4TS/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1727787912707" },
  { name: "Amazon", category: "E-commerce/Payments", icon: "https://cdn.brandfetch.io/id-dL1jrX4/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1744288592423" },
  { name: "WooCommerce", category: "E-commerce/Payments", icon: "https://cdn.brandfetch.io/id0HloHs0j/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1740466354410" },
  { name: "Google Calendar", category: "Calendars/Meetings", icon: "https://avatars.slack-edge.com/2021-02-01/1725636648368_d0b4f2eca0834b833cb6_512.png" },
  { name: "Calendly", category: "Calendars/Meetings", icon: "https://cdn.brandfetch.io/idbJpTKFPT/w/400/h/400/theme/dark/icon.png?c=1bxid64Mup7aczewSAYMX&t=1667628252248" },
  { name: "Outlook Calendar", category: "Calendars/Meetings", icon: "https://avatars.slack-edge.com/2021-03-10/1838871109573_71ad0844bfc452d4fb6e_512.png" },
  { name: "Salesforce", category: "CRM/Support", icon: "https://cdn.brandfetch.io/idVE84WdIN/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1668516062674" },
  { name: "HubSpot", category: "CRM/Support", icon: "https://cdn.brandfetch.io/idRt0LuzRf/w/320/h/320/theme/dark/icon.png?c=1bxid64Mup7aczewSAYMX&t=1667565495880" },
  { name: "Zendesk", category: "CRM/Support", icon: "https://cdn.brandfetch.io/idNq8SRGPd/w/250/h/250/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1722967413331" },
  { name: "Intercom", category: "CRM/Support", icon: "https://cdn.brandfetch.io/idYJNDWF1m/theme/dark/symbol.svg?c=1bxid64Mup7aczewSAYMX&t=1668070639176" },
  { name: "Google Drive", category: "File/Cloud Storage", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEUnP3lusf9D3mZl15YDm2lUImJiH82Pi_-w&s" },
  { name: "Dropbox", category: "File/Cloud Storage", icon: "https://cdn.brandfetch.io/idY3kwH_Nx/w/400/h/400/theme/dark/icon.png?c=1bxid64Mup7aczewSAYMX&t=1691075441479" },
  { name: "Box", category: "File/Cloud Storage", icon: "https://cdn.brandfetch.io/idM5VbiYqH/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1667643777677" },
  { name: "OneDrive", category: "File/Cloud Storage", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3jYVz1ZKfVUO91XTBxkjxEZ2b6xJz7RG1lA&s" },
  { name: "X", category: "News/Social/Media", icon: "https://cdn.brandfetch.io/idS5WhqBbM/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1692089091886" },
  { name: "Reddit", category: "News/Social/Media", icon: "https://cdn.brandfetch.io/idkKwm0IT0/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1721371386405" },
  { name: "YouTube", category: "News/Social/Media", icon: "https://cdn.brandfetch.io/idVfYwcuQz/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1728452973407" },
  { name: "Meta", category: "News/Social/Media", icon: "https://cdn.brandfetch.io/idWvz5T3V7/w/400/h/400/theme/dark/icon.png?c=1bxid64Mup7aczewSAYMX&t=1691142640809" },
  { name: "Instagram", category: "News/Social/Media", icon: "https://cdn.brandfetch.io/ido5G85nya/w/1000/h/1000/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1724650629825" },
  { name: "OpenAI", category: "Other/AI/ML", icon: "https://cdn.brandfetch.io/idR3duQxYl/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1749527355219" },
  { name: "Google Cloud AI", category: "Other/AI/ML", icon: "https://cdn.brandfetch.io/idraDGOvr8/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1748275789099" },
  { name: "AWS AI", category: "Other/AI/ML", icon: "https://cdn.brandfetch.io/idVoqFQ-78/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1691083841359" },
  { name: "Azure AI", category: "Other/AI/ML", icon: "https://azure.microsoft.com/en-us/blog/wp-content/uploads/2021/05/95baa365-fedb-4d3c-8b1f-22735e3bb77a.webp" },
]

export default function IntegrationsPage() {
  return (
    <>
      <Header />
      {/* The main content area now has more generous padding (px-6 sm:px-8) */}
      <main className="container bg-[#F9F8F6] mx-auto px-6 sm:px-8 py-16">
        <HeroSection />
        <IntegrationsGrid integrations={integrations} />
      </main>
    </>
  )
}
