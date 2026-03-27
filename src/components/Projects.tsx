import { useState, useEffect } from 'react';
import { ExternalLink, Calendar, Star, Facebook } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import FacebookPagesModal from './FacebookPagesModal';

type Project = Database['public']['Tables']['projects']['Row'];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [industries, setIndustries] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setProjects(data);
        const uniqueIndustries = Array.from(new Set(data.map(p => p.industry)));
        setIndustries(uniqueIndustries);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = selectedIndustry === 'all'
    ? projects
    : projects.filter(p => p.industry === selectedIndustry);

  const featuredProjects = filteredProjects.filter(p => p.is_featured);
  const regularProjects = filteredProjects.filter(p => !p.is_featured);

  return (
    <section id="projects" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Portfolio Showcase
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Explore our recent projects and see how we transform ideas into reality
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setSelectedIndustry('all')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              selectedIndustry === 'all'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Projects
          </button>
          {industries.map((industry) => (
            <button
              key={industry}
              onClick={() => setSelectedIndustry(industry)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedIndustry === industry
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {industry}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <>
            <div className="mb-16">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                <SocialMediaShowcaseCard onClick={() => setIsModalOpen(true)} />
              </div>
            </div>

            {featuredProjects.length > 0 && (
              <div className="mb-16">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                  <Star className="w-6 h-6 text-yellow-500 mr-2 fill-current" />
                  Featured Projects
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  {featuredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} featured />
                  ))}
                </div>
              </div>
            )}

            {regularProjects.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">More Projects</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </div>
            )}

            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500 text-lg">No projects found in this category.</p>
              </div>
            )}
          </>
        )}
      </div>

      <FacebookPagesModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}

function SocialMediaShowcaseCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-blue-500 text-left w-full"
    >
      <div className="p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
            <Facebook className="w-8 h-8 text-white" />
          </div>
          <span className="bg-yellow-400 text-slate-900 px-3 py-1 rounded-full text-sm font-bold">
            Showcase
          </span>
        </div>

        <h3 className="text-2xl font-bold text-white mb-3">
          Social Media Automation
        </h3>

        <p className="text-blue-100 mb-6 leading-relaxed">
          Explore our demo collection of 15+ automated Facebook pages showcasing daily content posting, engagement tracking, and performance optimization capabilities.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="text-blue-200 text-sm">Demo Pages</p>
            <p className="text-white text-2xl font-bold">15+</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <p className="text-blue-200 text-sm">Posts Per Day</p>
            <p className="text-white text-2xl font-bold">60+</p>
          </div>
        </div>

        <div className="flex items-center text-white font-semibold group-hover:translate-x-2 transition-transform">
          View Demo Pages
          <ExternalLink className="w-5 h-5 ml-2" />
        </div>
      </div>
    </button>
  );
}

function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-200">
      <div className="relative overflow-hidden aspect-video">
        <img
          src={project.image_url}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        {featured && (
          <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
            <Star className="w-4 h-4 mr-1 fill-current" />
            Featured
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            {project.industry}
          </span>
          {project.completion_date && (
            <div className="flex items-center text-slate-500 text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(project.completion_date).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric'
              })}
            </div>
          )}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{project.title}</h3>
        <p className="text-slate-600 mb-4 line-clamp-2">{project.short_description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 3).map((tech, idx) => (
            <span key={idx} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
              +{project.technologies.length - 3} more
            </span>
          )}
        </div>
        {project.demo_url && (
          <a
            href={project.demo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors group/link"
          >
            View Project
            <ExternalLink className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
          </a>
        )}
      </div>
    </div>
  );
}
