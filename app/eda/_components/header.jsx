import { BrainCircuit } from "lucide-react"
import Link from "next/link"

export default function Header() {
  // The dynamic part `[something]` is hardcoded as "Demo" as per the thought process.
  // In a real app, this could come from user session data.
  const contextName = "Demo"

  return (
    <header className="bg-white mb-10 border-b">
      <div className="container mx-auto  px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <div  className="flex items-center gap-2 text-xl font-semibold text-gray-800">
            <BrainCircuit className="h-7 w-7 text-blue-600" />
            <span>EDA  {contextName}
           <br></br>
            <p>Analysis of your data</p></span>
          </div>
        </div>
      </div>
    </header>
  )
}
