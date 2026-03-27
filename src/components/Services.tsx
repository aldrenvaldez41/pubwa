import { Globe, Brain, Zap, Code, Smartphone, Shield } from 'lucide-react';

const services = [
  {
    icon: Globe,
    title: 'Website Development',
    description: 'Custom-built, responsive websites that captivate your audience and drive conversions. From landing pages to complex web applications.',
    features: ['Responsive Design', 'SEO Optimized', 'Fast Performance', 'Modern Tech Stack']
  },
  {
    icon: Brain,
    title: 'AI Integration',
    description: 'Harness the power of artificial intelligence to automate tasks, gain insights, and deliver personalized user experiences.',
    features: ['ChatGPT Integration', 'Predictive Analytics', 'Smart Recommendations', 'Natural Language Processing']
  },
  {
    icon: Zap,
    title: 'Automation Solutions',
    description: 'Streamline your operations with intelligent automation that saves time, reduces errors, and scales with your business.',
    features: ['Workflow Automation', 'API Integration', 'Data Processing', 'Task Scheduling']
  },
  {
    icon: Code,
    title: 'Custom Development',
    description: 'Tailored solutions built specifically for your unique business needs and challenges.',
    features: ['Full-Stack Development', 'Database Design', 'Cloud Deployment', 'API Development']
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Design',
    description: 'Beautiful, intuitive interfaces optimized for all devices and screen sizes.',
    features: ['Progressive Web Apps', 'Cross-Platform', 'Touch Optimized', 'Offline Support']
  },
  {
    icon: Shield,
    title: 'Security & Performance',
    description: 'Enterprise-grade security and optimization to keep your digital assets safe and fast.',
    features: ['SSL Encryption', 'Performance Tuning', 'Security Audits', 'Monitoring']
  }
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Services That Drive Growth
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Comprehensive digital solutions tailored to your business objectives
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-blue-500 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-slate-700">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <button
            onClick={() => {
              window.location.href = '?page=services';
            }}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            View All Services & Pricing
          </button>
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Need Something Custom?</h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Every business is unique. Let's discuss how we can create a solution perfectly tailored to your needs.
          </p>
          <button
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Start a Conversation
          </button>
        </div>
      </div>
    </section>
  );
}
