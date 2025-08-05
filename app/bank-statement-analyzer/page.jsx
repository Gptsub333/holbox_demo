import Header from "./_components/header"
import SampleSelection from "./_components/sampleselection"

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      <Header />
      <main className="flex flex-col items-center p-4 pt-8 md:p-12">
        <div className="w-full max-w-6xl mx-auto">
          <SampleSelection />
        </div>
      </main>
    </div>
  )
}
