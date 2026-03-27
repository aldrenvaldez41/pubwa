import { Mail, Github, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <img
                src="/assets/logos/buildwithaldren-logo-white-bg.svg"
                alt="BuildwithAldren"
                className="h-10 w-10 rounded-full"
              />
            </div>
            <p className="text-slate-400 mb-4 max-w-md">
              Crafting exceptional digital experiences through innovative web development,
              AI integration, and intelligent automation solutions.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-cyan-500 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-cyan-500 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-cyan-500 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Services', 'Projects', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => {
                      const element = document.getElementById(item.toLowerCase());
                      if (element) element.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2 text-slate-400">
              <li>Website Development</li>
              <li>AI Integration</li>
              <li>Automation Solutions</li>
              <li>Custom Development</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-slate-400 text-sm">
                © {currentYear} BuildwithAldren. All rights reserved.
              </p>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => window.location.href = '?page=privacy'}
                  className="text-slate-400 hover:text-cyan-400 transition-colors text-sm"
                >
                  Privacy Policy
                </button>
                <span className="text-slate-600">•</span>
                <button
                  onClick={() => window.location.href = '?page=terms'}
                  className="text-slate-400 hover:text-cyan-400 transition-colors text-sm"
                >
                  Terms of Service
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-slate-400 text-sm">
              <Mail className="w-4 h-4" />
              <a href="mailto:hello@buildwithaldren.com" className="hover:text-cyan-400 transition-colors">
                hello@buildwithaldren.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
