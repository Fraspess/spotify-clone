const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const APP_ENV = {
    BACKEND_URL,
    IMAGE_BASE_URL: `${BACKEND_URL}/music_images`,
    SONGS_BASE_URL: `${BACKEND_URL}/songs`
}
