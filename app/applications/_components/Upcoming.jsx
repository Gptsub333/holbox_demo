import React from 'react';

const Upcoming = ( { filteredUpcoming }) => {
  return (
    <>
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Upcoming Features</h2>
          <span className="text-sm text-gray-500">{filteredUpcoming.length} applications</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUpcoming.map((app, index) => {
            const IconComponent = app.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 border-dashed opacity-80 hover:opacity-100 transition-all duration-300 hover:shadow-md cursor-pointer group"
              >
                <div className="p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg mb-4 group-hover:bg-blue-50 transition-colors duration-200">
                    <IconComponent className="text-gray-400 group-hover:text-blue-500 text-xl w-6 h-6 transition-colors duration-200" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2 group-hover:text-gray-900 transition-colors">
                    {app.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{app.description}</p>
                  <div className="mb-4">
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                      Coming Soon
                    </span>
                  </div>
                  <button
                    disabled
                    className="w-full bg-gray-200 text-gray-500 py-2.5 px-4 rounded-lg text-sm font-medium cursor-not-allowed"
                  >
                    Not Available
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default Upcoming;
