import fs from "fs";
import path from "path";
import os from "os";
import { Video, Category, SiteSettings } from "@/types";

// Determine environments
const isServerless = process.env.VERCEL === "1" || process.env.AWS_LAMBDA_FUNCTION_NAME !== undefined;
const SEED_DIR = path.join(process.cwd(), "data");

// In serverless (Vercel), write to /tmp; in local environment, write to project data folder
const WRITABLE_DIR = isServerless ? path.join(os.tmpdir(), "darigate_data") : SEED_DIR;

const VIDEOS_FILE = path.join(WRITABLE_DIR, "videos.json");
const CATEGORIES_FILE = path.join(WRITABLE_DIR, "categories.json");
const SETTINGS_FILE = path.join(WRITABLE_DIR, "settings.json");

// Default Fallback Data
const DEFAULT_CATEGORIES: Category[] = [
  { id: "cat-1", name: "الكل", slug: "all" },
  { id: "cat-2", name: "فنانات مصر", slug: "egyptian-artists" },
  { id: "cat-3", name: "فنانات عرب", slug: "arab-artists" },
  { id: "cat-4", name: "مشهورات السوشيال", slug: "social-media-stars" },
  { id: "cat-5", name: "تانجو ولايف", slug: "tango-live" },
  { id: "cat-6", name: "فيديوهات حصرية", slug: "exclusive" },
  { id: "cat-7", name: "منوعات وجديد", slug: "trending" },
];

const DEFAULT_VIDEOS: Video[] = [
  {
    id: "vid-101",
    title: "مقطع حصري استعراض المشاهير بجودة عالية HD",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=60",
    duration: "10:24",
    category: "فنانات مصر",
    tags: ["حصري", "فنانات", "جديد"],
    views: 15420,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    featured: true,
  },
  {
    id: "vid-102",
    title: "فيديو مسرب من البث المباشر لأجمل الإطلالات والمشاهد",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=60",
    duration: "14:50",
    category: "تانجو ولايف",
    tags: ["لايف", "بث", "مشاهير"],
    views: 28900,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    featured: true,
  },
  {
    id: "vid-103",
    title: "أحدث ظهور مميز لنجمة السوشيال ميديا بفستان أنيق",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=60",
    duration: "06:15",
    category: "مشهورات السوشيال",
    tags: ["مشهورات", "انستغرام", "تيك_توك"],
    views: 9340,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "vid-104",
    title: "كواليس حصرية وتفاصيل ليلة الحفل كاملة بجودة فائقة",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=60",
    duration: "18:05",
    category: "فنانات عرب",
    tags: ["كواليس", "عرب", "حفلات"],
    views: 34100,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    featured: true,
  },
  {
    id: "vid-105",
    title: "مقطع ساخن ومثير من أحدث جلسة تصوير للموديل الشهيرة",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=60",
    duration: "08:32",
    category: "فيديوهات حصرية",
    tags: ["جلسة تصوير", "موديل", "حصري"],
    views: 45200,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: "vid-106",
    title: "فيديو تانجو لايف المشهورة مع الداعمين واستعراض خاص",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&auto=format&fit=crop&q=60",
    duration: "12:18",
    category: "تانجو ولايف",
    tags: ["تانجو", "لايف", "فضيحة"],
    views: 67300,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(),
    featured: true,
  },
  {
    id: "vid-107",
    title: "لقطات مميزة ورقص شرقي في حفل خاص كامل بدون حذف",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=60",
    duration: "15:40",
    category: "فنانات مصر",
    tags: ["رقص", "حفل", "مصر"],
    views: 22100,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    id: "vid-108",
    title: "فيديو المشهورة اللبنانية تتألق بإطلالة نارية ومثيرة",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop&q=60",
    duration: "09:55",
    category: "فنانات عرب",
    tags: ["لبنان", "عرب", "إغراء"],
    views: 31050,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 84).toISOString(),
  },
];

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "الفن والجمال",
  siteDescription: "الموقع الأفضل المتخصص في فيديوهات وصور المشاهير والفنانات ومشهورات السوشيال ميديا بجودة فائقة.",
  adminPin: process.env.ADMIN_PIN || "admin123",
  adBannerCode: "",
};

// Global in-memory cache to persist data across serverless warm requests
declare global {
  var __darigate_videos: Video[] | undefined;
  var __darigate_categories: Category[] | undefined;
  var __darigate_settings: SiteSettings | undefined;
}

function ensureDir() {
  try {
    if (!fs.existsSync(WRITABLE_DIR)) {
      fs.mkdirSync(WRITABLE_DIR, { recursive: true });
    }
  } catch (err) {
    console.warn("Could not create WRITABLE_DIR, using in-memory only:", err);
  }
}

// Safely read initial seed file if exists
function readInitialSeed<T>(filename: string, defaultVal: T): T {
  try {
    const seedPath = path.join(SEED_DIR, filename);
    if (fs.existsSync(seedPath)) {
      const data = fs.readFileSync(seedPath, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn(`Could not read seed file ${filename}:`, e);
  }
  return defaultVal;
}

export function getCategories(): Category[] {
  if (globalThis.__darigate_categories && globalThis.__darigate_categories.length > 0) {
    return globalThis.__darigate_categories;
  }

  try {
    ensureDir();
    if (fs.existsSync(CATEGORIES_FILE)) {
      const data = fs.readFileSync(CATEGORIES_FILE, "utf-8");
      const parsed = JSON.parse(data);
      globalThis.__darigate_categories = parsed;
      return parsed;
    }
  } catch (err) {
    console.warn("Error reading categories from writable file:", err);
  }

  const initial = readInitialSeed("categories.json", DEFAULT_CATEGORIES);
  globalThis.__darigate_categories = initial;
  saveCategories(initial);
  return initial;
}

export function saveCategories(categories: Category[]): void {
  globalThis.__darigate_categories = categories;
  try {
    ensureDir();
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2), "utf-8");
    if (!isServerless && WRITABLE_DIR !== SEED_DIR) {
      fs.writeFileSync(path.join(SEED_DIR, "categories.json"), JSON.stringify(categories, null, 2), "utf-8");
    }
  } catch (err) {
    console.warn("Writing categories to disk failed (operating in memory mode):", err);
  }
}

export function getVideos(): Video[] {
  if (globalThis.__darigate_videos && globalThis.__darigate_videos.length > 0) {
    return globalThis.__darigate_videos;
  }

  try {
    ensureDir();
    if (fs.existsSync(VIDEOS_FILE)) {
      const data = fs.readFileSync(VIDEOS_FILE, "utf-8");
      const parsed = JSON.parse(data);
      globalThis.__darigate_videos = parsed;
      return parsed;
    }
  } catch (err) {
    console.warn("Error reading videos from writable file:", err);
  }

  const initial = readInitialSeed("videos.json", DEFAULT_VIDEOS);
  globalThis.__darigate_videos = initial;
  saveVideos(initial);
  return initial;
}

export function saveVideos(videos: Video[]): void {
  // Always update in-memory state first
  globalThis.__darigate_videos = videos;

  try {
    ensureDir();
    fs.writeFileSync(VIDEOS_FILE, JSON.stringify(videos, null, 2), "utf-8");
    if (!isServerless && WRITABLE_DIR !== SEED_DIR) {
      fs.writeFileSync(path.join(SEED_DIR, "videos.json"), JSON.stringify(videos, null, 2), "utf-8");
    }
  } catch (err) {
    console.warn("Writing videos to disk failed (operating in memory mode):", err);
  }
}

export function getVideoById(id: string): Video | null {
  const videos = getVideos();
  return videos.find((v) => v.id === id) || null;
}

export function incrementViews(id: string): void {
  const videos = getVideos();
  const videoIndex = videos.findIndex((v) => v.id === id);
  if (videoIndex !== -1) {
    videos[videoIndex].views += 1;
    saveVideos(videos);
  }
}

export function addVideo(videoData: {
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration?: string;
  category: string;
  tags?: string[];
  description?: string;
}): Video {
  const videos = getVideos();
  const newVideo: Video = {
    id: "vid-" + Date.now(),
    title: videoData.title.trim(),
    videoUrl: videoData.videoUrl.trim(),
    thumbnailUrl: videoData.thumbnailUrl.trim(),
    duration: videoData.duration?.trim() || "05:00",
    category: videoData.category || "منوعات وجديد",
    tags: videoData.tags || [],
    views: Math.floor(Math.random() * 50) + 1,
    createdAt: new Date().toISOString(),
    description: videoData.description || "",
  };

  const updatedVideos = [newVideo, ...videos];
  saveVideos(updatedVideos);
  return newVideo;
}

export function updateVideo(id: string, updateData: Partial<Video>): Video | null {
  const videos = getVideos();
  const index = videos.findIndex((v) => v.id === id);
  if (index === -1) return null;

  videos[index] = {
    ...videos[index],
    ...updateData,
  };
  saveVideos(videos);
  return videos[index];
}

export function deleteVideo(id: string): boolean {
  const videos = getVideos();
  const filtered = videos.filter((v) => v.id !== id);
  if (filtered.length === videos.length) {
    console.warn(`Video with ID ${id} not found for deletion`);
    return false;
  }
  saveVideos(filtered);
  return true;
}

export function addCategory(name: string): Category {
  const categories = getCategories();
  const slug = encodeURIComponent(name.trim().toLowerCase().replace(/\s+/g, "-"));
  const newCat: Category = {
    id: "cat-" + Date.now(),
    name: name.trim(),
    slug,
  };
  const updatedCategories = [...categories, newCat];
  saveCategories(updatedCategories);
  return newCat;
}

export function deleteCategory(id: string): boolean {
  const categories = getCategories();
  const filtered = categories.filter((c) => c.id !== id);
  if (filtered.length === categories.length) return false;
  saveCategories(filtered);
  return true;
}

export function getSettings(): SiteSettings {
  if (globalThis.__darigate_settings) {
    return globalThis.__darigate_settings;
  }

  try {
    ensureDir();
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (process.env.ADMIN_PIN) {
        parsed.adminPin = process.env.ADMIN_PIN;
      }
      globalThis.__darigate_settings = parsed;
      return parsed;
    }
  } catch (err) {
    console.warn("Error reading settings from writable file:", err);
  }

  const initial = readInitialSeed("settings.json", DEFAULT_SETTINGS);
  if (process.env.ADMIN_PIN) {
    initial.adminPin = process.env.ADMIN_PIN;
  }
  globalThis.__darigate_settings = initial;
  return initial;
}

export function updateSettings(settings: Partial<SiteSettings>): SiteSettings {
  const current = getSettings();
  const updated = { ...current, ...settings };
  globalThis.__darigate_settings = updated;
  try {
    ensureDir();
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), "utf-8");
    if (!isServerless && WRITABLE_DIR !== SEED_DIR) {
      fs.writeFileSync(path.join(SEED_DIR, "settings.json"), JSON.stringify(updated, null, 2), "utf-8");
    }
  } catch (err) {
    console.warn("Writing settings to disk failed:", err);
  }
  return updated;
}
