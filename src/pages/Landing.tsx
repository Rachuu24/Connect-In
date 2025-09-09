import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion, useInView } from "framer-motion";
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  Heart, 
  Briefcase, 
  GraduationCap,
  ArrowRight,
  CheckCircle,
  Globe,
  TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router";
import { LogoDropdown } from "@/components/LogoDropdown";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Twitter, Linkedin, Github } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import * as THREE from "three";

function CountUp({
  to,
  duration = 1200,
  prefix = "",
  suffix = "",
  compact = false,
}: {
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  compact?: boolean;
}) {
  const [value, setValue] = useState(0);
  const [hasRun, setHasRun] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView || hasRun) return;
    setHasRun(true);
    const start = performance.now();
    const from = 0;

    function formatNumber(n: number) {
      if (compact) {
        return new Intl.NumberFormat("en", {
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(n);
      }
      return n.toLocaleString();
    }

    const step = (time: number) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + (to - from) * eased);
      setValue(current);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, hasRun, to, duration, compact]);

  const formatted =
    compact
      ? new Intl.NumberFormat("en", {
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(value)
      : value.toLocaleString();

  return (
    <span ref={ref}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

function GlobeCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Globe (wireframe)
    const globeGeometry = new THREE.SphereGeometry(2, 32, 32);
    const globeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00aaff,
      wireframe: true,
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    // Outer glow
    const glowGeometry = new THREE.SphereGeometry(2.1, 32, 32);
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        c: { value: 0.9 },
        p: { value: 2.0 },
        glowColor: { value: new THREE.Color(0x00aaff) },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize( normalMatrix * normal );
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying vec3 vNormal;
        void main() {
          float intensity = pow( 0.7 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), 2.0 );
          gl_FragColor = vec4( glowColor, 1.0 ) * intensity;
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glowMesh);

    camera.position.z = 5;

    const animate = () => {
      globe.rotation.y += 0.002;
      glowMesh.rotation.y += 0.002;
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Resize handling (based on container)
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
      scene.clear();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-lg"
      style={{ background: "transparent" }}
    />
  );
}

export default function Landing() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = (data.get("name") as string) || "Friend";
    toast(`Thanks, ${name}! We'll get back to you shortly.`);
    e.currentTarget.reset();
  };

  const stats = [
    { value: 12840, label: "Total Alumni Registered", suffix: "+" },
    { value: 64, label: "Institutions Connected", suffix: "+" },
    { value: 742, label: "Events Hosted", suffix: "+" },
  ];

  const testimonials = [
    {
      quote:
        "I reconnected with classmates and found a mentor who helped me pivot into product management.",
      name: "Sarah Johnson",
      title: "Class of 2018 • Senior Product Manager",
    },
    {
      quote:
        "The events and community discussions are invaluable. I've hired two amazing alumni through this network.",
      name: "Michael Chen",
      title: "MBA 2015 • Founder, FinTech Labs",
    },
    {
      quote:
        "This platform made it easy to give back—I'm now mentoring two students in my field.",
      name: "Emily Rodriguez",
      title: "BA 2020 • Marketing Director",
    },
  ];

  const features = [
    {
      icon: Users,
      title: "Alumni Directory",
      description: "Connect with thousands of alumni worldwide and expand your professional network."
    },
    {
      icon: Calendar,
      title: "Events & Networking",
      description: "Join exclusive alumni events, reunions, and professional networking opportunities."
    },
    {
      icon: Briefcase,
      title: "Mentorship Program",
      description: "Find mentors or become one. Share knowledge and accelerate career growth."
    },
    {
      icon: MessageSquare,
      title: "Communication Hub",
      description: "Stay connected through discussions, announcements, and direct messaging."
    },
    {
      icon: Heart,
      title: "Give Back",
      description: "Support your alma mater through donations and fundraising campaigns."
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Access job opportunities, career resources, and professional development."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <LogoDropdown />
              <span className="text-xl font-bold tracking-tight">Connect-In</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
              {isLoading ? (
                <div className="w-20 h-9 bg-muted animate-pulse rounded-md"></div>
              ) : isAuthenticated ? (
                <Button onClick={() => navigate("/dashboard")}>
                  Dashboard
                </Button>
              ) : (
                <Button onClick={() => navigate("/auth")}>
                  Get Started
                </Button>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Connect Alumni. Empower Institutions.{" "}
                <span className="text-primary">Grow Together.</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                A modern, secure, and engaging platform to manage alumni data, build community,
                and create lasting impact.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {isAuthenticated ? (
                  <Button
                    size="lg"
                    onClick={() => navigate("/dashboard")}
                    className="text-lg px-8 py-6 group transition-transform"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                ) : (
                  <>
                    <Button
                      size="lg"
                      onClick={() => navigate("/auth")}
                      className="text-lg px-8 py-6 group transition-transform"
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => navigate("/auth")}
                      className="text-lg px-8 py-6"
                    >
                      Sign In
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Subtle animated background: flowing blobs / nodes */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute -top-32 -right-10 w-[520px] h-[520px] bg-primary/10 rounded-full blur-3xl"
            animate={{ y: [0, -12, 0], x: [0, 8, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-24 -left-16 w-[420px] h-[420px] bg-accent/10 rounded-full blur-3xl"
            animate={{ y: [0, 14, 0], x: [0, -10, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Glowing network nodes */}
          <svg
            className="absolute inset-0 w-full h-full opacity-40"
            viewBox="0 0 1440 600"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="grad" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="currentColor" />
                <stop offset="100%" stopColor="currentColor" />
              </linearGradient>
            </defs>
            <g className="text-primary/15">
              <circle cx="200" cy="120" r="2">
                <animate attributeName="r" values="2;4;2" dur="6s" repeatCount="indefinite" />
              </circle>
              <circle cx="420" cy="260" r="2">
                <animate attributeName="r" values="2;4;2" dur="7s" repeatCount="indefinite" />
              </circle>
              <circle cx="760" cy="180" r="2">
                <animate attributeName="r" values="2;4;2" dur="5.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="1080" cy="320" r="2">
                <animate attributeName="r" values="2;4;2" dur="6.5s" repeatCount="indefinite" />
              </circle>
              <line x1="200" y1="120" x2="420" y2="260" stroke="url(#grad)" strokeOpacity="0.25" />
              <line x1="420" y1="260" x2="760" y2="180" stroke="url(#grad)" strokeOpacity="0.25" />
              <line x1="760" y1="180" x2="1080" y2="320" stroke="url(#grad)" strokeOpacity="0.25" />
            </g>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  <CountUp
                    to={stat.value}
                    prefix=""
                    suffix={stat.suffix ?? ""}
                    compact={false}
                  />
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Everything You Need to Stay Connected
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools you need to maintain and grow your alumni network.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <feature.icon className="h-12 w-12 text-primary mb-4" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Optional: Interactive Map / Globe-like network */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
          >
            <div>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
                A Global Alumni Network
              </h3>
              <p className="text-muted-foreground">
                Visualize your community's reach across regions. Our platform helps institutions
                understand alumni distribution and engagement trends—powering smarter outreach.
              </p>
            </div>
            <Card className="p-4">
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="absolute inset-0">
                  <GlobeCanvas />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Slider */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">What Alumni Say</h3>
            <p className="text-muted-foreground">
              Real stories from our global community.
            </p>
          </motion.div>

          <Carousel className="relative">
            <CarouselContent>
              {testimonials.map((t, i) => (
                <CarouselItem key={i} className="basis-full md:basis-1/2 lg:basis-1/3">
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                  >
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="text-left text-base leading-relaxed">
                          "{t.quote}"
                        </CardTitle>
                        <CardDescription className="pt-2">
                          <span className="font-medium">{t.name}</span>
                          <br />
                          <span className="text-xs">{t.title}</span>
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="about" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                Why Join Our Alumni Network?
              </h2>
              <div className="space-y-4">
                {[
                  "Access to exclusive networking events and opportunities",
                  "Professional mentorship and career guidance",
                  "Direct communication with fellow alumni worldwide",
                  "Opportunities to give back and make an impact",
                  "Career resources and job placement assistance",
                  "Lifelong connections and friendships"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <Globe className="h-12 w-12 text-primary" />
                  <div>
                    <h3 className="text-xl font-semibold">Global Community</h3>
                    <p className="text-muted-foreground">Connect across continents</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6">
                  Join a thriving community of alumni from diverse backgrounds, industries, and locations. 
                  Our platform breaks down geographical barriers to create meaningful connections.
                </p>
                <Button className="w-full" onClick={() => navigate("/auth")}>
                  Start Connecting Today
                </Button>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
                <CardDescription>We'd love to hear from you. Send us a message and we'll respond soon.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm mb-2 block">Name</label>
                      <Input name="name" placeholder="Your name" required />
                    </div>
                    <div>
                      <label className="text-sm mb-2 block">Email</label>
                      <Input name="email" type="email" placeholder="you@example.com" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm mb-2 block">Message</label>
                    <Textarea name="message" placeholder="How can we help?" className="min-h-[120px]" required />
                  </div>
                  <div className="flex items-center gap-3">
                    <Button type="submit">Send Message</Button>
                    <Button type="button" variant="outline" asChild>
                      <a href="mailto:support@alumni.example.com">Email Us Directly</a>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle>Reach Us</CardTitle>
                <CardDescription>Prefer another channel? Use what's most convenient for you.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg border">
                  <p className="text-sm text-muted-foreground">Support</p>
                  <p className="font-medium">support@alumni.example.com</p>
                </div>
                <div className="p-4 rounded-lg border">
                  <p className="text-sm text-muted-foreground">Community</p>
                  <p className="font-medium">
                    <a className="underline" href="#features">Explore Features</a>
                  </p>
                </div>
                <div className="p-4 rounded-lg border">
                  <p className="text-sm text-muted-foreground">About</p>
                  <p className="font-medium">
                    <a className="underline" href="#about">Learn more about us</a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              Ready to Reconnect with Your Alumni Community?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of alumni who are already building meaningful connections and advancing their careers.
            </p>
            <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8 py-6">
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gradient-to-b from-muted/30 to-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Top: Brand + Newsletter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
                <span className="text-xl font-bold tracking-tight">Connect-In</span>
              </div>
              <p className="text-muted-foreground">
                Your global alumni hub for networking, mentorship, and opportunities.
              </p>
              <div className="flex items-center gap-3 mt-4">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-md border hover:bg-muted transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-md border hover:bg-muted transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-md border hover:bg-muted transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <button
                    className="hover:text-foreground transition-colors cursor-pointer"
                    onClick={() => (isAuthenticated ? navigate("/dashboard") : navigate("/auth"))}
                  >
                    Directory
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-foreground transition-colors cursor-pointer"
                    onClick={() => (isAuthenticated ? navigate("/dashboard") : navigate("/auth"))}
                  >
                    Events
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-foreground transition-colors cursor-pointer"
                    onClick={() => (isAuthenticated ? navigate("/dashboard") : navigate("/auth"))}
                  >
                    Mentorship
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-foreground transition-colors cursor-pointer"
                    onClick={() => (isAuthenticated ? navigate("/dashboard") : navigate("/auth"))}
                  >
                    Donations
                  </button>
                </li>
              </ul>
            </div>

            {/* Newsletter / Support */}
            <div>
              <h4 className="font-semibold mb-4">Stay in the loop</h4>
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget as HTMLFormElement;
                  const email = new FormData(form).get("newsletter") as string;
                  if (email) {
                    toast(`Subscribed with ${email}. Welcome to Connect-In!`);
                    form.reset();
                  }
                }}
              >
                <Input name="newsletter" placeholder="you@example.com" type="email" required />
                <Button type="submit">Subscribe</Button>
              </form>

              <h4 className="font-semibold mt-8 mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <button
                    className="hover:text-foreground transition-colors cursor-pointer"
                    onClick={() => toast("Help Center is coming soon.")}
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-foreground transition-colors cursor-pointer"
                    onClick={() => {
                      const el = document.getElementById("contact");
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-foreground transition-colors cursor-pointer"
                    onClick={() => toast("Privacy Policy is coming soon.")}
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-foreground transition-colors cursor-pointer"
                    onClick={() => toast("Terms of Service are coming soon.")}
                  >
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t mt-10 pt-6 text-center text-muted-foreground">
            <p>&copy; 2024 Connect-In. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}