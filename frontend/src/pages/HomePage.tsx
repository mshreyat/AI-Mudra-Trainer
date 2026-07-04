import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { FeatureCard } from '@/components/home/FeatureCard';

export default function HomePage() {
  return (
    <div className="flex-grow flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16 lg:pt-40 lg:pb-28">
        {/* Background Gradients for Premium Feel */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-900/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-900/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-2 bg-surface-800/50 border border-surface-700/50 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-medium text-primary-200 mb-8 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
            <span>MudraSense AI Foundation</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight mb-6 animate-slide-up" style={{ animationFillMode: 'both' }}>
            <span className="text-white block">Master the Art with</span>
            <span className="gradient-text pb-2">MudraSense AI</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-surface-300 mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            AI Powered Bharatanatyam Mudra Trainer. Get real-time feedback, perfect your hand gestures, and track your progress with state-of-the-art vision models.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <Link to="/practice">
              <Button size="lg" className="w-full sm:w-auto min-w-[200px]">
                Start Practice
              </Button>
            </Link>
            <Link to="/library">
              <Button variant="outline" size="lg" className="w-full sm:w-auto min-w-[200px]">
                Explore Library
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-surface-900/30 border-t border-surface-800/50 -z-10"></div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Core Features</h2>
            <p className="text-surface-400 max-w-2xl mx-auto">Everything you need to perfect your Mudras and enhance your Bharatanatyam practice.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto animate-slide-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
            <FeatureCard 
              title="Learn Mudras"
              description="Explore our comprehensive library of Asamyuta and Samyuta hastas. Learn their meanings, origins, and correct postures."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
              }
            />
            <FeatureCard 
              title="Practice Sessions"
              description="Start a guided session and use your webcam to receive intelligent, real-time corrections and guidance as you practice."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
              }
            />
            <FeatureCard 
              title="Progress Analytics"
              description="Track your accuracy over time. Identify areas for improvement with detailed performance breakdowns and history."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
              }
            />
          </div>
        </div>
      </section>
    </div>
  );
}
