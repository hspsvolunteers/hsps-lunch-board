import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NeuButton } from './NeuComponents';
import { NeuCard, StatusTag, Chevron, formatDate } from './NeuExtras';
import { fetchPublicIssues } from '../api';

const IssueCard = ({ issue }) => {
  const [open, setOpen] = useState(false);
  const replied = issue.status === '已回覆' && issue.reply;

  return (
    <NeuCard as="article" className="p-6">
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-mono text-xs tracking-widest text-slate-400">{issue.trackingId}</p>
          <h3 className="mt-1 truncate text-lg font-bold text-neu-text">{issue.dishName || '未填寫菜名'}</h3>
          <p className="mt-0.5 text-sm text-slate-400">{formatDate(issue.incidentDate)}</p>
        </div>
        <StatusTag status={issue.status} />
      </header>

      <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-neu-text/90">{issue.feedback}</p>

      {replied && (
        <div className="mt-5">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium text-neu-text shadow-neu-flat transition-shadow duration-200 hover:shadow-neu-hover active:shadow-neu-pressed"
          >
            <span>{open ? '收合校方回覆' : '查看校方回覆'}</span>
            <Chevron direction={open ? 'up' : 'down'} className="h-4 w-4 transition-transform duration-300" />
          </button>

          <div
            className={`grid transition-all duration-300 ease-out ${
              open ? 'mt-4 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <div className="rounded-xl p-4 shadow-neu-pressed">
                <p className="mb-2 text-xs font-semibold tracking-wider text-slate-400">校方回覆</p>
                <p className="whitespace-pre-line text-sm leading-relaxed text-neu-text">{issue.reply}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </NeuCard>
  );
};

const SkeletonCard = () => (
  <div className="animate-pulse rounded-2xl p-6 shadow-neu-flat">
    <div className="h-3 w-20 rounded bg-neu-dark/30" />
    <div className="mt-3 h-5 w-40 rounded bg-neu-dark/30" />
    <div className="mt-5 h-3 w-full rounded bg-neu-dark/20" />
    <div className="mt-2 h-3 w-2/3 rounded bg-neu-dark/20" />
  </div>
);

const NoticeBoard = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setIssues(await fetchPublicIssues());
    } catch (err) {
      console.error(err);
      setError('目前無法讀取佈告欄資料，請稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-neu-base">
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:py-14">
        {/* Hero 橫幅 */}
        <div className="mb-10 overflow-hidden rounded-3xl bg-neu-base p-2 sm:p-3 shadow-neu-flat">
          <div className="overflow-hidden rounded-2xl">
            <img
              src="/hero.jpeg"
              alt="胡適國小 營養午餐問題反應站"
              className="w-full h-auto aspect-[1280/627] object-cover block transition-transform duration-500 hover:scale-[1.01]"
            />
          </div>
        </div>

        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/icon.png"
              alt="胡適國小"
              className="h-14 w-14 shrink-0 rounded-2xl bg-neu-base p-1.5 shadow-neu-flat object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-neu-text sm:text-3xl">營養午餐問題反應站</h1>
              <p className="mt-1 text-sm text-slate-500">公開佈告欄 · 案件處理進度一覽</p>
            </div>
          </div>
          <NeuButton id="btn-report" onClick={() => navigate('/submit')} className="self-start sm:self-auto">
            我要反應問題
          </NeuButton>
        </header>

        <section className="mt-12" aria-label="案件列表">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-wider text-slate-500">
              公開案件{!loading && !error ? `（${issues.length}）` : ''}
            </h2>
            <button
              id="btn-refresh"
              type="button"
              onClick={load}
              disabled={loading}
              className="text-sm text-slate-400 transition-colors hover:text-neu-text disabled:opacity-50"
            >
              重新整理
            </button>
          </div>

          {loading && (
            <div className="space-y-8">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl p-8 text-center shadow-neu-pressed">
              <p className="text-sm text-slate-500">{error}</p>
              <NeuButton onClick={load} className="mt-6">
                再試一次
              </NeuButton>
            </div>
          )}

          {!loading && !error && issues.length === 0 && (
            <div className="rounded-2xl p-10 text-center shadow-neu-pressed">
              <p className="text-sm text-slate-500">目前尚無公開案件。</p>
            </div>
          )}

          {!loading && !error && issues.length > 0 && (
            <div className="space-y-8">
              {issues.map((issue) => (
                <IssueCard key={issue.trackingId} issue={issue} />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="pb-10 text-center">
        <Link to="/login" id="link-admin" className="text-xs tracking-wider text-slate-400 transition-colors hover:text-neu-text">
          委員登入
        </Link>
      </footer>
    </div>
  );
};

export default NoticeBoard;
