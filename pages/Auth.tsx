import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';

type Mode = 'login' | 'register';

const oauthErrorMap: Record<string, string> = {
  google_state: 'Google 登录已失效，请重试。',
  google_callback: 'Google 登录失败，请稍后再试。',
  apple_state: 'Apple 登录已失效，请重试。',
  apple_callback: 'Apple 登录失败，请稍后再试。',
};

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<Mode>('login');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const oauthError = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('error');
  }, [location.search]);

  const displayError = error || (oauthError ? oauthErrorMap[oauthError] || 'OAuth 登录失败。' : '');

  const submit = async () => {
    setError('');
    if (!email || !password) {
      setError('请填写邮箱和密码');
      return;
    }
    if (mode === 'register') {
      if (!displayName || displayName.trim().length < 2) {
        setError('昵称至少 2 个字符');
        return;
      }
      if (password !== confirmPassword) {
        setError('两次密码输入不一致');
        return;
      }
    }

    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          displayName,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload.error || '认证失败');
        return;
      }
      navigate('/profile');
    } catch {
      setError('网络异常，请稍后再试。');
    } finally {
      setLoading(false);
    }
  };

  const startOAuth = (provider: 'google' | 'apple') => {
    window.location.href = `/api/auth/oauth/${provider}/start?next=${encodeURIComponent('/profile')}`;
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-10">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-stretch">
        <section className="hidden lg:flex rounded-3xl bg-gradient-to-br from-[#2b2360] via-[#412f8f] to-[#e8306e] text-white p-10 relative overflow-hidden">
          <div className="absolute -right-24 -top-24 size-72 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute -left-16 bottom-0 size-60 rounded-full bg-cyan-300/20 blur-2xl"></div>
          <div className="relative z-10 flex flex-col justify-between">
            <div>
              <p className="uppercase tracking-[0.35em] text-xs text-white/70 mb-4">ReelComic Access</p>
              <h1 className="text-5xl font-black leading-tight mb-4">登录后继续追更你的短剧宇宙</h1>
              <p className="text-white/85 text-lg">支持邮箱注册与 Google / Apple 一键登录，跨设备同步观看进度和会员权益。</p>
            </div>
            <div className="flex gap-8 text-sm font-semibold text-white/85">
              <div className="flex items-center gap-2"><Icon name="movie" /> 海量日漫短剧</div>
              <div className="flex items-center gap-2"><Icon name="workspace_premium" /> VIP 专享分集</div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white dark:bg-[#211116] border border-gray-200 dark:border-white/10 shadow-xl p-6 md:p-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">
              {mode === 'login' ? '登录 ReelComic' : '创建 ReelComic 账号'}
            </h2>
            <div className="flex rounded-xl bg-gray-100 dark:bg-white/5 p-1">
              <button
                className={`px-4 py-1.5 rounded-lg text-sm font-bold ${mode === 'login' ? 'bg-white dark:bg-primary text-primary dark:text-white shadow-sm' : 'text-gray-500'}`}
                onClick={() => setMode('login')}
              >
                登录
              </button>
              <button
                className={`px-4 py-1.5 rounded-lg text-sm font-bold ${mode === 'register' ? 'bg-white dark:bg-primary text-primary dark:text-white shadow-sm' : 'text-gray-500'}`}
                onClick={() => setMode('register')}
              >
                注册
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">昵称</label>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  type="text"
                  placeholder="例如：NekoWatcher"
                  className="mt-1 w-full rounded-xl px-4 py-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">邮箱</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@example.com"
                className="mt-1 w-full rounded-xl px-4 py-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">密码</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="至少 8 位"
                className="mt-1 w-full rounded-xl px-4 py-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">确认密码</label>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  placeholder="再次输入密码"
                  className="mt-1 w-full rounded-xl px-4 py-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            )}
          </div>

          {displayError && <p className="mt-4 text-sm text-red-500 font-semibold">{displayError}</p>}

          <button
            onClick={submit}
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-primary text-white py-3.5 font-bold hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            {loading ? '处理中...' : mode === 'login' ? '登录' : '创建账号'}
          </button>

          <div className="my-6 flex items-center gap-3 text-gray-400">
            <div className="h-px bg-gray-200 dark:bg-white/10 flex-1"></div>
            <span className="text-xs font-bold uppercase tracking-widest">或使用 OAuth</span>
            <div className="h-px bg-gray-200 dark:bg-white/10 flex-1"></div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <button
              onClick={() => startOAuth('google')}
              className="rounded-xl border border-gray-200 dark:border-white/10 py-3 font-semibold hover:border-primary/30 hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
            >
              <Icon name="public" /> Google 登录
            </button>
            <button
              onClick={() => startOAuth('apple')}
              className="rounded-xl border border-gray-200 dark:border-white/10 py-3 font-semibold hover:border-primary/30 hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
            >
              <Icon name="logo_dev" /> Apple 登录
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
