import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NeuButton, NeuInput } from './NeuComponents';
import {
  NeuCard,
  NeuSelect,
  NeuSwitch,
  NeuTextarea,
  StatusTag,
  Spinner,
  Chevron,
  formatDate,
} from './NeuExtras';
import { useAuth } from '../context/AuthContext';
import { fetchAdminIssues, updateIssue, toBool, STATUS_OPTIONS } from '../api';

const FILTERS = ['全部', ...STATUS_OPTIONS];

/* ------------------------------------------------------------------ */
/* 小型展示元件                                                          */
/* ------------------------------------------------------------------ */

const Field = ({ label, children }) => (
  <div className="min-w-0">
    <dt className="text-xs tracking-wider text-slate-400">{label}</dt>
    <dd className="mt-1 break-words text-sm text-neu-text">{children || <span className="text-slate-300">—</span>}</dd>
  </div>
);

const StatTile = ({ label, value }) => (
  <div className="rounded-2xl px-5 py-4 shadow-neu-pressed">
    <p className="text-xs tracking-wider text-slate-400">{label}</p>
    <p className="mt-1 text-2xl font-bold text-neu-text">{value}</p>
  </div>
);

/** 分段篩選：選中者凹陷、其餘凸起 */
const SegmentedFilter = ({ value, onChange, counts }) => (
  <div className="flex flex-wrap gap-3" role="tablist" aria-label="狀態篩選">
    {FILTERS.map((f) => {
      const active = value === f;
      return (
        <button
          key={f}
          id={`filter-${f}`}
          type="button"
          role="tab"
          aria-selected={active}
          onClick={() => onChange(f)}
          className={`rounded-xl px-4 py-2 text-sm transition-shadow duration-200 ${
            active
              ? 'font-semibold text-neu-text shadow-neu-pressed'
              : 'text-slate-500 shadow-neu-flat hover:shadow-neu-hover'
          }`}
        >
          {f}
          <span className="ml-2 text-xs text-slate-400">{counts[f] ?? 0}</span>
        </button>
      );
    })}
  </div>
);

/* ------------------------------------------------------------------ */
/* 編輯區                                                               */
/* ------------------------------------------------------------------ */

const IssueEditor = ({ issue, password, onSaved, onAuthError }) => {
  const initial = useMemo(
    () => ({
      status: issue.status || '待處理',
      reply: issue.reply || '',
      isPublic: toBool(issue.isPublic),
    }),
    [issue]
  );
  const [draft, setDraft] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const dirty =
    draft.status !== initial.status || draft.reply !== initial.reply || draft.isPublic !== initial.isPublic;

  const handleSave = async () => {
    if (draft.status === '已回覆' && !draft.reply.trim()) {
      setMessage({ type: 'error', text: '狀態為「已回覆」時，請填寫回覆內容。' });
      return;
    }
    setSaving(true);
    setMessage({ type: '', text: '' });
    const payload = { trackingId: issue.trackingId, ...draft };
    try {
      await updateIssue(password, payload);
      onSaved(payload);
      setMessage({ type: 'success', text: '已儲存' });
    } catch (err) {
      console.error(err);
      if (err.response && /密碼|權限|unauthor/i.test(err.message)) {
        onAuthError();
        return;
      }
      setMessage({ type: 'error', text: err.message || '儲存失敗，請稍後再試。' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <NeuSelect
        id={`status-${issue.trackingId}`}
        label="處理狀態"
        options={STATUS_OPTIONS}
        value={draft.status}
        onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}
      />
      <NeuTextarea
        id={`reply-${issue.trackingId}`}
        label="回覆內容"
        rows={6}
        placeholder="此內容將於公開後顯示在前台佈告欄"
        value={draft.reply}
        onChange={(e) => setDraft((d) => ({ ...d, reply: e.target.value }))}
      />
      <div className="rounded-xl px-4 py-4 shadow-neu-pressed">
        <NeuSwitch
          id={`public-${issue.trackingId}`}
          label="公開至前台"
          description="僅公開日期、菜名、描述與回覆，不含聯絡資訊"
          checked={draft.isPublic}
          onChange={(v) => setDraft((d) => ({ ...d, isPublic: v }))}
        />
      </div>

      <div className="flex items-center justify-between gap-4 pt-2">
        <p
          className={`text-sm ${message.type === 'error' ? 'text-rose-700/80' : 'text-emerald-700/80'}`}
          role="status"
        >
          {message.text || (dirty ? <span className="text-slate-400">尚未儲存的變更</span> : '')}
        </p>
        <NeuButton
          id={`save-${issue.trackingId}`}
          onClick={handleSave}
          disabled={saving || !dirty}
          className="min-w-[7.5rem]"
        >
          <span className="inline-flex items-center justify-center gap-2">
            {saving && <Spinner />}
            {saving ? '儲存中…' : '儲存'}
          </span>
        </NeuButton>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 手風琴項目                                                           */
/* ------------------------------------------------------------------ */

const IssueAccordionItem = ({ issue, open, onToggle, password, onSaved, onAuthError }) => {
  const isPublic = toBool(issue.isPublic);
  const panelId = `panel-${issue.trackingId}`;

  return (
    <NeuCard as="article" className="overflow-hidden">
      <button
        type="button"
        id={`toggle-${issue.trackingId}`}
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center gap-4 px-6 py-5 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="font-mono text-xs tracking-widest text-slate-400">{issue.trackingId}</span>
            <span className="text-xs text-slate-400">{formatDate(issue.incidentDate)}</span>
            <span className={`text-xs ${isPublic ? 'text-neu-text' : 'text-slate-400'}`}>
              {isPublic ? '已公開' : '未公開'}
            </span>
          </div>
          <h3 className="mt-1 truncate text-base font-bold text-neu-text">{issue.dishName || '未填寫菜名'}</h3>
          <p className="mt-0.5 truncate text-sm text-slate-500">
            {[issue.studentClass, issue.parentName].filter(Boolean).join(' · ') || '未留姓名'}
          </p>
        </div>
        <StatusTag status={issue.status} />
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition-shadow duration-200 ${
            open ? 'shadow-neu-pressed' : 'shadow-neu-flat'
          }`}
        >
          <Chevron className={`h-4 w-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>

      <div
        id={panelId}
        className={`grid transition-all duration-300 ease-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          {open && (
            <div className="grid gap-8 border-t border-white/40 px-6 pb-8 pt-6 lg:grid-cols-2">
              {/* 左：案件內容 + 個資 */}
              <div className="space-y-6">
                <section>
                  <h4 className="mb-3 text-sm font-semibold text-neu-text">案件內容</h4>
                  <div className="rounded-xl p-4 shadow-neu-pressed">
                    <p className="whitespace-pre-line text-sm leading-relaxed text-neu-text">{issue.feedback}</p>
                    {issue.photoUrl && (
                      <a
                        href={issue.photoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-block text-sm text-slate-500 underline decoration-neu-dark underline-offset-4 hover:text-neu-text"
                      >
                        查看照片連結
                      </a>
                    )}
                  </div>
                </section>

                <section>
                  <div className="mb-3 flex items-baseline justify-between">
                    <h4 className="text-sm font-semibold text-neu-text">聯絡資訊</h4>
                    <span className="text-xs tracking-wider text-slate-400">不公開</span>
                  </div>
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-xl p-4 shadow-neu-pressed">
                    <Field label="學生班級">{issue.studentClass}</Field>
                    <Field label="家長姓名">{issue.parentName}</Field>
                    <Field label="聯絡電話">
                      {issue.phone && (
                        <a href={`tel:${issue.phone}`} className="hover:underline">
                          {issue.phone}
                        </a>
                      )}
                    </Field>
                    <Field label="LINE ID">{issue.lineId}</Field>
                    <div className="col-span-2">
                      <Field label="其他備註">{issue.otherNotes}</Field>
                    </div>
                  </dl>
                </section>
              </div>

              {/* 右：編輯區 */}
              <section>
                <h4 className="mb-3 text-sm font-semibold text-neu-text">處理與回覆</h4>
                <IssueEditor
                  key={issue.trackingId}
                  issue={issue}
                  password={password}
                  onSaved={onSaved}
                  onAuthError={onAuthError}
                />
              </section>
            </div>
          )}
        </div>
      </div>
    </NeuCard>
  );
};

/* ------------------------------------------------------------------ */
/* 主頁面                                                               */
/* ------------------------------------------------------------------ */

const AdminDashboard = () => {
  const { password, logout } = useAuth();
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('全部');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState(null);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login', { replace: true });
  }, [logout, navigate]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setIssues(await fetchAdminIssues(password));
    } catch (err) {
      console.error(err);
      // 伺服器明確回應失敗（多半是密碼失效）→ 登出
      if (err.response) {
        handleLogout();
        return;
      }
      setError(err.message || '讀取失敗，請稍後再試。');
    } finally {
      setLoading(false);
    }
  }, [password, handleLogout]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSaved = (updated) => {
    setIssues((list) => list.map((it) => (it.trackingId === updated.trackingId ? { ...it, ...updated } : it)));
  };

  const counts = useMemo(() => {
    const c = { 全部: issues.length };
    STATUS_OPTIONS.forEach((s) => {
      c[s] = issues.filter((i) => (i.status || '待處理') === s).length;
    });
    c.public = issues.filter((i) => toBool(i.isPublic)).length;
    return c;
  }, [issues]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return issues.filter((i) => {
      if (filter !== '全部' && (i.status || '待處理') !== filter) return false;
      if (!q) return true;
      return [i.trackingId, i.dishName, i.feedback, i.parentName, i.studentClass, i.phone, i.lineId]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [issues, filter, query]);

  return (
    <div className="min-h-screen bg-neu-base">
      <main className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
        {/* Header */}
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium tracking-[0.3em] text-slate-400">COMMITTEE DASHBOARD</p>
            <h1 className="mt-2 text-2xl font-bold text-neu-text sm:text-3xl">午餐案件管理</h1>
          </div>
          <div className="flex gap-4">
            <NeuButton id="btn-admin-refresh" onClick={load} disabled={loading}>
              重新整理
            </NeuButton>
            <NeuButton id="btn-logout" onClick={handleLogout}>
              登出
            </NeuButton>
          </div>
        </header>

        {/* Stats */}
        <section className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-4" aria-label="統計">
          <StatTile label="待處理" value={counts['待處理'] ?? 0} />
          <StatTile label="處理中" value={counts['處理中'] ?? 0} />
          <StatTile label="已回覆" value={counts['已回覆'] ?? 0} />
          <StatTile label="已公開" value={counts.public ?? 0} />
        </section>

        {/* Toolbar */}
        <section className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <SegmentedFilter value={filter} onChange={setFilter} counts={counts} />
          <NeuInput
            id="admin-search"
            placeholder="搜尋追蹤碼、菜名、家長或班級"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="lg:w-80"
          />
        </section>

        {/* List */}
        <section className="mt-10" aria-label="案件列表">
          {loading && (
            <div className="flex items-center justify-center gap-3 py-20 text-sm text-slate-400">
              <Spinner /> 載入中…
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

          {!loading && !error && visible.length === 0 && (
            <div className="rounded-2xl p-10 text-center shadow-neu-pressed">
              <p className="text-sm text-slate-500">{issues.length ? '沒有符合條件的案件。' : '目前尚無任何案件。'}</p>
            </div>
          )}

          {!loading && !error && visible.length > 0 && (
            <div className="space-y-6">
              {visible.map((issue) => (
                <IssueAccordionItem
                  key={issue.trackingId}
                  issue={issue}
                  open={openId === issue.trackingId}
                  onToggle={() => setOpenId((cur) => (cur === issue.trackingId ? null : issue.trackingId))}
                  password={password}
                  onSaved={handleSaved}
                  onAuthError={handleLogout}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
