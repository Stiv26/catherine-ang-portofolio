"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Upload, X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE_MB } from "@/lib/constants";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
  folder?: string;
  label?: string;
}

export function ImageUpload({
  value,
  onChange,
  bucket = "artworks",
  folder = "covers",
  label = "Cover Image",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  const upload = useCallback(
    async (file: File) => {
      setError("");

      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setError("Only JPEG, PNG, WebP, or GIF images are accepted.");
        return;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setError(`Image must be under ${MAX_FILE_SIZE_MB}MB.`);
        return;
      }

      setUploading(true);
      setProgress(20);

      try {
        let compressedFile = file;
        if (file.size > 500 * 1024) {
          const { default: imageCompression } = await import("browser-image-compression");
          compressedFile = await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 2400,
            useWebWorker: true,
            onProgress: (p) => setProgress(20 + p * 0.6),
          });
        }

        setProgress(80);
        const supabase = createClient();
        const ext = file.name.split(".").pop();
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { data, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(fileName, compressedFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
        onChange(urlData.publicUrl);
        setProgress(100);
      } catch (err) {
        setError("Upload failed. Please try again.");
        console.error(err);
      } finally {
        setUploading(false);
        setTimeout(() => setProgress(0), 500);
      }
    },
    [bucket, folder, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) upload(file);
    },
    [upload]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
  };

  const handleRemove = async () => {
    onChange("");
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-text-secondary font-body">{label}</label>
      )}

      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-border-soft aspect-video bg-bg-secondary">
          <Image
            src={value}
            alt="Uploaded image"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-text-primary/0 group-hover:bg-text-primary/40 transition-all flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemove}
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full p-2 shadow-lg"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <label
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          className={cn(
            "drop-zone flex flex-col items-center justify-center gap-3 p-8 cursor-pointer",
            "aspect-video rounded-xl transition-all",
            dragOver && "drag-over",
            uploading && "pointer-events-none"
          )}
        >
          <input type="file" accept={ACCEPTED_IMAGE_TYPES.join(",")} onChange={handleChange} className="sr-only" />
          {uploading ? (
            <div className="flex flex-col items-center gap-3 w-full">
              <div className="w-10 h-10 rounded-full border-2 border-accent-primary border-t-transparent animate-spin" />
              <div className="w-full max-w-[140px]">
                <div className="w-full bg-bg-tertiary rounded-full h-1.5">
                  <div
                    className="progress-bar"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <p className="text-xs text-text-tertiary">Uploading…</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-accent-soft flex items-center justify-center">
                {dragOver ? <Upload size={22} className="text-accent-deep" /> : <ImageIcon size={22} className="text-accent-primary" />}
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-text-secondary">
                  Drop image here or <span className="text-accent-deep underline">browse</span>
                </p>
                <p className="text-xs text-text-tertiary mt-0.5">
                  JPEG, PNG, WebP up to {MAX_FILE_SIZE_MB}MB
                </p>
              </div>
            </>
          )}
        </label>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface MultiImageUploadProps {
  values: string[];
  onChange: (urls: string[]) => void;
  bucket?: string;
  folder?: string;
  label?: string;
}

export function MultiImageUpload({
  values,
  onChange,
  bucket = "artworks",
  folder = "gallery",
  label = "Additional Images",
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const uploadFiles = async (files: FileList) => {
    setUploading(true);
    const supabase = createClient();
    const newUrls: string[] = [];

    for (const file of Array.from(files)) {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) continue;
      const ext = file.name.split(".").pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { upsert: true });

      if (!error && data) {
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
        newUrls.push(urlData.publicUrl);
      }
    }

    onChange([...values, ...newUrls]);
    setUploading(false);
  };

  const remove = (url: string) => onChange(values.filter((v) => v !== url));

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-medium text-text-secondary font-body">{label}</label>}

      <div className="grid grid-cols-3 gap-2">
        {values.map((url) => (
          <div key={url} className="relative group rounded-lg overflow-hidden border border-border-soft aspect-square bg-bg-secondary">
            <Image src={url} alt="" fill className="object-cover" sizes="150px" />
            <button
              type="button"
              onClick={() => remove(url)}
              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full p-1"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <label className="border-2 border-dashed border-border-soft rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-accent-primary hover:bg-accent-soft/20 transition-all">
          <input
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            multiple
            onChange={(e) => e.target.files && uploadFiles(e.target.files)}
            className="sr-only"
          />
          {uploading ? (
            <div className="w-5 h-5 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Upload size={18} className="text-accent-primary mb-1" />
              <span className="text-[10px] text-text-tertiary">Add more</span>
            </>
          )}
        </label>
      </div>
    </div>
  );
}
