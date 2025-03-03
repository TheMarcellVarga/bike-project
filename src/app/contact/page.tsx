import React from "react";
import Image from "next/image";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[40vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bike.jpg"
            alt="Mountain biking trail"
            fill
            className="object-cover brightness-50"
            sizes="100vw"
          />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            We'd love to hear from you! Get in touch with our team.
          </p>
        </div>
      </div>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow-sm">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Phone</h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
              <p className="text-gray-600 text-sm mt-2">Mon-Fri, 9am-5pm</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow-sm">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Email</h3>
              <p className="text-gray-600">info@trailblazer.com</p>
              <p className="text-gray-600 text-sm mt-2">
                We'll respond within 24 hours
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow-sm">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Location</h3>
              <p className="text-gray-600">123 Trail Avenue</p>
              <p className="text-gray-600">Mountain View, CA 94043</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow-sm">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Hours</h3>
              <p className="text-gray-600">Mon-Fri: 9am - 6pm</p>
              <p className="text-gray-600">Sat: 10am - 4pm</p>
              <p className="text-gray-600">Sun: Closed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Send Us a Message
            </h2>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Find Us</h2>
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
            <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">
                Map would be displayed here. Consider integrating Google Maps or another map service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-2">
                Do you offer bike fitting services?
              </h3>
              <p className="text-gray-600">
                Yes, we offer professional bike fitting services to ensure your
                bike is perfectly adjusted to your body proportions for maximum
                comfort and performance.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-2">
                What is your return policy?
              </h3>
              <p className="text-gray-600">
                We offer a 30-day return policy on unused merchandise. Bikes can
                be returned within 14 days if they have not been ridden outside.
                Please visit our Returns page for more details.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-2">
                Do you ship internationally?
              </h3>
              <p className="text-gray-600">
                Yes, we ship to most countries worldwide. Shipping costs and
                delivery times vary based on location. Please contact us for
                specific information about shipping to your country.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 