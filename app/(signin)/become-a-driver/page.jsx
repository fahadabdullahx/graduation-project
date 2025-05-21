import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const metadata = {
  title: "Become a Driver",
  description:
    "Join our team of professional drivers and start earning on your own schedule",
};

export default function BecomeADriver() {
  const benefits = [
    {
      title: "Flexible Hours",
      description: "Work when you want, as much as you want",
    },
    {
      title: "Competitive Earnings",
      description: "Earn competitive rates with bonus opportunities",
    },
    {
      title: "Be Your Own Boss",
      description: "Enjoy the freedom of being an independent contractor",
    },
    {
      title: "Quick Payments",
      description: "Get paid weekly with direct deposits to your account",
    },
  ];

  const requirements = [
    {
      title: "Valid Driver's License",
      description: "Must have a valid driver's license for at least 1 year",
    },
    { title: "Age Requirement", description: "Must be at least 18 years old" },
    {
      title: "Vehicle Requirements",
      description: "4-door vehicle in good condition, 10 years old or newer",
    },

    {
      title: "Smartphone",
      description: "Compatible smartphone with data plan required",
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Drive With EasyRides
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Join our growing team of drivers and start earning on your schedule
          while providing essential transportation in your community.
        </p>
        <Link
          href="/become-a-driver/register"
          className="inline-block bg-primary text-white px-6 py-3 rounded-lg shadow hover:bg-primary/90 transition duration-200"
        >
          Apply Now
        </Link>
      </section>

      {/* Benefits Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Why Drive With Us?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, i) => (
            <Card key={i} className="h-full">
              <CardHeader>
                <CardTitle>{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Requirements Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Driver Requirements
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {requirements.map((requirement, i) => (
            <Card key={i} className="h-full">
              <CardHeader>
                <CardTitle>{requirement.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{requirement.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center bg-gray-100 p-10 rounded-lg">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Join thousands of drivers who have already discovered the benefits of
          driving with EasyRides.
        </p>
        <Link
          href="/become-a-driver/register"
          className="inline-block bg-primary text-white px-6 py-3 rounded-lg shadow hover:bg-primary/90 transition duration-200"
        >
          Apply Now
        </Link>
      </section>
    </div>
  );
}
