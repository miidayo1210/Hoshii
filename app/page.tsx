'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function Home() {
  const router = useRouter();
  const { user, login, register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [gender, setGender] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showSparkles, setShowSparkles] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // キラキラアニメーションを開始
    const timer = setTimeout(() => setShowSparkles(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // ログイン済みの場合はホームページにリダイレクト
  useEffect(() => {
    if (user) {
      router.push('/home');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

          try {
            if (isLoginMode) {
              await login(email, password);
            } else {
              await register(email, password, nickname, ageGroup, gender);
            }
            // ログイン/登録成功後はuseEffectでリダイレクトされる
          } catch (error) {
      setError(error instanceof Error ? error.message : 'エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes bounce {
            0%, 20%, 53%, 80%, 100% {
              transform: translate3d(0,0,0);
            }
            40%, 43% {
              transform: translate3d(0, -30px, 0);
            }
            70% {
              transform: translate3d(0, -15px, 0);
            }
            90% {
              transform: translate3d(0, -4px, 0);
            }
          }
          @keyframes sparkle {
            0%, 100% {
              opacity: 0;
              transform: scale(0.5);
            }
            50% {
              opacity: 1;
              transform: scale(1);
            }
          }
          .bounce-star {
            animation: bounce 2s infinite;
          }
          .sparkle {
            animation: sparkle 2s ease-in-out infinite;
          }
        `
      }} />
      
      <div 
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem',
          background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 50%, #6366f1 100%)',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* 背景のキラキラ */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {showSparkles && [...Array(20)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '8px',
                height: '8px',
                backgroundColor: '#fbbf24',
                borderRadius: '50%',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationName: 'sparkle',
                animationDuration: '2s',
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite',
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div style={{ textAlign: 'center', maxWidth: '28rem', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          {/* メインタイトル */}
          <div style={{ marginBottom: '2rem' }}>
            <div 
              className="bounce-star"
              style={{
                fontSize: '4rem',
                marginBottom: '1rem'
              }}
            >
              🌟
            </div>
            <h1 
              style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                marginBottom: '0.75rem',
                background: 'linear-gradient(45deg, #a855f7, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Hoshii にようこそ！
            </h1>
            <p 
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '1.125rem',
                fontWeight: '500'
              }}
            >
              今日も素敵な一歩と出会いを ✨
            </p>
          </div>
          
          {/* ログインフォーム */}
          <div 
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1.5rem',
              padding: '2rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h2 
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '0.5rem'
                }}
              >
                {isLoginMode ? 'ログイン' : '新規登録'}
              </h2>
              <p 
                style={{
                  color: '#6b7280',
                  fontSize: '0.875rem'
                }}
              >
                {isLoginMode ? 'おかえりなさい！' : '新しい冒険を始めましょう！'}
              </p>
            </div>
            
                   <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                     {error && (
                       <div style={{ 
                         color: '#ef4444', 
                         backgroundColor: '#fef2f2', 
                         border: '1px solid #fecaca', 
                         borderRadius: '0.5rem', 
                         padding: '0.75rem', 
                         fontSize: '0.875rem' 
                       }}>
                         {error}
                       </div>
                     )}
                     
                     {/* 新規登録時のみ表示するフィールド */}
                     {!isLoginMode && (
                       <>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                           <label 
                             htmlFor="nickname" 
                             style={{
                               color: '#374151',
                               fontWeight: '500',
                               display: 'flex',
                               alignItems: 'center',
                               gap: '0.5rem'
                             }}
                           >
                             <span>👤</span> ニックネーム
                           </label>
                           <input
                             id="nickname"
                             type="text"
                             placeholder="ニックネーム"
                             value={nickname}
                             onChange={(e) => setNickname(e.target.value)}
                             style={{
                               width: '100%',
                               padding: '0.75rem 1rem',
                               backgroundColor: 'rgba(255, 255, 255, 0.9)',
                               border: '2px solid rgba(16, 185, 129, 0.2)',
                               borderRadius: '1rem',
                               fontSize: '1rem',
                               transition: 'all 0.3s ease',
                               outline: 'none'
                             }}
                             onFocus={(e) => {
                               e.target.style.borderColor = '#10b981';
                               e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                             }}
                             onBlur={(e) => {
                               e.target.style.borderColor = 'rgba(16, 185, 129, 0.2)';
                               e.target.style.boxShadow = 'none';
                             }}
                             required={!isLoginMode}
                           />
                         </div>

                         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                           <label 
                             htmlFor="ageGroup" 
                             style={{
                               color: '#374151',
                               fontWeight: '500',
                               display: 'flex',
                               alignItems: 'center',
                               gap: '0.5rem'
                             }}
                           >
                             <span>🎂</span> 年代
                           </label>
                           <select
                             id="ageGroup"
                             value={ageGroup}
                             onChange={(e) => setAgeGroup(e.target.value)}
                             style={{
                               width: '100%',
                               padding: '0.75rem 1rem',
                               backgroundColor: 'rgba(255, 255, 255, 0.9)',
                               border: '2px solid rgba(16, 185, 129, 0.2)',
                               borderRadius: '1rem',
                               fontSize: '1rem',
                               transition: 'all 0.3s ease',
                               outline: 'none'
                             }}
                             onFocus={(e) => {
                               e.target.style.borderColor = '#10b981';
                               e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                             }}
                             onBlur={(e) => {
                               e.target.style.borderColor = 'rgba(16, 185, 129, 0.2)';
                               e.target.style.boxShadow = 'none';
                             }}
                             required={!isLoginMode}
                           >
                             <option value="">年代を選択</option>
                             <option value="10代">10代</option>
                             <option value="20代">20代</option>
                             <option value="30代">30代</option>
                             <option value="40代">40代</option>
                             <option value="50代">50代</option>
                             <option value="60代以上">60代以上</option>
                           </select>
                         </div>

                         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                           <label 
                             htmlFor="gender" 
                             style={{
                               color: '#374151',
                               fontWeight: '500',
                               display: 'flex',
                               alignItems: 'center',
                               gap: '0.5rem'
                             }}
                           >
                             <span>👥</span> 性別
                           </label>
                           <select
                             id="gender"
                             value={gender}
                             onChange={(e) => setGender(e.target.value)}
                             style={{
                               width: '100%',
                               padding: '0.75rem 1rem',
                               backgroundColor: 'rgba(255, 255, 255, 0.9)',
                               border: '2px solid rgba(16, 185, 129, 0.2)',
                               borderRadius: '1rem',
                               fontSize: '1rem',
                               transition: 'all 0.3s ease',
                               outline: 'none'
                             }}
                             onFocus={(e) => {
                               e.target.style.borderColor = '#10b981';
                               e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                             }}
                             onBlur={(e) => {
                               e.target.style.borderColor = 'rgba(16, 185, 129, 0.2)';
                               e.target.style.boxShadow = 'none';
                             }}
                             required={!isLoginMode}
                           >
                             <option value="">性別を選択</option>
                             <option value="男性">男性</option>
                             <option value="女性">女性</option>
                             <option value="その他">その他</option>
                             <option value="回答しない">回答しない</option>
                           </select>
                         </div>
                       </>
                     )}

                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                       <label 
                         htmlFor="email" 
                         style={{
                           color: '#374151',
                           fontWeight: '500',
                           display: 'flex',
                           alignItems: 'center',
                           gap: '0.5rem'
                         }}
                       >
                         <span>📧</span> メールアドレス
                       </label>
                       <input
                         id="email"
                         type="email"
                         placeholder="your@email.com"
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         style={{
                           width: '100%',
                           padding: '0.75rem 1rem',
                           backgroundColor: 'rgba(255, 255, 255, 0.9)',
                           border: '2px solid rgba(16, 185, 129, 0.2)',
                           borderRadius: '1rem',
                           fontSize: '1rem',
                           transition: 'all 0.3s ease',
                           outline: 'none'
                         }}
                         onFocus={(e) => {
                           e.target.style.borderColor = '#10b981';
                           e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                         }}
                         onBlur={(e) => {
                           e.target.style.borderColor = 'rgba(16, 185, 129, 0.2)';
                           e.target.style.boxShadow = 'none';
                         }}
                         required
                       />
                     </div>

                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                       <label 
                         htmlFor="password" 
                         style={{
                           color: '#374151',
                           fontWeight: '500',
                           display: 'flex',
                           alignItems: 'center',
                           gap: '0.5rem'
                         }}
                       >
                         <span>🔒</span> パスワード
                       </label>
                       <input
                         id="password"
                         type="password"
                         placeholder="パスワード"
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         style={{
                           width: '100%',
                           padding: '0.75rem 1rem',
                           backgroundColor: 'rgba(255, 255, 255, 0.9)',
                           border: '2px solid rgba(16, 185, 129, 0.2)',
                           borderRadius: '1rem',
                           fontSize: '1rem',
                           transition: 'all 0.3s ease',
                           outline: 'none'
                         }}
                         onFocus={(e) => {
                           e.target.style.borderColor = '#10b981';
                           e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                         }}
                         onBlur={(e) => {
                           e.target.style.borderColor = 'rgba(16, 185, 129, 0.2)';
                           e.target.style.boxShadow = 'none';
                         }}
                         required
                       />
                     </div>


              <button
                type="submit"
                style={{
                  width: '100%',
                  background: 'linear-gradient(45deg, #10b981, #3b82f6)',
                  color: 'white',
                  fontWeight: '600',
                  padding: '1rem 1.5rem',
                  borderRadius: '1.5rem',
                  border: 'none',
                  fontSize: '1.125rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.transform = 'translateY(-3px)';
                  (e.target as HTMLElement).style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.transform = 'translateY(0)';
                  (e.target as HTMLElement).style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
                }}
              >
                {isLoading ? '処理中...' : (isLoginMode ? 'ログイン 🚀' : '新規登録 ✨')}
              </button>
            </form>
            
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <button 
                onClick={() => setIsLoginMode(!isLoginMode)}
                style={{
                  fontSize: '0.875rem',
                  color: '#2563eb',
                  fontWeight: '500',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#1d4ed8'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#2563eb'}
              >
                {isLoginMode ? '新規登録はこちらから 👆' : '既にアカウントをお持ちの方はこちら 👆'}
              </button>
            </div>
          </div>

          {/* フッターメッセージ */}
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <p 
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.875rem'
              }}
            >
              💫 小さな行動が大きな変化を生み出します 💫
            </p>
          </div>
        </div>
      </div>
    </>
  );
}