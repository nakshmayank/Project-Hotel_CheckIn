const Partners = () => {
  const partners = [
    {
      name: "Hotel Royal",
      image: "/partner-royal.jpg",
      alt: "Hotel Royal",
      guests: "12,500+",
      rating: "4.8"
    },
    {
      name: "Grand Palace",
      image: "/partner-palace.jpg",
      alt: "Grand Palace",
      guests: "18,300+",
      rating: "4.9"
    },
    {
      name: "City Inn",
      image: "/partner-city.jpg",
      alt: "City Inn",
      guests: "8,900+",
      rating: "4.7"
    },
    {
      name: "Ocean View",
      image: "/partner-ocean.jpg",
      alt: "Ocean View",
      guests: "15,600+",
      rating: "4.8"
    }
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20 space-y-4">
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-700 text-sm font-semibold rounded-full tracking-wide">TRUSTED BY INDUSTRY LEADERS</span>
          <h2 className="text-4xl font-bold text-gray-900 leading-tight">
            500+ Hotels Love Our Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join a growing community of hotels transforming their guest experience
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="group relative bg-white border shadow-lg border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-4"
            >
              {/* Image Container */}
              <div className="relative h-40 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                <img 
                  src={partner.image} 
                  alt={partner.alt}
                  className="w-full h-full object-cover group-hover:scale-125 group-hover:-rotate-3 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Name */}
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                  {partner.name}
                </h3>

                {/* Divider */}
                <div className="w-12 h-1 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-24 transition-all duration-300"></div>

                {/* Stats */}
                <div className="space-y-3 pt-2">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Monthly Guests</p>
                    <p className="text-lg font-bold text-gray-900">{partner.guests}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Guest Rating</p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">{partner.rating}</span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-sm ${i < Math.floor(parseFloat(partner.rating)) ? "text-yellow-400" : "text-gray-300"}`}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom border accent */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-300"></div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center space-y-6">
          <p className="text-lg text-gray-600">
            Is your hotel ready to join industry leaders?
          </p>
          <button className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto">
            <span>Become a Partner</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export default Partners;
