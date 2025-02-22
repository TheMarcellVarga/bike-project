# Trail Blazer - Mountain Bike E-commerce

A modern e-commerce platform for mountain bikes and accessories, built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🚲 Extensive catalog of mountain bikes and accessories
- 🛒 Seamless shopping experience
- 🔐 Secure user authentication with Supabase Auth
- 💳 Secure payment processing
- 📱 Fully responsive design
- 🎨 Modern, gritty, and bold aesthetic

## Tech Stack

- **Frontend:**
  - Next.js 14 (App Router)
  - TypeScript
  - Tailwind CSS
  - Lucide Icons

- **Backend:**
  - Next.js API Routes
  - Supabase (Auth & Database)
  - PostgreSQL (hosted by Supabase)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bike-project.git
   cd bike-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── src/
│   ├── app/             # Next.js app directory
│   ├── components/      # Reusable components
│   ├── lib/            # Utility functions and configurations
│   └── types/          # TypeScript type definitions
├── public/             # Static assets
└── ...
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
