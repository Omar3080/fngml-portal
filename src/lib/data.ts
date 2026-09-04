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
];

const DEFAULT_VIDEOS: Video[] = [];

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
  if (globalThis.__darigate_categories !== undefined) {
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
  if (globalThis.__darigate_videos !== undefined) {
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
