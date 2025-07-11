import HeroAnimation from "./hero-animation"

export default function HeroSection() {
  return (
    <section className="grid lg:grid-cols-2 items-center gap-12 lg:gap-16 mb-16 md:mb-20">
      {/* Left Column: Text Content */}
      <div className="text-center lg:text-left">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
          Connect Your Agents to All Your Favorite Tools{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-400">in one place.</span>
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto lg:mx-0">
          Seamlessly integrate with dozens of productivity, communication, dev tools, and more.
        </p>
      </div>

      {/* Right Column: Animation */}
      <div className="relative w-full flex items-center justify-center min-h-[350px] lg:min-h-[400px]">
        <HeroAnimation />
      </div>
    </section>
  )
}
