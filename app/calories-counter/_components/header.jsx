"use client"

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">🍎</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Calorie Counter</h1>
            <p className="text-slate-600 text-sm">Smart nutrition analysis for your meals</p>
          </div>
        </div>
      </div>
    </header>
  )
}
