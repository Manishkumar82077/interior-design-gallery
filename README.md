# Interior Design Gallery Feed Application

A responsive gallery feed application for browsing interior design images with tag-based filtering and detailed gallery views.

## 🚀 Features

- **Gallery Feed**: Grid layout with responsive design (2-5 columns based on screen size)
- **Tag Filtering**: Filter images by categories (Kitchen, Bedroom, Bathroom, etc.)
- **Gallery Detail Page**: Large hero image with profile information and similar images
- **Similar Images**: AI-powered recommendations based on shared tags
- **Responsive Design**: Mobile-first approach with seamless tablet and desktop views

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MySQL (Aiven Cloud)
- **Deployment**: Vercel

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd gallery-feed-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your database credentials:
```
DB_HOST=your-aiven-host
DB_PORT=25060
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=revised-cms
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!
```bash
# Or use Vercel CLI
npm install -g vercel
vercel
```

## 📊 Database Schema

The application uses 4 main tables:
- `digital_profiles`: Profile information
- `project_media_galleries`: Gallery images
- `project_gallery_tags`: Category tags
- `project_media_galleries_tag_id_links`: Many-to-many relationship between galleries and tags

## 🎯 Key Design Decisions

1. **API Routes**: Used Next.js API routes for clean separation of concerns
2. **Server Components**: Leveraged Next.js 14 server components for better performance
3. **Tag-based Filtering**: Implemented efficient SQL queries for filtering
4. **Image Optimization**: Used lazy loading and proper aspect ratios
5. **Responsive Grid**: Mobile-first approach with Tailwind CSS grid

## 🔍 API Endpoints

- `GET /api/tags` - Fetch all available tags
- `GET /api/galleries?tagId=X` - Fetch galleries (optionally filtered by tag)
- `GET /api/gallery/[id]` - Fetch gallery detail with similar images

## 📝 Assumptions Made

1. Database connection is stable and uses SSL (Aiven requirement)
2. Image URLs from S3 are publicly accessible
3. Similar images are determined by shared tags
4. Maximum 100 galleries displayed in feed for performance
5. Maximum 10 similar images shown per detail page

## 🐛 Known Issues

None at this time. Please report any issues you find!

## 📄 License

MIT

## 👤 Author

Your Name

---

Built with ❤️ for the FullStack Developer Assignment