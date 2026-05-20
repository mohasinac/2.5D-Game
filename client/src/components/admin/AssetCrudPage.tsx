// [ADMIN-COMPONENT] AssetCrudPage — reusable CRUD UI for any asset collection.
// Used by all 6 asset pages (arena themes, obstacles, turrets, water bodies, portals, sounds).

import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import toast from "react-hot-toast";

interface AssetCrudPageProps {
  collectionName: string;
  title: string;
  icon: string;
  description: string;
  acceptTypes?: string;
  isAudio?: boolean;
  tags?: string[];
  tagLabel?: string;
}

interface Asset {
  id: string;
  name: string;
  url: string;
  storagePath: string;
  tag?: string;
  createdAt?: any;
}

export function AssetCrudPage({
  collectionName,
  title,
  icon,
  description,
  acceptTypes = "image/*",
  isAudio = false,
  tags = [],
  tagLabel = "Tag",
}: AssetCrudPageProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState("all");
  const [form, setForm] = useState({ name: "", tag: tags[0] ?? "", file: null as File | null });

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, collectionName));
      setAssets(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Asset)));
    } catch { toast.error("Failed to load assets"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAssets(); }, [collectionName]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((f) => ({ ...f, file, name: f.name || file.name.replace(/\.[^.]+$/, "") }));
  };

  const handleUpload = async () => {
    if (!form.file || !form.name.trim()) { toast.error("Name and file are required"); return; }
    setUploading(true);
    try {
      const ext = form.file.name.split(".").pop();
      const storagePath = `assets/${collectionName}/${Date.now()}_${form.file.name}`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, form.file);
      const url = await getDownloadURL(storageRef);

      await addDoc(collection(db, collectionName), {
        name: form.name.trim(),
        url,
        storagePath,
        tag: form.tag || null,
        createdAt: serverTimestamp(),
      });

      toast.success(`Uploaded ${form.name}`);
      setForm({ name: "", tag: tags[0] ?? "", file: null });
      fetchAssets();
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (asset: Asset) => {
    setDeletingId(asset.id);
    try {
      if (asset.storagePath) {
        await deleteObject(ref(storage, asset.storagePath)).catch(() => {});
      }
      await deleteDoc(doc(db, collectionName, asset.id));
      setAssets((prev) => prev.filter((a) => a.id !== asset.id));
      toast.success(`Deleted ${asset.name}`);
    } catch { toast.error("Delete failed"); }
    finally { setDeletingId(null); }
  };

  const filtered = selectedTag === "all" ? assets : assets.filter((a) => a.tag === selectedTag);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <span>{icon}</span> {title}
        </h1>
        <p className="text-gray-500 text-sm mt-1">{description}</p>
      </div>

      {/* Upload form */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-300 mb-4">Upload New Asset</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Asset name"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {tags.length > 0 && (
            <div>
              <label className="block text-xs text-gray-400 mb-1">{tagLabel}</label>
              <select
                value={form.tag}
                onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              >
                {tags.map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs text-gray-400 mb-1">File *</label>
            <label className="cursor-pointer flex items-center gap-2 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-300 hover:border-gray-500 transition-colors">
              <span className="truncate">{form.file ? form.file.name : "Choose file..."}</span>
              <input type="file" accept={acceptTypes} onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        </div>

        <button
          onClick={handleUpload}
          disabled={uploading || !form.file || !form.name.trim()}
          className="mt-3 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
        >
          {uploading ? "Uploading..." : "Upload Asset"}
        </button>
      </div>

      {/* Tag filter */}
      {tags.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setSelectedTag("all")}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
              selectedTag === "all" ? "bg-white text-gray-900 border-white" : "border-gray-700 text-gray-400 hover:border-gray-500"
            }`}
          >
            All ({assets.length})
          </button>
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTag(t)}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors capitalize ${
                selectedTag === t ? "bg-white text-gray-900 border-white" : "border-gray-700 text-gray-400 hover:border-gray-500"
              }`}
            >
              {t} ({assets.filter((a) => a.tag === t).length})
            </button>
          ))}
        </div>
      )}

      {/* Asset grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="bg-gray-800 rounded-xl h-40 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <div className="text-3xl mb-2">{icon}</div>
          <p>No assets yet. Upload your first {title.toLowerCase()} asset.</p>
        </div>
      ) : isAudio ? (
        // Audio list view
        <div className="space-y-3">
          {filtered.map((asset) => (
            <div key={asset.id} className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center gap-4">
              <div className="text-2xl">🎵</div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{asset.name}</p>
                {asset.tag && <p className="text-gray-500 text-xs capitalize">{asset.tag}</p>}
              </div>
              <audio controls src={asset.url} className="h-8" />
              <button
                onClick={() => handleDelete(asset)}
                disabled={deletingId === asset.id}
                className="text-red-400 hover:text-red-300 text-xs disabled:opacity-50"
              >
                {deletingId === asset.id ? "..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        // Image grid view
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filtered.map((asset) => (
            <div key={asset.id} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden group hover:border-gray-600 transition-colors">
              <div className="aspect-square bg-gray-900 relative">
                <img
                  src={asset.url}
                  alt={asset.name}
                  className="w-full h-full object-contain p-2"
                  loading="lazy"
                />
                <button
                  onClick={() => handleDelete(asset)}
                  disabled={deletingId === asset.id}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-600/90 hover:bg-red-600 text-white rounded text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                >
                  {deletingId === asset.id ? "..." : "×"}
                </button>
              </div>
              <div className="p-2.5">
                <p className="text-white text-xs font-medium truncate">{asset.name}</p>
                {asset.tag && <p className="text-gray-500 text-xs capitalize mt-0.5">{asset.tag}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
