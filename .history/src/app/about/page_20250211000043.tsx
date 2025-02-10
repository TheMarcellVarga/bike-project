import Image from "next/image";
import Link from "next/link";
import { MapPin, Users, Trophy, Leaf } from "lucide-react";

const values = [
  {
    icon: <Trophy className="w-8 h-8 text-green-600" />,
    title: "Quality First",
    description:
      "We carefully select and test every product we sell, ensuring only the best makes it to our customers.",
  },
  {
    icon: <Users className="w-8 h-8 text-green-600" />,
    title: "Expert Team",
    description:
      "Our staff are passionate riders with years of experience in the mountain biking community.",
  },
  {
    icon: <MapPin className="w-8 h-8 text-green-600" />,
    title: "Trail Tested",
    description:
      "Every bike and component is thoroughly tested on real trails before earning our recommendation.",
  },
  {
    icon: <Leaf className="w-8 h-8 text-green-600" />,
    title: "Sustainability",
    description:
      "We're committed to reducing our environmental impact and promoting sustainable riding practices.",
  },
];

const teamMembers = [
  {
    name: "Sarah Johnson",
    role: "Founder & Lead Bike Expert",
    image: "/products/accessory-1.jpg",
    bio: "Former pro rider with 15 years of experience in bike manufacturing and design.",
  },
  {
    name: "Mike Chen",
    role: "Head of Service",
    image: "/products/accessory-2.jpg",
    bio: "Certified bike mechanic with a passion for helping riders get the most out of their equipment.",
  },
  {
    name: "Emma Rodriguez",
    role: "Trail Experience Director",
    image: "/products/accessory-1.jpg",
    bio: "Professional trail guide and bike fitting specialist.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bike.jpg"
            alt="Mountain biking trail"
            fill
            className="object-cover brightness-50"
            priority
            sizes="100vw"
          />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Story</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Founded by riders, for riders. We're here to help you find the
            perfect gear for your next trail adventure.
          </p>
        </div>
      </div>

      {/* Mission Statement */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">Our Mission</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              At Trail Blazer, we believe that every rider deserves access to
              the best mountain biking equipment and expertise. Our mission is
              to provide premium bikes, parts, and accessories while fostering a
              community of passionate riders who share our love for the trails.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {teamMembers.map((member) => (
              <div key={member.name} className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover rounded-full"
                    sizes="(max-width: 768px) 192px, 192px"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                <p className="text-green-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Hit the Trails?</h2>
          <p className="text-xl mb-12 text-green-100">
            Visit our store or browse our collection online to find your perfect
            ride.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/bikes"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-800 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Shop Bikes
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white rounded-lg font-semibold hover:bg-white hover:text-green-800 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
