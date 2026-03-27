# BuildwithAldren - Professional Portfolio Website

A modern, production-ready portfolio website for a freelance web development business specializing in website development, AI integration, and automation services.

## Features

### Public Portfolio Site
- **Hero Section**: Engaging landing area with call-to-action buttons
- **Services Showcase**: Six comprehensive service offerings with detailed descriptions
- **Dynamic Projects**: Filterable project gallery powered by Supabase database
- **About Section**: Professional positioning and value propositions
- **Contact Form**: Integrated with Supabase for inquiry management
- **Testimonials**: Dynamic client testimonials section
- **Responsive Design**: Fully responsive across all device sizes

### Admin Dashboard
- **Secure Authentication**: Supabase Auth integration
- **Project Management**: Full CRUD operations for portfolio projects
- **Content Management**: Easy-to-use interface for adding/editing projects
- **Real-time Updates**: Changes reflect immediately on the public site

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL database, Authentication, Real-time)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Ready for production deployment

## Database Schema

### Projects Table
- Title, descriptions (short and full)
- Industry categorization
- Technologies used (array)
- Image URLs and demo links
- Featured status for highlighting
- Timestamps for tracking

### Contact Inquiries Table
- Client name, email, company (optional)
- Message content
- Status tracking (new, contacted, completed)
- Timestamps

### Testimonials Table
- Client details and position
- Testimonial content
- 5-star rating system
- Published status for control
- Timestamps

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Supabase account (already configured)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Environment variables are already configured in `.env`

3. Run the development server:
```bash
npm run dev
```

### Accessing the Admin Dashboard

To access the admin panel for managing projects:

1. Navigate to `http://localhost:5173/?admin=true`
2. Create an admin account through Supabase Auth
3. Login with your credentials

## Project Structure

```
src/
├── components/
│   ├── Navigation.tsx      # Main navigation with smooth scrolling
│   ├── Hero.tsx           # Hero section with CTA
│   ├── Services.tsx       # Services showcase
│   ├── Projects.tsx       # Dynamic project gallery
│   ├── About.tsx          # About section
│   ├── Testimonials.tsx   # Client testimonials
│   ├── Contact.tsx        # Contact form
│   ├── Footer.tsx         # Footer with links
│   └── Admin.tsx          # Admin dashboard
├── lib/
│   ├── supabase.ts        # Supabase client configuration
│   └── database.types.ts  # TypeScript types for database
├── App.tsx                # Main application component
└── main.tsx              # Application entry point
```

## Key Features Implementation

### Dynamic Project Filtering
Projects can be filtered by industry category with real-time updates from the database.

### Contact Form Integration
All contact form submissions are stored in Supabase for easy management and follow-up.

### Admin Authentication
Secure login system using Supabase Auth ensures only authorized users can manage content.

### Mobile-First Design
Every component is designed with mobile users in mind, scaling beautifully to larger screens.

### Performance Optimized
- Lazy loading for images
- Efficient database queries
- Optimized bundle size
- Fast page loads

## Deployment

### Build for Production
```bash
npm run build
```

### Deployment Options
- Vercel (recommended)
- Netlify
- AWS Amplify
- Any static hosting service

The site is production-ready with optimized assets in the `dist/` folder.

## Sample Data

The database includes 3 sample real estate projects to demonstrate the portfolio functionality. Add more projects through the admin dashboard.

## Customization

### Branding
- Update company name in `Navigation.tsx`, `Footer.tsx`
- Change color scheme in Tailwind classes (currently blue/cyan)
- Replace placeholder contact information in `Contact.tsx`

### Content
- Modify services in `Services.tsx`
- Update about section content in `About.tsx`
- Adjust hero messaging in `Hero.tsx`

## Support

For questions or issues, refer to the inline documentation or component comments.

## License

Private - All rights reserved
