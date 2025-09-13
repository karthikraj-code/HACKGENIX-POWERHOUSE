import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Rocket, Sparkles, BrainCircuit, Layers, ShieldCheck, Workflow } from "lucide-react";
import { SignInButton } from "@/components/sign-in-button";
import { ScrollAnimate } from "@/components/scroll-animate";

export default async function LandingPage() {
  const cookieStore = await cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const { data: { user } } = await supabase.auth.getUser();

  // Redirect signed-in users directly to home
  if (user) {
    redirect('/home');
  }
  
  const mediaUrl = process.env.NEXT_PUBLIC_LANDING_MEDIA_URL;
  const videoSrc = mediaUrl && mediaUrl.endsWith('.mp4') ? mediaUrl : '/media/landing.mp4';

  return (
    <>
      {/* Hide global navbar and chatbot on the root landing page */}
      <style>{`header{display:none}`}</style>
      <style>{`[data-tech-bot-root]{display:none}`}</style>
      
      {/* Enhanced Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
          50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6), 0 0 60px rgba(99, 102, 241, 0.3); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .hero-bg {
          position: relative;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4));
        }
        
        .hero-bg::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1));
          z-index: 1;
        }
        
        .hero-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: -1;
        }
        
        .hero-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: -1;
        }
        
        .content-overlay {
          position: relative;
          z-index: 2;
          animation: fadeIn 1s ease-out;
        }
        
        .card-3d {
          transform-style: preserve-3d;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .card-3d:hover {
          transform: rotateX(10deg) rotateY(10deg) translateZ(20px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2), 0 0 50px rgba(99, 102, 241, 0.3);
        }
        
        .card-glow {
          position: relative;
          overflow: hidden;
        }
        
        .card-glow::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }
        
        .card-glow:hover::before {
          left: 100%;
        }
        
        .floating {
          animation: float 6s ease-in-out infinite;
        }
        
        .step-card {
          perspective: 1000px;
          transition: transform 0.6s;
        }
        
        .step-card:hover {
          transform: scale(1.05) rotateY(5deg);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .neon-border {
          position: relative;
          border: 2px solid transparent;
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57) border-box;
          mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
        }
        
        .glass-effect {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .hero-content {
          animation: scaleIn 0.8s ease-out 0.2s both;
        }
        
        .floating-particles {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 1;
        }
        
        .particle {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          pointer-events: none;
        }
        
        .particle:nth-child(1) {
          width: 80px;
          height: 80px;
          top: 20%;
          left: 20%;
          animation: float 8s ease-in-out infinite;
        }
        
        .particle:nth-child(2) {
          width: 60px;
          height: 60px;
          top: 60%;
          right: 20%;
          animation: float 6s ease-in-out infinite reverse;
          animation-delay: -2s;
        }
        
        .particle:nth-child(3) {
          width: 40px;
          height: 40px;
          bottom: 30%;
          left: 60%;
          animation: float 10s ease-in-out infinite;
          animation-delay: -4s;
        }
        
        /* Scroll animations */
        @keyframes slideInUp {
          from { 
            opacity: 0; 
            transform: translateY(60px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes slideInLeft {
          from { 
            opacity: 0; 
            transform: translateX(-60px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        @keyframes slideInRight {
          from { 
            opacity: 0; 
            transform: translateX(60px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        @keyframes fadeInScale {
          from { 
            opacity: 0; 
            transform: scale(0.8); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        
        .scroll-animate {
          opacity: 0;
          transform: translateY(60px);
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .scroll-animate.animate {
          opacity: 1;
          transform: translateY(0);
        }
        
        .scroll-animate-left {
          opacity: 0;
          transform: translateX(-60px);
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .scroll-animate-left.animate {
          opacity: 1;
          transform: translateX(0);
        }
        
        .scroll-animate-right {
          opacity: 0;
          transform: translateX(60px);
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .scroll-animate-right.animate {
          opacity: 1;
          transform: translateX(0);
        }
        
        .scroll-animate-scale {
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .scroll-animate-scale.animate {
          opacity: 1;
          transform: scale(1);
        }
        
        .stagger-1 { transition-delay: 0.1s; }
        .stagger-2 { transition-delay: 0.2s; }
        .stagger-3 { transition-delay: 0.3s; }
        .stagger-4 { transition-delay: 0.4s; }
        .stagger-5 { transition-delay: 0.5s; }
        .stagger-6 { transition-delay: 0.6s; }
      `}</style>

      {/* Hero Section with media background */}
      <section className="hero-bg min-h-screen flex items-center">
        {/* Media background (video preferred) */}
        {videoSrc ? (
          <video
            className="hero-video"
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        ) : (
          <img
            src="https://placehold.co/1920x1080"
            alt="Landing background"
            className="hero-image"
          />
        )}
        
        {/* Floating particles */}
        <div className="floating-particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24 text-center content-overlay">
          <div className="hero-content">
            <h1 className="text-5xl md:text-7xl font-headline font-bold text-white mb-6 drop-shadow-2xl">
              Build Your <span className="gradient-text">Tech Career</span> Faster
            </h1>
            <p className="mt-6 text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
              Explore domains, get AI-powered guidance, and turn learning into real projects with our cutting-edge platform.
            </p>
            <div className="mt-12 flex items-center justify-center gap-4">
              <div className="group relative transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <SignInButton />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="relative py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
        <div className="container mx-auto px-4">
          <ScrollAnimate animation="up" className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-headline font-bold gradient-text mb-4">
              Supercharge Your Learning
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of tech education with our innovative features
            </p>
          </ScrollAnimate>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollAnimate animation="left" delay={100}>
              <FeatureCard 
                icon={<Rocket className="h-8 w-8 text-blue-500" />} 
                title="Guided Roadmaps" 
                description="Clear step-by-step paths to master each domain with personalized learning tracks." 
                gradient="from-blue-500 to-purple-600"
              />
            </ScrollAnimate>
            <ScrollAnimate animation="up" delay={200}>
              <FeatureCard 
                icon={<BrainCircuit className="h-8 w-8 text-emerald-500" />} 
                title="AI Assistance" 
                description="Advanced AI explains concepts, summarizes docs, and creates your perfect learning plan." 
                gradient="from-emerald-500 to-teal-600"
              />
            </ScrollAnimate>
            <ScrollAnimate animation="right" delay={300}>
              <FeatureCard 
                icon={<Workflow className="h-8 w-8 text-purple-500" />} 
                title="Project First" 
                description="Transform learning into stunning portfolio projects that showcase your skills." 
                gradient="from-purple-500 to-pink-600"
              />
            </ScrollAnimate>
          </div>
        </div>
      </section>

      {/* Enhanced How it works section */}
      <section className="relative py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900">
        <div className="container mx-auto px-4">
          <ScrollAnimate animation="scale" className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-headline font-bold gradient-text mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to transform your tech journey
            </p>
          </ScrollAnimate>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollAnimate animation="left" delay={100}>
              <StepCard 
                num="1" 
                title="Pick a Domain" 
                description="Browse cutting-edge domains like Web Development, Cloud Architecture, Machine Learning, Cybersecurity, and emerging technologies." 
                icon={<Layers className="h-8 w-8 text-blue-500" />}
                gradient="from-blue-400 to-blue-600"
              />
            </ScrollAnimate>
            <ScrollAnimate animation="up" delay={200}>
              <StepCard 
                num="2" 
                title="Follow the Roadmap" 
                description="Navigate through curated resources, interactive tutorials, and AI-powered explanations designed for rapid skill acquisition." 
                icon={<Sparkles className="h-8 w-8 text-purple-500" />}
                gradient="from-purple-400 to-purple-600"
              />
            </ScrollAnimate>
            <ScrollAnimate animation="right" delay={300}>
              <StepCard 
                num="3" 
                title="Build Projects" 
                description="Create impressive projects, track your progress with detailed analytics, and build a portfolio that stands out." 
                icon={<ShieldCheck className="h-8 w-8 text-green-500" />}
                gradient="from-green-400 to-green-600"
              />
            </ScrollAnimate>
          </div>
        </div>
      </section>
    </>
  );
}

function FeatureCard({ icon, title, description, gradient }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  gradient: string;
}) {
  return (
    <div className="card-3d card-glow rounded-2xl bg-white/10 dark:bg-white/5 p-8 backdrop-blur-sm border border-white/20 group hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-500">
      <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${gradient} mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function StepCard({ num, title, description, icon, gradient }: { 
  num: string; 
  title: string; 
  description: string; 
  icon: React.ReactNode;
  gradient: string;
}) {
  return (
    <div className="step-card group">
      <div className="card-3d card-glow rounded-2xl bg-white/80 dark:bg-gray-800/80 p-8 backdrop-blur-sm border border-white/30 dark:border-gray-700/30 hover:bg-white dark:hover:bg-gray-800 transition-all duration-500 h-full">
        <div className="flex items-center gap-4 mb-6">
          <div className={`inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r ${gradient} text-white font-bold text-xl transform group-hover:scale-110 transition-transform duration-300`}>
            {num}
          </div>
          <div className="transform group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}