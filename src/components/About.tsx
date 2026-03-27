import { CheckCircle2, Award, Users, Lightbulb } from 'lucide-react';

const highlights = [
  {
    icon: Award,
    title: 'Quality Focused',
    description: 'Every line of code is crafted with precision and attention to detail'
  },
  {
    icon: Users,
    title: 'Client-Centric',
    description: 'Your success is our success. We build partnerships, not just websites'
  },
  {
    icon: Lightbulb,
    title: 'Innovation Driven',
    description: 'Staying ahead with the latest technologies and best practices'
  }
];

const values = [
  'Transparent communication throughout the project lifecycle',
  'Agile development for faster delivery and flexibility',
  'Clean, maintainable code that scales with your business',
  'Comprehensive documentation and ongoing support',
  'Data-driven decisions backed by analytics and insights',
  'Security and performance as top priorities'
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Building Digital Excellence,
              <span className="block text-cyan-400">One Project at a Time</span>
            </h2>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              I'm a passionate full-stack developer specializing in creating modern, scalable web applications
              that solve real business problems. With expertise in cutting-edge technologies and a commitment
              to excellence, I transform complex challenges into elegant solutions.
            </p>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              From startups to established businesses, I partner with clients to build digital products that
              not only look great but perform exceptionally. Whether it's a sophisticated web application,
              AI-powered automation, or a complete digital transformation, I bring technical expertise and
              creative problem-solving to every project.
            </p>

            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              {highlights.map((highlight, index) => {
                const Icon = highlight.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{highlight.title}</h3>
                    <p className="text-sm text-slate-400">{highlight.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
              <h3 className="text-2xl font-bold mb-6">What Sets Me Apart</h3>
              <div className="space-y-4">
                {values.map((value, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle2 className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-300">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold mb-1">100%</div>
                <div className="text-sm text-blue-100">On-Time Delivery</div>
              </div>
              <div className="bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold mb-1">24/7</div>
                <div className="text-sm text-blue-100">Support Available</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-xl text-slate-300 mb-6">
            Ready to bring your vision to life?
          </p>
          <button
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Let's Work Together
          </button>
        </div>
      </div>
    </section>
  );
}
