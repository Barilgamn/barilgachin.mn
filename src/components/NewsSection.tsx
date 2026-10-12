import React, { useEffect, useState } from 'react';
import { ArrowRight, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchPosts } from '../lib/content';
import type { PostRow } from '../types/db';

const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('mn-MN') : '';

/** Нүүр хуудсан дээрх сүүлийн мэдээ. Мэдээ байхгүй бол юу ч харуулахгүй. */
export const NewsSection: React.FC = () => {
  const [posts, setPosts] = useState<PostRow[]>([]);

  useEffect(() => {
    void fetchPosts(3).then(setPosts);
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base sm:text-lg font-bold font-display text-slate-900 flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-amber-600" />
          Мэдээ
        </h2>
        <Link
          to="/medee"
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1"
        >
          Бүгдийг үзэх
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {posts.map((p) => (
          <Link
            key={p.id}
            to={`/medee/${p.slug}`}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all"
          >
            {p.cover_url && (
              <div className="aspect-video overflow-hidden bg-slate-100">
                <img
                  src={p.cover_url}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="p-3.5 space-y-1">
              <div className="text-[11px] text-slate-400">{formatDate(p.published_at)}</div>
              <h3 className="text-sm font-semibold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2">
                {p.title}
              </h3>
              {p.excerpt && (
                <p className="text-xs text-slate-500 line-clamp-2 leading-snug">{p.excerpt}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
