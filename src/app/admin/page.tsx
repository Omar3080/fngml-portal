"use client";

import { useState, useEffect } from "react";
import { Video, Category } from "@/types";
import {
  PlusCircle,
  Film,
  Trash2,
  ExternalLink,
  Shield,
  Eye,
  FolderPlus,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  LogOut,
  Sparkles,
} from "lucide-react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [loginError, setLoginError] = useState("");

  // Dashboard state
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<{ totalVideos: number; totalCategories: number; totalViews: number }>({
    totalVideos: 0,
    totalCategories: 0,
    totalViews: 0,
  });

  // New video form state
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("10:00");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");

  // New category form state
  const [newCatName, setNewCatName] = useState("");

  // Feedback states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"add" | "videos" | "categories">("add");

  // Check saved session
  useEffect(() => {
    const savedAuth = localStorage.getItem("darigate_admin_auth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
      fetchInitialData();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin: pinInput }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setIsAuthenticated(true);
          localStorage.setItem("darigate_admin_auth", "true");
          fetchInitialData();
        } else {
          setLoginError(data.message || "كلمة المرور غير صحيحة");
        }
      })
      .catch(() => setLoginError("تعذر الاتصال بالخادم"));
  };

  const handleLogout = () => {
    localStorage.removeItem("darigate_admin_auth");
    setIsAuthenticated(false);
    setPinInput("");
  };

  const fetchInitialData = async () => {
    try {
      const [videosRes, catsRes, statsRes] = await Promise.all([
        fetch("/api/videos?limit=100"),
        fetch("/api/categories"),
        fetch("/api/admin/stats"),
      ]);

      const videosData = await videosRes.json();
      const catsData = await catsRes.json();
      const statsData = await statsRes.json();

      if (videosData.success) setVideos(videosData.videos);
      if (catsData.success) {
        setCategories(catsData.categories);
        if (catsData.categories.length > 0 && !category) {
          const defaultCat = catsData.categories.find((c: Category) => c.name !== "الكل") || catsData.categories[0];
          setCategory(defaultCat.name);
        }
      }
      if (statsData.success) setStats(statsData.stats);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    }
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!title.trim() || !videoUrl.trim() || !thumbnailUrl.trim()) {
      setMessage({ type: "error", text: "يرجى كتابة عنوان الفيديو، ورابط الفيديو، ورابط الصورة المصغرة." });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          videoUrl,
          thumbnailUrl,
          category: category || (categories[1] ? categories[1].name : "منوعات وجديد"),
          duration,
          tags: tags ? tags.split(",").map((t) => t.trim()) : [],
          description,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "تمت إضافة الفيديو بنجاح وهو متاح الآن على الموقع!" });
        // Reset form
        setTitle("");
        setVideoUrl("");
        setThumbnailUrl("");
        setTags("");
        setDescription("");
        // Refresh list
        fetchInitialData();
      } else {
        setMessage({ type: "error", text: data.message || "حدث خطأ أثناء الإضافة" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "فشل الاتصال بالخادم" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذا الفيديو؟")) return;

    try {
      const res = await fetch(`/api/videos/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setVideos((prev) => prev.filter((v) => v.id !== id));
        fetchInitialData();
      } else {
        alert(data.message || "تعذر الحذف");
      }
    } catch (err) {
      alert("فشل الاتصال بالخادم");
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCatName.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setNewCatName("");
        fetchInitialData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا القسم؟")) return;

    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchInitialData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Login View
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-[#16161b] border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center space-y-2 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/10 border border-rose-600/20 text-rose-500 flex items-center justify-center mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-black text-white">تسجيل الدخول للوحة الإدارة</h1>
            <p className="text-xs text-zinc-400">
              أدخل كلمة المرور الخاصة بالمدير للتحكم في الموقع وإضافة الفيديوهات
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                كلمة المرور
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="أدخل كلمة المرور..."
                className="w-full bg-zinc-900 border border-zinc-700 text-sm text-white rounded-xl px-4 py-3 focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            {loginError && (
              <div className="flex items-center gap-2 text-rose-400 text-xs bg-rose-950/40 border border-rose-900/50 p-3 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/30 transition-all"
            >
              دخول إلى لوحة التحكم
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center shadow-lg shadow-rose-600/30">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">لوحة تحكم الموقع</h1>
            <p className="text-xs text-zinc-400">إدارة الفيديوهات، الأقسام، والإحصائيات</p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-xl border border-zinc-800 transition-colors"
          >
            <LogOut className="w-4 h-4 text-zinc-500" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#16161b] border border-zinc-800/80 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-zinc-400 font-medium">إجمالي الفيديوهات</span>
            <h3 className="text-2xl font-black text-white">{stats.totalVideos}</h3>
          </div>
        </div>

        <div className="bg-[#16161b] border border-zinc-800/80 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-zinc-400 font-medium">إجمالي المشاهدات</span>
            <h3 className="text-2xl font-black text-white">
              {stats.totalViews.toLocaleString("ar-EG")}
            </h3>
          </div>
        </div>

        <div className="bg-[#16161b] border border-zinc-800/80 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <FolderPlus className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-zinc-400 font-medium">عدد الأقسام</span>
            <h3 className="text-2xl font-black text-white">{categories.filter(c => c.slug !== "all").length}</h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("add")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "add"
              ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>إضافة فيديو جديد</span>
        </button>

        <button
          onClick={() => setActiveTab("videos")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "videos"
              ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
          }`}
        >
          <Film className="w-4 h-4" />
          <span>إدارة الفيديوهات ({videos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("categories")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "categories"
              ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
          }`}
        >
          <FolderPlus className="w-4 h-4" />
          <span>إدارة الأقسام</span>
        </button>
      </div>

      {/* Feedback Message */}
      {message && (
        <div
          className={`flex items-center gap-2 p-4 rounded-xl text-xs font-semibold ${
            message.type === "success"
              ? "bg-emerald-950/60 border border-emerald-800 text-emerald-300"
              : "bg-rose-950/60 border border-rose-800 text-rose-300"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Tab 1: Add Video Form */}
      {activeTab === "add" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form */}
          <div className="lg:col-span-2 bg-[#16161b] border border-zinc-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-400" />
                <span>إضافة فيديو سريع للموقع</span>
              </h2>
              <p className="text-xs text-zinc-400">
                ضع اسم الفيديو، رابط الفيديو، ورابط الصورة المصغرة ليظهر فوراً في الموقع.
              </p>
            </div>

            <form onSubmit={handleAddVideo} className="space-y-5">
              
              {/* Video Title */}
              <div>
                <label className="block text-xs font-bold text-zinc-200 mb-1.5">
                  اسم / عنوان الفيديو <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: مقطع حصري للفنانة في كواليس الحفل بجودة عالية"
                  className="w-full bg-zinc-900 border border-zinc-700 text-sm text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-xs font-bold text-zinc-200 mb-1.5">
                  رابط الفيديو (Direct URL أو Embed Code) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="رابط مباشر مثل https://...mp4 أو كود تضمين iframe"
                  className="w-full bg-zinc-900 border border-zinc-700 text-sm text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-rose-500 font-mono text-xs"
                  required
                />
                <span className="text-[11px] text-zinc-500 mt-1 block">
                  يدعم الروابط المباشرة (mp4) وكذلك روابط التضمين من أي سيرفر خارجي.
                </span>
              </div>

              {/* Thumbnail URL */}
              <div>
                <label className="block text-xs font-bold text-zinc-200 mb-1.5">
                  رابط الصورة المصغرة (Thumbnail URL) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://images.example.com/photo.jpg"
                  className="w-full bg-zinc-900 border border-zinc-700 text-sm text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-rose-500 font-mono text-xs"
                  required
                />
              </div>

              {/* Category & Duration Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-200 mb-1.5">
                    القسم / التصنيف
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 text-sm text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-rose-500"
                  >
                    {categories
                      .filter((c) => c.slug !== "all" && c.name !== "الكل")
                      .map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-200 mb-1.5">
                    مدة الفيديو (اختياري)
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="مثال: 12:45"
                    className="w-full bg-zinc-900 border border-zinc-700 text-sm text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-zinc-200 mb-1.5">
                  الكلمات الدلالية / الوسوم (مفصولة بفواصل)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="حصري, فنانات, كواليس"
                  className="w-full bg-zinc-900 border border-zinc-700 text-sm text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-zinc-200 mb-1.5">
                  وصف مختصر (اختياري)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="اكتب وصفاً أو تفاصيل إضافية عن الفيديو..."
                  className="w-full bg-zinc-900 border border-zinc-700 text-sm text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-black rounded-xl shadow-lg shadow-rose-600/30 transition-all disabled:opacity-50"
              >
                {isSubmitting ? "جاري الحفظ والإضافة..." : "حفظ ونشر الفيديو الآن"}
              </button>
            </form>
          </div>

          {/* Live Preview Box */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              معاينة حية لشكل البطاقة
            </h3>

            <div className="bg-[#18181c] border border-zinc-800 rounded-xl overflow-hidden shadow-md">
              <div className="relative aspect-video w-full bg-zinc-900 flex items-center justify-center">
                {thumbnailUrl ? (
                  <img
                    src={thumbnailUrl}
                    alt="معاينة"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-zinc-600 text-xs">
                    <Film className="w-10 h-10 mb-1" />
                    <span>ضع رابط الصورة المصغرة للمعاينة</span>
                  </div>
                )}
                <span className="absolute bottom-2 left-2 bg-black/80 text-white text-[11px] font-semibold px-2 py-0.5 rounded">
                  {duration || "00:00"}
                </span>
                <span className="absolute top-2 right-2 bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded">
                  HD
                </span>
              </div>

              <div className="p-3 space-y-2">
                <p className="text-sm font-semibold text-white line-clamp-2">
                  {title || "عنوان الفيديو يظهر هنا..."}
                </p>
                <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-zinc-800">
                  <span className="text-rose-400 font-medium">
                    {category || "القسم"}
                  </span>
                  <span>حديثاً</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Videos Management Table */}
      {activeTab === "videos" && (
        <div className="bg-[#16161b] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">
              قائمة الفيديوهات المرفوعة ({videos.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs text-zinc-300">
              <thead className="bg-zinc-900/80 text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="p-3 sm:p-4">المعاينة</th>
                  <th className="p-3 sm:p-4">العنوان</th>
                  <th className="p-3 sm:p-4">القسم</th>
                  <th className="p-3 sm:p-4">المشاهدات</th>
                  <th className="p-3 sm:p-4 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {videos.map((v) => (
                  <tr key={v.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-3 sm:p-4 w-20">
                      <div className="w-16 aspect-video bg-zinc-800 rounded-lg overflow-hidden relative">
                        <img
                          src={v.thumbnailUrl}
                          alt={v.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-3 sm:p-4 max-w-xs font-semibold text-white">
                      <span className="line-clamp-1">{v.title}</span>
                    </td>
                    <td className="p-3 sm:p-4">
                      <span className="text-rose-400 bg-rose-950/30 px-2 py-0.5 rounded text-[11px]">
                        {v.category}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{v.views}</span>
                      </span>
                    </td>
                    <td className="p-3 sm:p-4">
                      <div className="flex items-center justify-center gap-2">
                        <a
                          href={`/watch/${v.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                          title="مشاهدة الفيديو"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDeleteVideo(v.id)}
                          className="p-1.5 text-rose-400 hover:text-white bg-rose-950/40 hover:bg-rose-600 rounded-lg transition-colors"
                          title="حذف الفيديو"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Categories Management */}
      {activeTab === "categories" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Add Category Form */}
          <div className="bg-[#16161b] border border-zinc-800/80 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-white text-sm">إضافة قسم جديد</h3>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">اسم القسم</label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="مثال: فنانات الخليج"
                  className="w-full bg-zinc-900 border border-zinc-700 text-sm text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-rose-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-colors shadow"
              >
                إضافة القسم
              </button>
            </form>
          </div>

          {/* Categories List */}
          <div className="bg-[#16161b] border border-zinc-800/80 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-white text-sm">الأقسام الحالية</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {categories
                .filter((c) => c.slug !== "all" && c.name !== "الكل")
                .map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-3 bg-zinc-900/60 rounded-xl border border-zinc-800"
                  >
                    <span className="text-xs font-semibold text-zinc-200">{cat.name}</span>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-1.5 text-zinc-400 hover:text-rose-400 transition-colors"
                      title="حذف القسم"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
