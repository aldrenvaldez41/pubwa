export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          title: string
          description: string
          short_description: string
          industry: string
          technologies: string[]
          image_url: string
          demo_url: string | null
          completion_date: string | null
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          short_description: string
          industry: string
          technologies?: string[]
          image_url: string
          demo_url?: string | null
          completion_date?: string | null
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          short_description?: string
          industry?: string
          technologies?: string[]
          image_url?: string
          demo_url?: string | null
          completion_date?: string | null
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      contact_inquiries: {
        Row: {
          id: string
          name: string
          email: string
          company: string | null
          message: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          company?: string | null
          message: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          company?: string | null
          message?: string
          status?: string
          created_at?: string
        }
      }
      testimonials: {
        Row: {
          id: string
          client_name: string
          company: string | null
          position: string | null
          testimonial: string
          rating: number
          is_published: boolean
          created_at: string
        }
        Insert: {
          id?: string
          client_name: string
          company?: string | null
          position?: string | null
          testimonial: string
          rating?: number
          is_published?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          client_name?: string
          company?: string | null
          position?: string | null
          testimonial?: string
          rating?: number
          is_published?: boolean
          created_at?: string
        }
      }
      facebook_pages: {
        Row: {
          id: string
          page_name: string
          page_url: string
          niche: string
          description: string | null
          follower_count: number | null
          posts_per_day: number | null
          date_added: string
          is_featured: boolean
          created_at: string
        }
        Insert: {
          id?: string
          page_name: string
          page_url: string
          niche: string
          description?: string | null
          follower_count?: number | null
          posts_per_day?: number | null
          date_added?: string
          is_featured?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          page_name?: string
          page_url?: string
          niche?: string
          description?: string | null
          follower_count?: number | null
          posts_per_day?: number | null
          date_added?: string
          is_featured?: boolean
          created_at?: string
        }
      }
    }
  }
}
