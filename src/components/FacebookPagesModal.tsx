import { useState, useEffect } from 'react';
import { X, ExternalLink, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FacebookPage {
  id: string;
  page_name: string;
  page_url: string;
  niche: string;
  description: string | null;
  follower_count: number | null;
  posts_per_day: number | null;
  date_added: string;
  is_featured: boolean;
  created_at: string;
}

type SortField = 'page_name' | 'niche' | 'date_added' | 'follower_count';
type SortDirection = 'asc' | 'desc';

interface FacebookPagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FacebookPagesModal({ isOpen, onClose }: FacebookPagesModalProps) {
  const [pages, setPages] = useState<FacebookPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('date_added');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    if (isOpen) {
      fetchPages();
    }
  }, [isOpen]);

  const fetchPages = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('facebook_pages')
        .select('*')
        .order('date_added', { ascending: false });

      if (fetchError) throw fetchError;

      setPages(data || []);
    } catch (err) {
      console.error('Error fetching Facebook pages:', err);
      setError('Unable to load Facebook pages. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedPages = pages
    .filter(page =>
      page.page_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.niche.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-slate-900 bg-opacity-75"
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Automated Facebook Pages</h2>
              <button
                onClick={onClose}
                className="text-white hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-blue-100 mt-1">
              Portfolio of managed social media automation projects
            </p>
          </div>

          <div className="bg-white px-6 py-4 border-b border-slate-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by page name or niche..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="bg-white px-6 py-6 max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 text-lg mb-2">⚠️ {error}</p>
                <button
                  onClick={fetchPages}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Try Again
                </button>
              </div>
            ) : filteredAndSortedPages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500 text-lg">
                  {searchTerm ? 'No pages match your search.' : 'No Facebook pages have been added yet.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort('page_name')}
                          className="flex items-center text-xs font-semibold text-slate-700 uppercase tracking-wider hover:text-blue-600"
                        >
                          Page Name
                          {sortField === 'page_name' && (
                            sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort('niche')}
                          className="flex items-center text-xs font-semibold text-slate-700 uppercase tracking-wider hover:text-blue-600"
                        >
                          Niche
                          {sortField === 'niche' && (
                            sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort('follower_count')}
                          className="flex items-center text-xs font-semibold text-slate-700 uppercase tracking-wider hover:text-blue-600"
                        >
                          Followers
                          {sortField === 'follower_count' && (
                            sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Posts/Day
                      </th>
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort('date_added')}
                          className="flex items-center text-xs font-semibold text-slate-700 uppercase tracking-wider hover:text-blue-600"
                        >
                          Creation date
                          {sortField === 'date_added' && (
                            sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {filteredAndSortedPages.map((page) => (
                      <tr key={page.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            {page.is_featured && (
                              <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-0.5 rounded mr-2">
                                Featured
                              </span>
                            )}
                            <span className="text-sm font-medium text-slate-900">{page.page_name}</span>
                          </div>
                          {page.description && (
                            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{page.description}</p>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                            {page.niche}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-700">
                          {page.follower_count ? page.follower_count.toLocaleString() : 'N/A'}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-700">
                          {page.posts_per_day || 'N/A'}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-500">
                          {new Date(page.date_added).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <a
                            href={page.page_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                          >
                            View Page
                            <ExternalLink className="w-4 h-4 ml-1" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Showing <span className="font-semibold">{filteredAndSortedPages.length}</span> of{' '}
                <span className="font-semibold">{pages.length}</span> pages
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
