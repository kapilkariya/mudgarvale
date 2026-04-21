import React, { useEffect, useState } from 'react'

const Products = () => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
  }, [])

  return (
    <div>
      <div className="w-full" style={{ height: '70px', backgroundColor: '#5C3A21' }}></div>

      <div className="w-full min-h-[250px] sm:min-h-[300px] md:min-h-[500px] lg:min-h-[600px] rounded-2xl overflow-hidden relative bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/bg4.png')" }}>
        <div className="absolute inset-0 flex items-start justify-center pt-4 sm:pt-8 md:pt-12 lg:pt-16">
          <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-black tracking-wider md:tracking-widest text-center px-4 text-[#6b3a10]" style={{ fontFamily: 'Georgia, serif' }}>
            MEET OUR COMPLETE LINEUP
          </h2>
        </div>
      </div>

      <div className="bg-[#fdf6ec] px-4 md:px-8 py-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>All Products</h1>
          <p className="text-gray-500 mt-1">{products.length} products</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <div key={product.id} className="flex flex-col">
              <div className="rounded-xl overflow-hidden aspect-square">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="mt-3 px-1">
                <h3 className="text-sm md:text-base font-medium text-gray-800 text-center">{product.name}</h3>
                <div className="flex items-center justify-center gap-1 mt-1 flex-wrap text-center">
                  <span className="text-xs text-gray-500">From</span>
                  <span className="text-sm font-semibold text-gray-800">
                    Rs. {product.price?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      Rs. {product.originalPrice?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  )}
                </div>
                {product.tag && (
                  <p className="text-xs text-gray-500 text-center mt-0.5">{product.tag}</p>
                )}
                <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                  {product.emi && (
                    <span className="text-xs text-gray-500">or {product.emi}/Month</span>
                  )}
                  {product.emiLink && (
                    <a href={product.emiLink} className="text-xs bg-[#5C3A21] text-white px-2 py-0.5 rounded font-medium">
                      Buy on EMI›
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Products