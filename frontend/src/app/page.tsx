import Link from "next/link";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SparklesCore } from "@/components/ui/sparkles";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";

// Define types for the events
interface EventType {
  title: string;
  date: string;
  description: string;
  image: string;
  live: boolean;
}

interface EventsMap {
  [category: string]: EventType[];
}

// EventCard component with proper typing
function EventCard({ event }: { event: EventType }) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all group">
      <div className="relative h-48">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {event.live && (
          <span className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
            Live Now
          </span>
        )}
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{event.title}</CardTitle>
        </div>
        <CardDescription className="text-sm font-medium">
          {event.date}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">{event.description}</p>
      </CardContent>
      <CardFooter className="flex gap-4">
        <Button variant="outline" size="sm">
          Details
        </Button>
        {event.live && (
          <>
            <Link href="/host">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Host Stream
              </Button>
            </Link>
            <Link href="/viewer">
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                Watch Now
              </Button>
            </Link>
          </>
        )}
      </CardFooter>
    </Card>
  );
}

export default function Home() {
  // Event categories
  const categories: string[] = [
    "All",
    "Technical",
    "Cultural",
    "Sports",
    "Academic",
    "Workshops",
    "Talks",
  ];

  // Featured events for the hero section
  const featuredEvents = [
    {
      title: "Plinth 2025",
      description: "Annual Technical Festival",
      thumbnail: "/images/events/plinth-main.jpg",
      link: "/events/plinth",
    },
    {
      title: "Vivacity 2025",
      description: "Cultural Extravaganza",
      thumbnail: "/images/events/vivacity-main.jpg",
      link: "/events/vivacity",
    },
    {
      title: "Desportivos 2025",
      description: "Sports Tournament",
      thumbnail: "/images/events/desportivos-main.jpeg",
      link: "/events/desportivos",
    },
  ];

  // Events by category with actual LNMIIT events
  const events: EventsMap = {
    Technical: [
      {
        title: "Hackathon 2025",
        date: "May 10-11, 2025",
        description: "24-hour coding competition to build innovative solutions",
        image: "/images/events/hackathon-lnmiit.jpeg",
        live: false,
      },
      {
        title: "Robowar",
        date: "May 15, 2025",
        description: "Robot fighting competition with advanced AI systems",
        image: "/images/events/robowar-lnmiit.jpg",
        live: false,
      },
    ],
    Cultural: [
      {
        title: "Dance Competition",
        date: "April 25, 2025",
        description: "Showcase your dancing talent across various styles",
        image: "/images/events/dance-lnmiit.jpg",
        live: true,
      },
      {
        title: "Music Festival",
        date: "May 2, 2025",
        description: "Live performances from bands across the country",
        image: "/images/events/music-lnmiit.jpg",
        live: false,
      },
    ],
    Sports: [
      {
        title: "Inter-College Cricket",
        date: "April 28, 2025",
        description: "Cricket tournament between various colleges",
        image: "/images/events/cricket-lnmiit.jpeg",
        live: true,
      },
      {
        title: "Basketball Tournament",
        date: "May 5, 2025",
        description:
          "5-on-5 basketball competition with teams from across India",
        image: "/images/events/basketball-lnmiit.jpg",
        live: false,
      },
    ],
    Academic: [
      {
        title: "Research Symposium",
        date: "May 18, 2025",
        description: "Presenting cutting-edge research from LNMIIT students",
        image: "/images/events/research-lnmiit.jpg",
        live: false,
      },
      {
        title: "Case Study Competition",
        date: "May 20, 2025",
        description: "Business analysis and problem-solving event",
        image: "/images/events/casestudy-lnmiit.png",
        live: false,
      },
    ],
    Workshops: [
      {
        title: "AI Workshop",
        date: "April 30, 2025",
        description:
          "Hands-on training with machine learning and neural networks",
        image: "/images/events/ai-workshop-lnmiit.jpeg",
        live: false,
      },
      {
        title: "Design Thinking",
        date: "May 8, 2025",
        description: "Learn human-centered approach to innovation",
        image: "/images/events/design-lnmiit.jpeg",
        live: false,
      },
    ],
    Talks: [
      {
        title: "Industry Expert Session",
        date: "May 12, 2025",
        description:
          "Google's lead engineer discussing future of web development",
        image: "/images/events/expert-lnmiit.jpeg",
        live: true,
      },
      {
        title: "Alumni Interaction",
        date: "May 22, 2025",
        description: "Meet LNMIIT alumni working at top tech companies",
        image: "/images/events/alumni-lnmiit.jpeg",
        live: false,
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <NavigationMenu className="w-full border-b p-4 bg-white/90 backdrop-blur-sm fixed top-0 z-50">
        <NavigationMenuList className="container mx-auto flex justify-between items-center">
          <NavigationMenuItem className="flex items-center">
            <Image
              src="/images/logo-lnmiit.png"
              alt="LNMIIT Logo"
              width={150}
              height={70}
              className="mr-2"
            />
          </NavigationMenuItem>
          <div className="flex gap-6">
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className="hover:text-blue-600 font-medium">
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/events" legacyBehavior passHref>
                <NavigationMenuLink className="hover:text-blue-600 font-medium">
                  Events
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/calendar" legacyBehavior passHref>
                <NavigationMenuLink className="hover:text-blue-600 font-medium">
                  Calendar
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/about" legacyBehavior passHref>
                <NavigationMenuLink className="hover:text-blue-600 font-medium">
                  About
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </div>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Hero Section with Background and Parallax Effect */}
      <div
        className="pt-24 w-full relative bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url(/images/lnmiit-bg.jpg)" }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 py-32">
          <HeroHighlight containerClassName="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Experience <Highlight>LNMIIT</Highlight> Events
              </h1>
              <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-12">
                Discover the vibrant <Highlight>campus life</Highlight> at The
                LNM Institute of Information Technology through our exciting
                range of <Highlight>technical</Highlight>,{" "}
                <Highlight>cultural</Highlight>, and{" "}
                <Highlight>sports</Highlight> events.
              </p>

              {/* Event Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                {featuredEvents.map((event, index) => (
                  <Link key={index} href={event.link} className="block group">
                    <div className="relative h-80 overflow-hidden rounded-xl border-2 border-white/10 shadow-xl transition-all duration-300 group-hover:scale-[1.02] group-hover:border-white/30">
                      <Image
                        src={event.thumbnail}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                      <div className="absolute bottom-0 w-full p-6 text-left">
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {event.title}
                        </h3>
                        <p className="text-gray-300">{event.description}</p>
                        <div className="mt-4 inline-flex items-center text-blue-400 group-hover:text-blue-300">
                          <span>Learn more</span>
                          <svg
                            className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* CTA Button */}
              <div className="mt-12">
                <Button className="rounded-full px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg">
                  Explore All Events
                </Button>
              </div>
            </div>
          </HeroHighlight>

          {/* Sample floating images from events */}
          <div className="absolute bottom-10 left-10 hidden md:flex space-x-4 z-10">
            <Image
              src="/images/events/sample1-lnmiit.jpg"
              alt="LNMIIT Event"
              width={150}
              height={100}
              className="rounded-lg shadow-lg hover:scale-105 transition-transform border-2 border-white/20"
            />
            <Image
              src="/images/events/sample2-lnmiit.jpg"
              alt="LNMIIT Event"
              width={150}
              height={100}
              className="rounded-lg shadow-lg hover:scale-105 transition-transform border-2 border-white/20"
            />
            <Image
              src="/images/events/sample3-lnmiit.jpg"
              alt="LNMIIT Event"
              width={150}
              height={100}
              className="rounded-lg shadow-lg hover:scale-105 transition-transform border-2 border-white/20"
            />
          </div>
        </div>
      </div>

      {/* Sparkles and Headline Section */}
      <div className="w-full bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-900 py-20 relative overflow-hidden">
        <div className="w-full absolute inset-0 h-full">
          <SparklesCore
            id="tsparticles"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={70}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />
        </div>
        <div className="relative z-10 container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 text-white">
            LNMIIT Event Portal
          </h1>
          <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Discover, Participate, and Experience the Vibrant Campus Life at The
            LNM Institute of Information Technology
          </p>
          <Button className="rounded-full px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg">
            Explore Events
          </Button>
        </div>
      </div>

      {/* Campus Image Carousel Section */}
      <div className="relative h-[500px] w-full overflow-hidden group">
        <div className="absolute inset-0 flex transition-transform duration-[30000ms] ease-linear transform-gpu animate-marquee group-hover:pause">
          <Image
            src="/images/campus/lnmiit-campus1.jpg"
            alt="LNMIIT Campus"
            width={1000}
            height={500}
            className="object-cover min-w-full h-full"
          />
          <Image
            src="/images/campus/lnmiit-campus2.jpeg"
            alt="LNMIIT Campus"
            width={1000}
            height={500}
            className="object-cover min-w-full h-full"
          />
          <Image
            src="/images/campus/lnmiit-campus3.jpeg"
            alt="LNMIIT Campus"
            width={1000}
            height={500}
            className="object-cover min-w-full h-full"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
          <div className="container mx-auto px-8">
            <h2 className="text-4xl font-bold text-white mb-4">
              The LNMIIT Campus
            </h2>
            <p className="text-white/90 max-w-xl text-lg">
              Located in Jaipur, our beautiful 100-acre green campus provides
              the perfect backdrop for a rich variety of events and activities
              year-round.
            </p>
          </div>
        </div>
      </div>

      {/* Events Section with Tabs */}
      <main className="container mx-auto py-16 px-4 flex-grow">
        <div className="flex items-center mb-2">
          <h2 className="text-3xl font-bold">Upcoming Events</h2>
          <div className="ml-4 px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm rounded-full animate-pulse">
            Live Events Available
          </div>
        </div>
        <p className="text-gray-600 mb-8">
          Explore events happening at LNMIIT based on your interests
        </p>

        <Tabs defaultValue="All" className="w-full">
          <TabsList className="mb-8 flex flex-wrap gap-2">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="px-4 py-2 rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent
            value="All"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {Object.entries(events).flatMap(([, categoryEvents]) =>
              categoryEvents.map((event, index) => (
                <EventCard key={`all-${index}`} event={event} />
              ))
            )}
          </TabsContent>

          {Object.entries(events).map(([category, categoryEvents]) => (
            <TabsContent
              key={category}
              value={category}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {categoryEvents.map((event, index) => (
                <EventCard key={`${category}-${index}`} event={event} />
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </main>

      {/* Past Events Gallery */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">People</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="relative h-64 group overflow-hidden rounded-lg">
              <Image
                src="/images/gallery/gallery1.jpg"
                alt="Event Gallery"
                fill
                className="object-cover group-hover:scale-110 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300"></div>
            </div>
            <div className="relative h-64 group overflow-hidden rounded-lg">
              <Image
                src="/images/gallery/gallery2.jpg"
                alt="Event Gallery"
                fill
                className="object-cover group-hover:scale-110 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300"></div>
            </div>
            <div className="relative h-64 group overflow-hidden rounded-lg">
              <Image
                src="/images/gallery/gallery3.jpg"
                alt="Event Gallery"
                fill
                className="object-cover group-hover:scale-110 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300"></div>
            </div>
            <div className="relative h-64 group overflow-hidden rounded-lg">
              <Image
                src="/images/gallery/gallery4.jpg"
                alt="Event Gallery"
                fill
                className="object-cover group-hover:scale-110 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300"></div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Button variant="outline" className="rounded-full">
              View All Photos
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white">
        <div className="container mx-auto py-12 px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Image
                src="/images/logo-lnmiit-white.svg"
                alt="LNMIIT Logo"
                width={150}
                height={70}
                className="mb-4"
              />
              <p className="text-gray-400">
                The LNM Institute of Information Technology
              </p>
              <div className="flex mt-4 space-x-3">
                <a
                  href="#"
                  className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="h-4 w-4 fill-current text-white"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-400 transition-colors"
                >
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-4 w-4 fill-current text-white"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-600 transition-colors"
                >
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="h-4 w-4 fill-current text-white"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About LNMIIT
                  </Link>
                </li>
                <li>
                  <Link
                    href="/events"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    All Events
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gallery"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Event Gallery
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Registration
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Major Events</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/plinth"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Plinth (Tech Fest)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/vivacity"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Vivacity (Cultural Fest)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/desportivos"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Desportivos (Sports Fest)
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <address className="not-italic text-gray-400">
                <p>Rupa ki Nangal, Post-Sumel</p>
                <p>Via Jamdoli, Jaipur</p>
                <p>Rajasthan 302031</p>
                <p className="mt-2 flex items-center">
                  <svg
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  events@lnmiit.ac.in
                </p>
                <p className="flex items-center">
                  <svg
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  0141 268 8090
                </p>
              </address>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            © {new Date().getFullYear()} The LNM Institute of Information
            Technology. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
