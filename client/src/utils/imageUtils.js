export const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('https') || path.startsWith('blob:') || path.startsWith('data:')) {
        return path;
    }

    // Fallback to localhost:5000 if not defined
    let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    // Remove /api suffix to get base URL
    if (API_URL.endsWith('/api')) {
        API_URL = API_URL.slice(0, -4);
    }

    // Ensure path starts with /
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    return `${API_URL}${cleanPath}`;
};
