import { useState, useEffect } from 'react';
import { Quote, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Testimonial = Database['public']['Tables']['testimonials']['Row'];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setTestimonials(data);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  if (testimonials.length === 0) {
    return (
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Client Success Stories
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Building relationships and delivering results. Testimonials coming soon from satisfied clients.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            What Clients Say
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Don't just take my word for it. Here's what clients have to say about working together
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-slate-50 rounded-xl p-8 border border-slate-200 hover:shadow-lg transition-shadow"
            >
              <Quote className="w-10 h-10 text-blue-500 mb-4" />

              <div className="flex mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonial.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>

              <p className="text-slate-700 mb-6 leading-relaxed">
                "{testimonial.testimonial}"
              </p>

              <div className="pt-4 border-t border-slate-200">
                <div className="font-semibold text-slate-900">{testimonial.client_name}</div>
                {testimonial.position && testimonial.company && (
                  <div className="text-sm text-slate-600">
                    {testimonial.position} at {testimonial.company}
                  </div>
                )}
                {testimonial.company && !testimonial.position && (
                  <div className="text-sm text-slate-600">{testimonial.company}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
