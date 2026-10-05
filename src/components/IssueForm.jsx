import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NeuButton, NeuInput } from './NeuComponents';
import { NeuCard, NeuTextarea, Spinner, Chevron } from './NeuExtras';
import { submitIssue } from '../api';

const today = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const createInitial = () => ({
  incidentDate: today(),
  dishName: '',
  feedback: '',
  photoUrl: '',
  studentClass: '',
  parentName: '',
  phone: '',
  lineId: '',
  otherNotes: '',
});

const Section = ({ title, hint, children }) => (
  <NeuCard as="section" className="p-6 sm:p-8">
    <div className="mb-6 flex items-baseline justify-between gap-4">
      <h2 className="text-base font-bold text-neu-text">{title}</h2>
      {hint && <span className="text-xs tracking-wider text-slate-400">{hint}</span>}
    </div>
    <div className="space-y-6">{children}</div>
  </NeuCard>
);

const IssueForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(createInitial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [copied, setCopied] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.incidentDate || !form.dishName.trim() || !form.feedback.trim()) {
      setError('請填寫發生日期、菜名與問題描述。');
      return;
    }
    if (!form.parentName.trim() || (!form.phone.trim() && !form.lineId.trim())) {
      setError('請填寫家長姓名，並至少留下電話或 LINE ID 其中一項。');
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitIssue(form);
      setTrackingId(res.trackingId);
    } catch (err) {
      console.error(err);
      setError(err.message || '送出失敗，請稍後再試一次。');
    } finally {
      setSubmitting(false);
    }
  };

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(trackingId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* 剪貼簿不可用時忽略 */
    }
  };

  /* ---------- 送出成功 ---------- */
  if (trackingId) {
    return (
      <div className="min-h-screen bg-neu-base">
        <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-5 py-12 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full shadow-neu-flat">
            <svg className="h-8 w-8 text-emerald-700/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1 className="mt-8 text-2xl font-bold text-neu-text">已收到您的反應</h1>
          <p className="mt-3 text-sm text-slate-500">請保存以下追蹤碼，案件公開後可於佈告欄查詢處理進度。</p>

          <div className="mt-8 w-full rounded-2xl px-6 py-6 shadow-neu-pressed">
            <p className="text-xs tracking-[0.3em] text-slate-400">TRACKING ID</p>
            <p id="tracking-id" className="mt-2 font-mono text-3xl font-bold tracking-[0.15em] text-neu-text">
              {trackingId}
            </p>
          </div>
          <button
            id="btn-copy-id"
            type="button"
            onClick={copyId}
            className="mt-4 text-sm text-slate-400 transition-colors hover:text-neu-text"
          >
            {copied ? '已複製' : '複製追蹤碼'}
          </button>

          <div className="mt-10 grid w-full gap-5">
            <NeuButton id="btn-back-board" onClick={() => navigate('/')} className="w-full">
              返回佈告欄
            </NeuButton>
            <button
              type="button"
              onClick={() => {
                setForm(createInitial());
                setTrackingId('');
              }}
              className="text-sm text-slate-400 transition-colors hover:text-neu-text"
            >
              再填寫一筆
            </button>
          </div>
        </main>
      </div>
    );
  }

  /* ---------- 表單 ---------- */
  return (
    <div className="min-h-screen bg-neu-base">
      <main className="mx-auto max-w-2xl px-5 py-12 sm:py-16">
        <Link
          to="/"
          id="btn-back"
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-neu-text"
        >
          <Chevron direction="left" />
          返回佈告欄
        </Link>

        <header className="mt-6">
          <h1 className="text-2xl font-bold text-neu-text sm:text-3xl">反應午餐問題</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            「公開資訊」經委員審核後將顯示於佈告欄；「聯絡資訊」僅供委員聯繫使用，不會公開。
          </p>
        </header>

        <form onSubmit={handleSubmit} className="mt-10 space-y-10" noValidate>
          <Section title="公開資訊" hint="審核後顯示於佈告欄">
            <div className="grid gap-6 sm:grid-cols-2">
              <NeuInput
                id="incidentDate"
                label="發生日期 *"
                type="date"
                value={form.incidentDate}
                onChange={update('incidentDate')}
                max={today()}
                required
              />
              <NeuInput
                id="dishName"
                label="菜名 *"
                placeholder="例：糖醋排骨"
                value={form.dishName}
                onChange={update('dishName')}
                required
              />
            </div>
            <NeuTextarea
              id="feedback"
              label="問題描述 *"
              placeholder="請描述發生的狀況，例如口味、份量、衛生或溫度等問題"
              value={form.feedback}
              onChange={update('feedback')}
              required
            />
            <NeuInput
              id="photoUrl"
              label="照片連結（選填）"
              type="url"
              placeholder="https://"
              value={form.photoUrl}
              onChange={update('photoUrl')}
            />
          </Section>

          <Section title="聯絡資訊" hint="不公開 · 僅委員可見">
            <div className="grid gap-6 sm:grid-cols-2">
              <NeuInput
                id="studentClass"
                label="學生班級"
                placeholder="例：三年二班"
                value={form.studentClass}
                onChange={update('studentClass')}
              />
              <NeuInput
                id="parentName"
                label="家長姓名 *"
                placeholder="王小明家長"
                value={form.parentName}
                onChange={update('parentName')}
                autoComplete="name"
                required
              />
              <NeuInput
                id="phone"
                label="聯絡電話"
                type="tel"
                placeholder="09xx-xxx-xxx"
                value={form.phone}
                onChange={update('phone')}
                autoComplete="tel"
              />
              <NeuInput
                id="lineId"
                label="LINE ID"
                placeholder="電話與 LINE 擇一必填"
                value={form.lineId}
                onChange={update('lineId')}
              />
            </div>
            <NeuInput
              id="otherNotes"
              label="其他備註"
              placeholder="方便聯絡的時段等"
              value={form.otherNotes}
              onChange={update('otherNotes')}
            />
          </Section>

          {error && (
            <p role="alert" className="rounded-xl px-4 py-3 text-sm text-rose-700/80 shadow-neu-pressed">
              {error}
            </p>
          )}

          <NeuButton id="btn-submit" type="submit" disabled={submitting} className="w-full py-4">
            <span className="inline-flex items-center justify-center gap-3">
              {submitting && <Spinner />}
              {submitting ? '送出中…' : '送出反應'}
            </span>
          </NeuButton>
        </form>
      </main>
    </div>
  );
};

export default IssueForm;
