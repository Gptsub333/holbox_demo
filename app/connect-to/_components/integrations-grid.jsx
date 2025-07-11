import Image from "next/image"

export default function IntegrationsGrid({ integrations }) {
  // Group integrations by their category.
  const groupedIntegrations = integrations.reduce((acc, integration) => {
    const { category } = integration
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(integration)
    return acc
  }, {})

  return (
    <section className="py-12">
      <div className="space-y-12">
        {/* Map over each category to create a section for it. */}
        {Object.entries(groupedIntegrations).map(([category, items]) => (
          <div key={category}>
            <h2 className="text-3xl font-bold mb-8 text-gray-800">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Map over the integrations within the current category. */}
              {items.map((item) => (
                <div
                  key={item.name}
                  className="bg-white border border-gray-200 rounded-xl p-4 flex items-center space-x-4 transition-all duration-300 hover:shadow-lg hover:border-blue-300 hover:-translate-y-1"
                >
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <Image
                      src={item.icon || "/placeholder.svg"}
                      alt={`${item.name} logo`}
                      width={32}
                      height={32}
                      className="rounded-md"
                    />
                  </div>
                  <span className="font-semibold text-gray-700">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
