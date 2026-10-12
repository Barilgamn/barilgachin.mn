import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { fetchPostBySlug, fetchPosts } from '../lib/content';
import { parsePostBody, toParagraphs } from '../lib/postBlocks';
import { PostProductAd } from './PostProductAd';
import type { PostRow } from '../types/db';

const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('mn-MN') : '';

const BackLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <Link
    to={to}
    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900"
  >
    <ArrowLeft className="w-3.5 h-3.5" />
    {children}
  </Link>
);

export const NewsListPage: React.FC = () => {
  const [posts, setPosts] = useState<PostRow[] | null>(null);

  useEffect(() => {
    void fetchPosts().then(setPosts);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="mx-auto max-w-4xl">
        <BackLink to="/">Дэлгүүр рүү буцах</BackLink>
        <h1 className="mt-4 text-2xl font-bold font-display text-slate-900">Мэдээ</h1>

        {posts === null ? (
          <p className="mt-6 text-sm text-slate-400">Ачаалж байна…</p>
        ) : posts.length === 0 ? (
          <p className="mt-6 text-sm text-slate-500">Одоогоор мэдээ алга.</p>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
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
                <div className="p-4 space-y-1">
                  <div className="text-[11px] text-slate-400">{formatDate(p.published_at)}</div>
                  <h2 className="font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">
                    {p.title}
                  </h2>
                  {p.excerpt && (
                    <p className="text-sm text-slate-500 leading-snug line-clamp-3">{p.excerpt}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const NewsDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<PostRow | null | undefined>(undefined);

  useEffect(() => {
    if (!slug) return;
    void fetchPostBySlug(slug).then(setPost);
  }, [slug]);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <article className="mx-auto max-w-2xl">
        <BackLink to="/medee">Бүх мэдээ</BackLink>

        {post === undefined ? (
          <p className="mt-6 text-sm text-slate-400">Ачаалж байна…</p>
        ) : post === null ? (
          <p className="mt-6 text-sm text-slate-500">Мэдээ олдсонгүй.</p>
        ) : (
          <>
            <h1 className="mt-4 text-2xl sm:text-3xl font-bold font-display text-slate-900 leading-tight">
              {post.title}
            </h1>
            <div className="mt-2 text-xs text-slate-400">
              {formatDate(post.published_at)}
              {post.author_name && <> · {post.author_name}</>}
            </div>

            {post.cover_url && (
              <img
                src={post.cover_url}
                alt=""
                className="mt-5 w-full rounded-2xl border border-slate-200 object-cover"
              />
            )}

            {post.excerpt && (
              <p className="mt-5 text-base text-slate-600 leading-relaxed font-medium">
                {post.excerpt}
              </p>
            )}

            {/* Текст ба барааны блокууд. */}
            <div className="mt-4 space-y-3 text-[15px] text-slate-700 leading-relaxed">
              {parsePostBody(post.body ?? '').map((block, bi) =>
                block.kind === 'products' ? (
                  <PostProductAd key={bi} block={block} />
                ) : (
                  toParagraphs(block.value).map((para, pi) => (
                    <p key={`${bi}-${pi}`} className="whitespace-pre-line">
                      {para}
                    </p>
                  ))
                ),
              )}
            </div>
          </>
        )}
      </article>
    </div>
  );
};
