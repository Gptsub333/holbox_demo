import ClientLayout from "./client-layout"
import './globals.css'

export const metadata = {
  title: "AI Demo Interface",
  description: "Premium AI features showcase with modern design",
  generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
