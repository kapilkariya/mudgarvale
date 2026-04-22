import React, { useEffect, useState } from 'react';
const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="bg-[#f3eadf] text-[#3a1f0f]">
      <div className="w-full" style={{ height: '75px', backgroundColor: '#5C3A21' }}></div>

      {/* HERO */}
      <section className="relative h-[85vh] flex items-center justify-center mt-19">
        <img
          src="/images/abousus-hero.png"
          className="absolute w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>

        <h1 className="relative text-white text-center font-serif text-5xl md:text-6xl leading-tight">
          The Story <br /> Behind Mudgarvale
        </h1>
      </section>

      {/* ICON + INTRO */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">

          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full border border-[#d6c4b2] flex items-center justify-center text-2xl">
              🌿
            </div>
          </div>

          <h2 className="font-serif text-4xl mb-6">
            Preserving Tradition, Empowering Fitness
          </h2>

          <p className="text-[#5c3d2e] leading-8 text-lg">
            At Mudgarvale, we believe fitness goes beyond simple exercise — it is a journey
            that connects you with tradition, strengthens your body, and enhances your lifestyle.
            Our handcrafted tools, inspired by ancient training practices, combine cultural
            heritage with modern usability. Every movement you make becomes part of a timeless
            tradition rooted in strength, resilience, and growth.
          </p>
        </div>
      </section>

      {/* OUR STORY TITLE */}
      <section className="text-center pb-10">
        <h2 className="font-serif text-4xl">Our Story</h2>
      </section>

      {/* STORY GRID - FIRST */}
      <section className="px-6 md:px-20 pb-20">
        <div className="grid md:grid-cols-2 gap-14 items-start max-w-6xl mx-auto">

          <div className="space-y-6 text-[#5c3d2e] leading-7 text-[15px]">
            <p>
              Mudgarvale started as a vision of a passionate fitness enthusiast whose journey
              began with yoga but soon demanded something more dynamic and hands-on.
              Discovering traditional tools transformed not just personal fitness but ignited
              a mission to share this ancient practice with the world.
            </p>

            <p>
              The path wasn’t without obstacles. Frustration with inconsistent quality led to
              a bold step — taking production into personal control. By focusing on premium
              materials and craftsmanship, the brand evolved into something built on excellence.
            </p>

            <p>
              Early guidance came from traditional teachers who introduced the depth of mudgar
              training. Fascinated by its mix of strength and mobility, the journey was shared
              online — and the response was overwhelming.
            </p>

            <p>
              People from all walks of life connected with the idea of blending traditional
              fitness into modern routines. This growing community became the foundation of the brand.
            </p>
          </div>

          <div>
            <img
              src="/images/aboutus-model1.png"
              className="w-full h-[520px] object-cover"
            />
          </div>

        </div>
      </section>

      {/* STORY CONTINUATION */}
      <section className="px-6 md:px-20 pb-24">
        <div className="max-w-4xl mx-auto text-[#5c3d2e] space-y-6 leading-7 text-[15px]">

          <p>
            As demand increased, so did the challenges. Early manufacturing collaborations
            often failed to meet expectations, pushing the brand to take full control of production.
          </p>

          <p>
            By shifting focus to craftsmanship and using premium wood, each piece became more than
            equipment — it became a work of art built for durability and performance.
          </p>

          <p>
            Every challenge strengthened the connection with the growing community. The journey
            became about more than products — it became about building something meaningful.
          </p>

          <p>
            Today, Mudgarvale stands as a reflection of resilience, passion, and a shared love
            for traditional strength practices carried into the modern world.
          </p>

        </div>
      </section>

      {/* STORY GRID - PREMIUM VERSION */}
      <section className="px-6 md:px-20 pb-20">
        <div className="grid md:grid-cols-2 gap-14 items-start max-w-6xl mx-auto">

          <div className="space-y-6 text-[#5c3d2e] leading-7 text-[15px]">
            <p>
              What truly sets Mudgarvale apart is not just the product — it is the philosophy behind every piece.
              Each mudgar is carefully shaped, balanced, and finished by skilled hands that understand the
              importance of precision in movement and design.
            </p>

            <p>
              The wood is not simply chosen — it is selected with intent. Grain, weight, and durability are all
              considered to ensure that every tool delivers a seamless training experience while carrying a sense
              of timeless elegance.
            </p>

            <p>
              This commitment to detail transforms every product into more than fitness equipment. It becomes a
              statement — a reflection of discipline, heritage, and refined strength.
            </p>

            <p>
              For those who seek more than ordinary workouts, Mudgarvale offers an experience that feels
              exclusive, powerful, and deeply connected to tradition — crafted for individuals who value both
              performance and prestige.
            </p>
          </div>

          <div>
            <img
              src="/images/imageofhero.png"
              className="w-full h-[520px] object-cover"
            />
          </div>

        </div>
      </section>

      {/* FINAL STORY BLOCK */}
      <section className="px-6 md:px-20 pb-24">
        <div className="max-w-4xl mx-auto text-[#5c3d2e] space-y-6 leading-7 text-[15px]">

          <p>
            As demand increased, so did the challenges. Early manufacturing collaborations
            often failed to meet expectations, pushing the brand to take full control of production.
          </p>

          <p>
            By shifting focus to craftsmanship and using premium wood, each piece became more than
            equipment — it became a work of art built for durability and performance.
          </p>

          <p>
            Every challenge strengthened the connection with the growing community. The journey
            became about more than products — it became about building something meaningful.
          </p>

          <p>
            Today, Mudgarvale stands as a reflection of resilience, passion, and a shared love
            for traditional strength practices carried into the modern world.
          </p>

        </div>
      </section>

      {/* TEAM */}
      <section className="bg-[#ede2d3] py-24 px-6 md:px-20">
        <h2 className="text-center font-serif text-4xl mb-16">Our Team</h2>

        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto text-center">

          <div>
            <img
              src="https://images.unsplash.com/photo-1603415526960-f7e0328c63b1"
              className="w-full h-[320px] object-cover mb-4"
            />
            <h3 className="font-semibold text-lg">Founder</h3>
            <p className="text-sm text-[#6b4b3a]">
              Focused on building strength through traditional practices and modern awareness.
            </p>
          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1599566150163-29194dcaad36"
              className="w-full h-[320px] object-cover mb-4"
            />
            <h3 className="font-semibold text-lg">Co-Founder</h3>
            <p className="text-sm text-[#6b4b3a]">
              Ensuring quality, craftsmanship, and consistency across every product.
            </p>
          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1607746882042-944635dfe10e"
              className="w-full h-[320px] object-cover mb-4"
            />
            <h3 className="font-semibold text-lg">Craft Expert</h3>
            <p className="text-sm text-[#6b4b3a]">
              Blending traditional woodworking with precision and durability.
            </p>
          </div>

        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="py-24 px-6 md:px-20">
        <h2 className="text-center font-serif text-4xl mb-14">
          Why Choose Mudgarvale?
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto text-center">

          <div>
            <h3 className="font-semibold mb-2">Unmatched Craftsmanship</h3>
            <p className="text-[#6b4b3a] text-sm">
              Built with precision and premium materials for long-lasting performance.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Cultural Connection</h3>
            <p className="text-[#6b4b3a] text-sm">
              Rooted in tradition while adapted for modern fitness routines.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Holistic Fitness</h3>
            <p className="text-[#6b4b3a] text-sm">
              Focused on strength, balance, and overall well-being.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};

export default About;