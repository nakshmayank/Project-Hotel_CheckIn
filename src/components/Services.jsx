const Services = () => {
  const services = [
    {
      image: "/service-checkin.png",
      alt: "Digital Check-In",
      title: "Digital Check-In",
      description: "Fast and paperless visitor check-in using intuitive digital forms. Reduce wait times and improve guest satisfaction.",
      color: "from-orange-500 to-orange-600"
    },
    {
      image: "/service-checkout.png",
      alt: "Instant Check-Out",
      title: "Instant Check-Out",
      description: "Streamlined check-out process with automatic time recording and instant confirmations. Complete in seconds.",
      color: "from-blue-500 to-blue-600"
    },
    {
      image: "/service-analytics.png",
      alt: "Smart Analytics",
      title: "Smart Analytics",
      description: "Real-time visitor tracking, detailed reports, and actionable insights to optimize your operations.",
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <section id="services" className="relative py-24 overflow-hidden" >
      <div className="absolute inset-0 bg-white -z-10"></div>
      <div className="absolute top-20 left-0 w-72 h-72 bg-orange-100/50 rounded-full blur-3xl -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20 space-y-4">
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-700 text-sm font-semibold rounded-full tracking-wide">OUR FEATURES</span>
          <h2 className="text-4xl font-bold text-gray-900 leading-tight">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive tools designed for modern hospitality management
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group relative border shadow-lg border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-4"
            >
              {/* <img src="/service-bg.png" alt="" /> */}
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                <img 
                  src={service.image} 
                  alt={service.alt}
                  className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-blue-600 group-hover:bg-clip-text transition-all duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {service.description}
                </p>
              </div>

              {/* Border accent */}
              <div className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${service.color} group-hover:w-full transition-all duration-300`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
