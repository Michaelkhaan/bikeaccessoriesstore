"use client";

import Navigation from "../../components/Navigation";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 text-zinc-900 dark:from-black dark:to-zinc-950 dark:text-zinc-50">
      <Navigation />

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">About Us</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Your trusted partner for quality bike accessories
          </p>
        </div>

        <div className="space-y-12">
          {/* Mission Section */}
          <section className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-zinc-900">
            <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Our Mission</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              {"At Bike Accessories, we're passionate about cycling and committed to providing riders with the highest quality accessories to enhance their cycling experience. Whether you're a casual rider or a professional cyclist, we have everything you need to stay safe, comfortable, and prepared on every ride."}
            </p>
          </section>

          {/* Values Section */}
          <section className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-zinc-900">
            <h2 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Our Values</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950">
                  <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Quality First</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  We source only the finest products from trusted manufacturers to ensure durability and performance.
                </p>
              </div>

              <div>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-950">
                  <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Customer Focus</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {"Your satisfaction is our priority. We're here to help you find the perfect accessories for your needs."}
                </p>
              </div>

              <div>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950">
                  <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Innovation</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  We stay ahead of the curve with the latest technologies and trends in cycling accessories.
                </p>
              </div>

              <div>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-950">
                  <svg className="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 002 2h2.945M15 11h2.945M21 11v1a2 2 0 01-2 2h-2.945M9 11V9a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h6" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Sustainability</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {"We're committed to environmental responsibility and sustainable business practices."}
                </p>
              </div>
            </div>
          </section>

          {/* Story Section */}
          <section className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-zinc-900">
            <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Our Story</h2>
            <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
              <p>
                Founded in 2020, Bike Accessories started as a small local shop with a big dream: to make quality cycling
                accessories accessible to everyone. What began as a passion project has grown into a trusted online
                destination for cyclists worldwide.
              </p>
              <p>
                Our team consists of experienced cyclists, product experts, and customer service professionals who share a
                common love for cycling. We understand the needs of riders because we are riders ourselves.
              </p>
              <p>
                {"Today, we're proud to offer a comprehensive selection of bike accessories, from safety equipment like helmets and lights to convenience items like locks and water bottles. Every product in our inventory is carefully selected and tested to meet our high standards."}
              </p>
            </div>
          </section>

          {/* CTA Section */}
          <section className="rounded-2xl border border-black/5 bg-gradient-to-r from-zinc-900 to-zinc-800 p-8 text-center shadow-sm dark:from-zinc-800 dark:to-zinc-900">
            <h2 className="mb-4 text-2xl font-semibold text-white">Ready to Start Shopping?</h2>
            <p className="mb-6 text-zinc-300">
              Explore our wide selection of bike accessories and find everything you need for your next ride.
            </p>
            <a
              href="/products"
              className="inline-block rounded-xl bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100"
            >
              Browse Products
            </a>
          </section>
        </div>
      </main>

      <footer className="mx-auto mt-16 max-w-7xl border-t border-black/5 px-4 py-6 text-xs text-zinc-500 dark:border-white/10 dark:text-zinc-400 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} Bike Accessories — Quality bike accessories for every rider.
      </footer>
    </div>
  );
}

