import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Calendar, Users, Building, BookOpen, ChevronRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  console.log("Index component is rendering");
  const navigate = useNavigate();

  const features = [
    {
      icon: Calendar,
      title: "Intelligent Scheduling",
      description: "AI-powered timetable generation with conflict detection and optimization"
    },
    {
      icon: Users,
      title: "Faculty Management",
      description: "Comprehensive faculty availability tracking and workload balancing"
    },
    {
      icon: Building,
      title: "Resource Optimization",
      description: "Smart classroom allocation and utilization analytics"
    },
    {
      icon: BookOpen,
      title: "Multi-department Support",
      description: "Handle complex scheduling across multiple departments and shifts"
    }
  ];

  const benefits = [
    "Automated clash detection and resolution",
    "NEP 2020 compliant multidisciplinary scheduling",
    "Real-time collaboration and approval workflows",
    "Export to PDF/Excel with one click",
    "Comprehensive analytics and reporting",
    "Mobile-responsive design for all devices"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">EduSchedule Wiz</h1>
              <p className="text-xs text-muted-foreground">Higher Education Timetable Management</p>
            </div>
          </div>
          <Button onClick={() => navigate('/login')} className="academic-gradient">
            Sign In
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Intelligent Timetable Management for Higher Education
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Streamline your academic scheduling with AI-powered optimization, automated conflict resolution, 
              and comprehensive resource management designed for modern universities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/login')} className="academic-gradient text-lg px-8">
                Get Started
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8">
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Academic Excellence</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create, manage, and optimize academic schedules with precision and efficiency.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="academic-card hover:shadow-lg transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Choose EduSchedule Wiz?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Built specifically for higher education institutions, our platform addresses the unique 
                challenges of academic scheduling while ensuring compliance with modern educational standards.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="h-4 w-4 text-success" />
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Card className="academic-card">
              <CardHeader>
                <CardTitle className="text-center">Ready to Get Started?</CardTitle>
                <CardDescription className="text-center">
                  Join hundreds of educational institutions already using EduSchedule Wiz
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">500+</div>
                    <div className="text-sm text-muted-foreground">Institutions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">10K+</div>
                    <div className="text-sm text-muted-foreground">Faculty Users</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">99.9%</div>
                    <div className="text-sm text-muted-foreground">Uptime</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">24/7</div>
                    <div className="text-sm text-muted-foreground">Support</div>
                  </div>
                </div>
                <Button className="w-full academic-gradient" size="lg" onClick={() => navigate('/login')}>
                  Start Your Free Trial
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">EduSchedule Wiz</span>
          </div>
          <p className="text-muted-foreground mb-4">
            Empowering higher education with intelligent timetable management solutions.
          </p>
          <p className="text-sm text-muted-foreground">
            © 2024 EduSchedule Wiz. Built for the future of academic scheduling.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
