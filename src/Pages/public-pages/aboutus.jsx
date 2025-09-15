import { Link } from "react-router-dom";
import { Heart, Shield, Globe, Users, Lightbulb, MessageCircle } from "lucide-react";

export const AboutUs = () => {
  return (
    <section
      id="about"
      className="bg-gray-50 text-gray-900 min-h-screen py-20 px-6 sm:px-12 md:px-20 pt-32"
      aria-labelledby="about-heading"
    >
      <div className="w-full max-w-screen-xl mx-auto space-y-20">
        {/* Heading */}
        <header className="text-center">
          <h1
            id="about-heading"
            className="text-5xl font-extrabold mb-6"
          >
            <span className="bg-gradient-to-r from-teal-500 via-green-500 to-orange-400 bg-clip-text text-transparent">
              MindMitra
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-medium">
            Your trusted companion for mental health support, emotional
            well-being, and personal growth. We’re here to ensure no one has to
            struggle alone.
          </p>
        </header>

        {/* Our Mission */}
        <article className="bg-white shadow-lg rounded-2xl p-10 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
            Our Mission
          </h2>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            To make mental wellness accessible, empathetic, and stigma-free.
            MindMitra empowers individuals with tools, resources, and
            compassionate support to navigate life’s challenges confidently.
          </p>
        </article>

        {/* Our Story */}
        <article className="bg-white shadow-lg rounded-2xl p-10 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-orange-500 mb-4">
            Our Story
          </h2>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            Born from the idea that mental health help should be as easy as
            sending a text, MindMitra blends technology with empathy — a safe,
            judgment-free space inspired by Indian cultural values of community
            and care.
          </p>
        </article>

        {/* Core Values */}
        <section aria-labelledby="core-values-heading">
          <h2
            id="core-values-heading"
            className="text-3xl md:text-4xl font-bold text-purple-600 mb-8 text-center"
          >
            Core Values
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Heart className="text-red-500 w-6 h-6" aria-hidden="true" />,
                text: "Empathy – Listening without judgment",
              },
              {
                icon: <Shield className="text-blue-500 w-6 h-6" aria-hidden="true" />,
                text: "Confidentiality – Your privacy is our priority",
              },
              {
                icon: <Globe className="text-green-500 w-6 h-6" aria-hidden="true" />,
                text: "Accessibility – Help for everyone, anywhere",
              },
              {
                icon: <Users className="text-purple-500 w-6 h-6" aria-hidden="true" />,
                text: "Inclusivity – Welcoming all voices & experiences",
              },
              {
                icon: <Lightbulb className="text-yellow-500 w-6 h-6" aria-hidden="true" />,
                text: "Innovation – Science & tech for wellness",
              },
            ].map((value, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition"
              >
                {value.icon}
                <p className="text-gray-700 font-semibold">{value.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why It Matters */}
        <article className="bg-white shadow-lg rounded-2xl p-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-red-600 mb-4">
            Why It Matters
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-4">
            Millions in India silently struggle with mental health challenges.
            Stigma and lack of resources prevent many from seeking help.
            MindMitra bridges this gap — instantly, privately, and without
            judgment.
          </p>
          <p className="text-lg md:text-xl font-medium text-gray-800">
            Because everyone deserves to be heard, supported, and valued.
          </p>
        </article>

        {/* Testimonials */}
        <section aria-labelledby="testimonials-heading">
          <h2
            id="testimonials-heading"
            className="text-3xl md:text-4xl font-bold text-teal-600 mb-8 text-center"
          >
            What People Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <blockquote className="bg-white shadow-md rounded-xl p-6" cite="#">
              <MessageCircle
                className="w-8 h-8 text-blue-500 mb-3"
                aria-hidden="true"
              />
              <p className="italic text-gray-700">
                “MindMitra helped me through one of the hardest times in my
                life. It was like talking to a friend who truly understood.”
              </p>
            </blockquote>
            <blockquote className="bg-white shadow-md rounded-xl p-6" cite="#">
              <MessageCircle
                className="w-8 h-8 text-green-500 mb-3"
                aria-hidden="true"
              />
              <p className="italic text-gray-700">
                “I love how easy it is to just open the app and have a safe
                space to vent, reflect, and feel heard.”
              </p>
            </blockquote>
          </div>
        </section>

        {/* Call to Action */}
        <aside className="bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Your Journey Today
          </h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 font-medium">
            Don’t wait for the “right moment” to take care of your mental
            health. Start a conversation with{" "}
            <span className="bg-gradient-to-r from-teal-500 via-green-500 to-orange-400 bg-clip-text text-transparent font-bold">
              MindMitra
            </span>{" "}
            now and take your first step towards emotional well-being.
          </p>
          <Link
            to="/chat"
            className="inline-block bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold shadow-lg transition duration-300"
            aria-label="Start a chat with MindMitra"
          >
            Chat with MindMitra
          </Link>
        </aside>
      </div>
    </section>
  );
};
