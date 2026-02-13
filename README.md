# Interior Design Gallery Feed Application

A responsive gallery feed application for browsing interior design images with tag-based filtering and detailed gallery views.

## 🚀 Deploy Link

[https://interior-design-gallery.vercel.app/](https://interior-design-gallery.vercel.app/)

## 📸 Screenshots

![Home Page](https://github.com/Manishkumar82077/interior-design-gallery/blob/main/ScreenShoots/image1.png?raw=true)
![Gallery Page](https://github.com/Manishkumar82077/interior-design-gallery/blob/main/ScreenShoots/image2.png?raw=true)

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
git clone https://github.com/Manishkumar82077/interior-design-gallery
cd interior-design-gallery
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

## 📍 Routes Overview

### 🏠 HOME (`/`)
- Main landing page of the application
- Header [ Application name , Tag Bar]
- Displays all gallery images in a responsive grid
- Includes header navigation and tag-based filtering
- Uses server-side fetching and `next/image` for performance

---

### 👤 PROFILE (`/profile/{id}`)
- Displays a contractor's profile and uploaded galleries
- `{id}` represents the **contractor UUID**
- Implemented using **Server Components**
- Data fetched via `getProfileWithGalleries` service:
  - Profile details (name, photo, stats)
  - Associated gallery images with tags
- Uses `notFound()` for invalid or missing profiles

---

### 🖼️ GALLERY (`/gallery/{galleryId}`)
- Displays detailed view of a single gallery item
- `{galleryId}` represents `project_media_galleries.id`
- Data fetched server-side from **MySQL (Aiven Cloud)**
- Shows media, tags, and metadata
- Optimized for SEO and fast rendering

---

## 🔍 API Endpoints

- `GET /api/tags` - Fetch all available tags
- `GET /api/galleries?tagId=X` - Fetch galleries (optionally filtered by tag)
- `GET /api/gallery/[id]` - Fetch gallery detail with similar images

## 🎯 Key Design Decisions

- **API Routes (Next.js App Router)** Backend logic is implemented using Next.js API routes, ensuring a clean separation of concerns between data handling and UI rendering. This approach improves maintainability and scalability.

- **Server Components (Next.js 14)** Server Components are leveraged wherever possible to minimize client-side JavaScript, improve SEO, and deliver faster initial page loads.

- **Client Components Only When Necessary** Client components are limited to interactive features such as filtering, hover effects, and dynamic UI updates, reducing hydration overhead.

- **Global State Management with Zustand** Zustand is used for lightweight and efficient global state management. Shared UI state such as selected tags and filters is centralized, avoiding prop drilling and unnecessary re-renders.

- **Image Optimization Strategy** Images are rendered using Next.js `Image` component with lazy loading, responsive sizing, and optimized formats to enhance performance and prevent layout shifts.

- **Responsive Grid Layout** A mobile-first responsive grid is built using Tailwind CSS, ensuring a consistent and adaptive user experience across devices.

- **Reusable Component Architecture** The application is structured around modular and reusable components, improving readability, testability, and development speed.

- **Type Safety with TypeScript** TypeScript is used across the application for API contracts, database models, and UI components, reducing runtime errors and improving long-term maintainability.

- **Performance & UX Enhancements** Skeleton loaders, smooth hover interactions, and clear visual feedback are implemented to improve perceived performance and usability.

- **Scalable Project Structure** A feature-based folder organization is followed under the `app/` directory, making the codebase easy to extend and maintain.

- **Production-Ready Practices** Environment-based configuration, structured error handling, and clean linted code ensure the application is deployment-ready.

## 📊 Database Schema

The application uses 4 main tables:
- `digital_profiles`: Profile information
- `project_media_galleries`: Gallery images
- `project_gallery_tags`: Category tags
- `project_media_galleries_tag_id_links`: Many-to-many relationship between galleries and tags

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel dashboard
3. Add environment variables in Vercel dashboard
4. Deploy!

```bash
# Or use Vercel CLI
npm install -g vercel
vercel
```

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

Manish kumar

---

Built with ❤️ for the Frontend Developer Assignment