# Lotus Frontend

Modern, responsive React frontend for the Lotus video sharing platform.

## Features

- ⚡ **Lightning Fast**: Built with Vite for instant HMR
- 🎨 **Beautiful UI**: Tailwind CSS with dark mode support
- 🔐 **Secure Auth**: JWT-based authentication with persistent sessions
- 📱 **Responsive**: Mobile-first design that works on all devices
- 🎥 **Video Player**: Custom video player with controls
- 🔍 **Search**: Real-time search with debouncing
- 📊 **State Management**: Redux Toolkit for predictable state
- 🚀 **Performance**: React Query for efficient data fetching
- ♿ **Accessible**: WCAG 2.1 compliant components

## Tech Stack

- **Library**: React 18
- **Build Tool**: Vite 4
- **Styling**: Tailwind CSS 3
- **State Management**: Redux Toolkit
- **Data Fetching**: React Query (TanStack Query)
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **Icons**: Lucide React / Heroicons
- **Notifications**: React Hot Toast

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/lotus-video-platform.git
cd lotus-video-platform/frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the frontend directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000

# Application
VITE_APP_NAME=Lotus
VITE_APP_DESCRIPTION=Modern Video Sharing Platform

# Upload Limits (bytes)
VITE_MAX_VIDEO_SIZE=524288000
VITE_MAX_THUMBNAIL_SIZE=5242880
```

### 4. Run the application

**Development mode:**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

**Build for production:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

## Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

## Project Structure

```
frontend/
├── public/                  # Static assets
│   ├── favicon.ico
│   └── logo.png
│
├── src/
│   ├── assets/              # Images, fonts, etc.
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/          # Reusable components
│   │   ├── common/          # Shared components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── VideoCard.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── ErrorMessage.jsx
│   │   │
│   │   └── auth/            # Auth-specific components
│   │       └── ProtectedRoute.jsx
│   │
│   ├── pages/               # Page components
│   │   ├── Home.jsx
│   │   ├── VideoPlayer.jsx
│   │   ├── Search.jsx
│   │   ├── Trending.jsx
│   │   ├── Upload.jsx
│   │   ├── Profile.jsx
│   │   ├── Channel.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── NotFound.jsx
│   │
│   ├── layouts/             # Layout components
│   │   ├── MainLayout.jsx
│   │   └── AuthLayout.jsx
│   │
│   ├── store/               # Redux store
│   │   ├── index.js
│   │   └── slices/
│   │       ├── authSlice.js
│   │       ├── videoSlice.js
│   │       └── themeSlice.js
│   │
│   ├── services/            # API services
│   │   ├── apiClient.js     # Axios instance
│   │   ├── authService.js   # Auth API calls
│   │   ├── videoService.js  # Video API calls
│   │   ├── commentService.js
│   │   ├── likeService.js
│   │   └── userService.js
│   │
│   ├── hooks/               # Custom hooks
│   │   ├── useAuth.js
│   │   ├── useDebounce.js
│   │   ├── useInfiniteScroll.js
│   │   └── useLocalStorage.js
│   │
│   ├── utils/               # Utility functions
│   │   ├── helpers.js       # General helpers
│   │   ├── validators.js    # Form validators
│   │   ├── constants.js     # App constants
│   │   └── formatters.js    # Data formatters
│   │
│   ├── App.jsx              # Root component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
│
├── .env                     # Environment variables
├── .env.example             # Environment template
├── .eslintrc.json           # ESLint config
├── .prettierrc              # Prettier config
├── tailwind.config.js       # Tailwind config
├── vite.config.js           # Vite config
├── postcss.config.js        # PostCSS config
├── index.html               # HTML template
└── package.json
```

## Routing

| Route                | Component      | Description                  | Protected |
|----------------------|----------------|------------------------------|-----------|
| `/`                  | Home           | Homepage with video feed     | No        |
| `/video/:id`         | VideoPlayer    | Video player page            | No        |
| `/search`            | Search         | Search results               | No        |
| `/trending`          | Trending       | Trending videos              | No        |
| `/upload`            | Upload         | Upload new video             | Yes       |
| `/profile`           | Profile        | User profile                 | Yes       |
| `/channel/:id`       | Channel        | Channel page                 | No        |
| `/login`             | Login          | Login page                   | No        |
| `/register`          | Register       | Registration page            | No        |
| `*`                  | NotFound       | 404 page                     | No        |

## State Management

### Redux Store Structure

```javascript
{
  auth: {
    user: null | Object,
    token: null | string,
    isAuthenticated: boolean,
    loading: boolean,
    error: null | string
  },
  videos: {
    items: [],
    currentVideo: null,
    loading: boolean,
    error: null | string
  },
  theme: {
    mode: 'light' | 'dark'
  }
}
```

### Using Redux

```jsx
import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from './store/slices/authSlice';

function MyComponent() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogin = (credentials) => {
    dispatch(login(credentials));
  };
}
```

## React Query

Data fetching with React Query for server state management:

```jsx
import { useQuery } from '@tanstack/react-query';
import videoService from './services/videoService';

function VideoList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['videos'],
    queryFn: () => videoService.getAllVideos(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <VideoGrid videos={data} />;
}
```

## API Services

All API calls are centralized in service files:

```javascript
// services/videoService.js
import apiClient from './apiClient';

const videoService = {
  getAllVideos: (params) => apiClient.get('/videos', { params }),
  getVideoById: (id) => apiClient.get(`/videos/${id}`),
  uploadVideo: (formData) => apiClient.post('/videos/upload', formData),
  updateVideo: (id, data) => apiClient.put(`/videos/${id}`, data),
  deleteVideo: (id) => apiClient.delete(`/videos/${id}`),
  getTrending: () => apiClient.get('/videos/trending'),
};

export default videoService;
```

## Custom Hooks

### useAuth
```jsx
import useAuth from './hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // Use auth state and methods
}
```

### useDebounce
```jsx
import useDebounce from './hooks/useDebounce';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    // API call with debounced value
  }, [debouncedSearch]);
}
```

## Styling with Tailwind

### Dark Mode
```jsx
// Automatically switches based on user preference
<div className="bg-white dark:bg-gray-900">
  <h1 className="text-gray-900 dark:text-white">Title</h1>
</div>
```

### Responsive Design
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Responsive grid */}
</div>
```

### Custom Utilities
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff1f2',
          // ... custom color palette
        },
      },
    },
  },
};
```

## Components

### VideoCard Component
```jsx
import VideoCard from './components/common/VideoCard';

<VideoCard
  video={{
    id: '123',
    title: 'Video Title',
    thumbnail: '/path/to/thumb.jpg',
    duration: 320,
    views: 1500,
    uploadedBy: { username: 'user', avatar: '/avatar.jpg' }
  }}
/>
```

### Protected Route
```jsx
import ProtectedRoute from './components/auth/ProtectedRoute';

<Route
  path="/upload"
  element={
    <ProtectedRoute>
      <Upload />
    </ProtectedRoute>
  }
/>
```

## Forms

Using React Hook Form for form validation:

```jsx
import { useForm } from 'react-hook-form';

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address'
          }
        })}
      />
      {errors.email && <span>{errors.email.message}</span>}
    </form>
  );
}
```

## Environment Variables

Access environment variables with `import.meta.env`:

```javascript
const API_URL = import.meta.env.VITE_API_URL;
const APP_NAME = import.meta.env.VITE_APP_NAME;
```

## Performance Optimization

### Code Splitting
```jsx
import { lazy, Suspense } from 'react';

const Upload = lazy(() => import('./pages/Upload'));

<Suspense fallback={<LoadingSpinner />}>
  <Upload />
</Suspense>
```

### Memoization
```jsx
import { memo, useMemo, useCallback } from 'react';

const VideoCard = memo(({ video }) => {
  // Component only re-renders when video prop changes
});

const expensiveCalculation = useMemo(() => {
  return heavyComputation(data);
}, [data]);

const handleClick = useCallback(() => {
  // Function reference stays the same
}, []);
```

### Image Optimization
```jsx
<img
  src={thumbnail}
  alt={title}
  loading="lazy"
  className="object-cover w-full h-48"
/>
```

## Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

## Docker

### Build image
```bash
docker build -t lotus-frontend .
```

### Run container
```bash
docker run -p 80:80 lotus-frontend
```

### Using Docker Compose
```bash
# From project root
docker-compose up frontend
```

## Build Optimization

Vite automatically handles:
- Code splitting
- Tree shaking
- Minification
- Asset optimization
- CSS purging (via Tailwind)

Build output in `dist/` directory.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast compliance

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Code Style

- **ESLint** with React rules
- **Prettier** for formatting
- **Airbnb** style guide

Run before committing:
```bash
npm run lint
npm run format
```

## Troubleshooting

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Vite Build Errors
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

### API Connection Issues
- Check `VITE_API_URL` in `.env`
- Verify backend is running
- Check browser console for CORS errors

### Dark Mode Not Working
- Clear browser localStorage
- Check system dark mode preference
- Verify Tailwind dark mode config

## Performance Tips

1. **Lazy Loading**: Use dynamic imports for routes
2. **Image Optimization**: Compress images before upload
3. **Bundle Size**: Analyze with `npm run build -- --analyze`
4. **Caching**: Configure service worker for PWA
5. **CDN**: Serve assets from CDN in production

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Deploy with Docker
```bash
docker build -t lotus-frontend .
docker run -p 80:80 lotus-frontend
```

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## Support

For issues and questions:
- Open an issue on GitHub
- Check [Documentation](../docs/)
- See [API Documentation](../docs/API.md)

## Acknowledgments

- React team
- Vite team
- Tailwind CSS
- Redux Toolkit
- React Query
- All open-source contributors
