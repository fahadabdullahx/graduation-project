import { Calendar, Shield, Users } from "lucide-react";
import SearchForm from "@/components/trip/searchForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      <section className="relative h-full md:h-[600px] flex flex-col items-center justify-center md:justify-end">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/80 bg-gradient-to-b from-transparent from-30%  to-white to-90%" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center ">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Share rides, save money, reduce emissions
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Connect with people heading your way and split the cost of your
            journey while reducing your carbon footprint.
          </p>
        </div>
        <div className="relative z-10 lg:w-10/12 sm:w-full w-full container max-w-4xl">
          <SearchForm className="grid md:grid-cols-2 grid-cols-1 gap-5 p-5 rounded-lg w-full shadow-lg bg-white" />
        </div>
      </section>
      <section className="py-16 mt-5 container mx-auto p-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Why Choose EasyRides?
        </h2>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Users,
                title: "Connect with Travelers",
                desc: "Find friendly co-travelers heading your way and build lasting connections.",
              },
              {
                icon: Shield,
                title: "Safe & Secure",
                desc: "Verified profiles, secure payments, and 24/7 support for peace of mind.",
              },
              {
                icon: Calendar,
                title: "Flexible Schedule",
                desc: "Find rides that perfectly match your schedule and travel preferences.",
              },
            ].map((feature, i) => (
              <div key={i} className="relative group">
                <div className="absolute inset-0 bg-white rounded-2xl shadow-xl transform transition-transform group-hover:scale-[1.02] group-hover:shadow-2xl"></div>
                <div className="relative p-8">
                  <div className="bg-primary p-4 rounded-2xl inline-block">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Join Our Community Today!
          </h2>
          <p className="text-xl text-center mb-8">
            Sign up now and start sharing rides with fellow travelers.
          </p>
          <div className="flex justify-center">
            <Button
              variant="link"
              className="rounded-sm bg-primary font-bold text-white hover:no-underline p-0"
            >
              <Link href="/sign-up" className="px-4 py-2">
                Join Our Now
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
