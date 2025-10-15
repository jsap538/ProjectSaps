# Encore - Men's Premium Accessories Resale

A modern, sleek marketplace for buying and selling premium men's accessories including ties, cufflinks, belts, and pocket squares.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Database**: MongoDB with Mongoose
- **Payments**: Stripe
- **Hosting**: Vercel (recommended)

## Brand Colors

- **Primary (Digital Fern)**: #33CC66
- **Dark (Cloud Burst)**: #3B414D
- **Light Gray**: #F1F1F1
- **Medium Gray**: #D9DADA

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd ProjectSaps
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp env.example .env.local
   ```
   Edit `.env.local` with your actual credentials (never commit this file).

4. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── browse/          # Browse/search page with filters
│   ├── items/[id]/      # Product detail pages
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout with navbar/footer
│   └── page.tsx         # Homepage
├── components/
│   ├── Footer.tsx       # Site footer
│   ├── ListingCard.tsx  # Product card component
│   └── Navbar.tsx       # Navigation bar
└── public/              # Static assets

```

## Features Implemented (MVP Frontend)

- ✅ Modern, sleek homepage with hero section
- ✅ Browse page with filters (brand, category, condition, color)
- ✅ Product detail pages with specifications
- ✅ Responsive design (mobile-first)
- ✅ Brand color scheme applied throughout
- ✅ Listing card component
- ✅ Navigation and footer

## Features Implemented

- ✅ Modern, sleek homepage with hero section
- ✅ Browse page with filters (brand, category, condition, color)
- ✅ Product detail pages with specifications
- ✅ Responsive design (mobile-first)
- ✅ Brand color scheme applied throughout
- ✅ Listing card component
- ✅ Navigation and footer
- ✅ Clerk authentication integration
- ✅ MongoDB database with Mongoose models
- ✅ Protected routes middleware

## Security

**⚠️ IMPORTANT SECURITY NOTICE:**

- **Never commit `.env.local`** or any files containing credentials
- **Use environment variables** for all sensitive data
- **Rotate credentials** if they are ever exposed
- **Use the secure script runner** for database operations:
  ```bash
  node scripts/run-with-env.js scripts/populate-items.mjs
  ```

## Next Steps (Backend Integration)

1. ✅ Set up database (MongoDB with Mongoose)
2. ✅ Implement authentication (Clerk)
3. Connect Stripe for payments
4. Build API routes for CRUD operations
5. Add image upload (Cloudinary/Uploadcare)
6. Implement seller dashboard
7. Build admin panel
8. Add CSV import functionality

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## License

Private project

