import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
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

export default function Landing() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

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

  const stats = [
    { number: "10K+", label: "Active Alumni" },
    { number: "500+", label: "Events Hosted" },
    { number: "1K+", label: "Mentorship Connections" },
    { number: "$2M+", label: "Donations Raised" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <LogoDropdown />
              <span className="text-xl font-bold tracking-tight">Alumni Network</span>
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
                Connect. Engage.{" "}
                <span className="text-primary">Grow Together.</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Join the premier digital platform for alumni networking, mentorship, and lifelong connections. 
                Build meaningful relationships that last beyond graduation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {isAuthenticated ? (
                  <Button size="lg" onClick={() => navigate("/dashboard")} className="text-lg px-8 py-6">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                ) : (
                  <>
                    <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8 py-6">
                      Join the Network
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => navigate("/auth")} className="text-lg px-8 py-6">
                      Sign In
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
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
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
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

      {/* Benefits Section */}
      <section className="py-24 bg-muted/30">
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
      <footer className="border-t bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
                <span className="text-xl font-bold">Alumni Network</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Connecting alumni worldwide through a comprehensive digital platform for networking, 
                mentorship, and lifelong relationships.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Directory</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Events</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Mentorship</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Donations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Alumni Network. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
