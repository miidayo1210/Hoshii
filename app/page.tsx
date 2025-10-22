'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getRandomInspirationMessage, type InspirationMessage } from '@/lib/inspiration-messages';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Mail, Lock, Eye, EyeOff, User, Calendar, Users } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function Home() {
  const router = useRouter();
  const { user, signIn, signUp, loading } = useAuth();
  const [inspirationMessage, setInspirationMessage] = useState<InspirationMessage | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  
  // ログインフォーム
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  
  // 新規登録フォーム
  const [registerData, setRegisterData] = useState({
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // メールアドレスリセット機能
  const resetEmailData = () => {
    setLoginData({ email: '', password: '' });
    setRegisterData({ 
      nickname: '', 
      email: '', 
      password: '', 
      confirmPassword: '', 
      age: '', 
      gender: '' 
    });
    setFormError('');
    
    // ブラウザのローカルストレージもクリア
    if (typeof window !== 'undefined') {
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('sb-' + process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0] + '-auth-token');
    }
  };

  useEffect(() => {
    // ランダムな鼓舞メッセージを取得
    const message = getRandomInspirationMessage();
    setInspirationMessage(message);
    
    // メッセージを少し遅れて表示
    setTimeout(() => setShowMessage(true), 500);

    // ログイン済みの場合はホームへリダイレクト
    if (user) {
      router.push('/home');
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    // Supabaseが設定されていない場合は、ローカルでシミュレーション
    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

    if (!isSupabaseConfigured) {
      // ローカルシミュレーション
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFormError('');
      alert('ログインしました！（デモモード）');
      router.push('/home');
      setFormLoading(false);
      return;
    }

    const { error } = await signIn(loginData.email, loginData.password);
    
    if (error) {
      console.error('Login error:', error);
      if (error.message.includes('Invalid login credentials')) {
        setFormError('メールアドレスまたはパスワードが正しくありません');
      } else if (error.message.includes('Email not confirmed')) {
        setFormError('メールアドレスの確認が完了していません。メールを確認してください。');
      } else {
        setFormError(`ログインエラー: ${error.message}`);
      }
    } else {
      // ログイン成功時はホームページに遷移
      router.push('/home');
    }
    
    setFormLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    if (registerData.password !== registerData.confirmPassword) {
      setFormError('パスワードが一致しません');
      setFormLoading(false);
      return;
    }

    // Supabaseが設定されていない場合は、ローカルでシミュレーション
    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

    if (!isSupabaseConfigured) {
      // ローカルシミュレーション
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFormError('');
      alert('登録が完了しました！（デモモード）');
      setIsLoginMode(true);
      setFormLoading(false);
      return;
    }

    const { error } = await signUp(registerData.email, registerData.password, {
      name: registerData.nickname,
      age: parseInt(registerData.age),
      gender: registerData.gender,
    });

    if (error) {
      console.error('Registration error:', error);
      if (error.message.includes('already registered')) {
        setFormError('このメールアドレスは既に登録されています');
      } else if (error.message.includes('invalid email')) {
        setFormError('有効なメールアドレスを入力してください');
      } else if (error.message.includes('password')) {
        setFormError('パスワードは6文字以上で入力してください');
      } else {
        setFormError(`登録エラー: ${error.message}`);
      }
    } else {
      setFormError('');
      alert('登録が完了しました！確認メールを送信しましたので、メールを確認してください。');
      setIsLoginMode(true);
    }
    
    setFormLoading(false);
  };

  // ログイン済みの場合は何も表示しない（リダイレクト中）
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🌟</div>
          <div className="text-hoshii-ink">ホームに移動中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5">
      <div className="text-center max-w-md mx-auto">
        {/* メインタイトル */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="text-6xl mb-4">🌟</div>
          <h1 className="text-3xl font-bold text-hoshii-ink mb-2">
            Hoshii にようこそ！
          </h1>
          <p className="text-hoshii-ink/60 text-lg">
            今日も素敵な一歩と出会いを
          </p>
        </motion.div>

        {/* 鼓舞メッセージ - ふきだし風UI */}
        <AnimatePresence>
          {showMessage && inspirationMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6 relative max-w-sm mx-auto"
            >
              {/* ふきだしのしっぽ */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[12px] border-l-transparent border-r-transparent border-t-white/80"></div>
              </div>

              {/* 星空背景 */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100/40 via-blue-50/40 to-pink-100/40 rounded-2xl blur-sm"></div>
              
              {/* キラキラアニメーション */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-0.5 h-0.5 bg-yellow-300 rounded-full"
                    style={{
                      left: `${25 + (i * 12)}%`,
                      top: `${35 + (i % 2) * 25}%`,
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      delay: i * 0.25,
                    }}
                  />
                ))}
              </div>

              <div className="relative p-4 bg-gradient-to-br from-white/85 via-purple-50/85 to-blue-50/85 backdrop-blur-sm rounded-2xl border border-white/40 shadow-md">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-xl">{inspirationMessage.emoji}</span>
                  <Sparkles className="h-3 w-3 text-purple-500 animate-pulse" strokeWidth={1.5} />
                </div>
                <p className="text-hoshii-ink font-medium text-sm leading-relaxed text-center">
                  {inspirationMessage.message}
                </p>
                <div className="mt-2">
                  <span className="inline-block px-2 py-0.5 text-xs font-medium text-purple-600 bg-purple-100 rounded-full">
                    {inspirationMessage.category === 'daily' && '日常の励まし'}
                    {inspirationMessage.category === 'environment' && '環境への想い'}
                    {inspirationMessage.category === 'community' && 'コミュニティ'}
                    {inspirationMessage.category === 'wellbeing' && 'ウェルビーイング'}
                    {inspirationMessage.category === 'growth' && '成長への道'}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ログイン/新規登録フォーム */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-white/30 shadow-lg">
            <form onSubmit={isLoginMode ? handleLogin : handleRegister} className="space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-xl font-semibold text-hoshii-ink">
                  {isLoginMode ? 'ログイン' : '新規登録'}
                </h2>
                <p className="text-sm text-hoshii-ink/60">
                  {isLoginMode ? '' : '新しいアカウントを作成'}
                </p>
              </div>

              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {formError}
                </div>
              )}

              {isLoginMode ? (
                // ログインフォーム
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-hoshii-ink">メールアドレス</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-hoshii-ink">パスワード</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="パスワード"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                // 新規登録フォーム
                <>
                  <div className="space-y-2">
                    <Label htmlFor="nickname" className="text-hoshii-ink">ニックネーム</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="nickname"
                        type="text"
                        placeholder="ニックネーム"
                        value={registerData.nickname}
                        onChange={(e) => setRegisterData({ ...registerData, nickname: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-hoshii-ink">メールアドレス</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-hoshii-ink">年代</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <select
                          id="age"
                          value={registerData.age}
                          onChange={(e) => setRegisterData({ ...registerData, age: e.target.value })}
                          className="w-full h-10 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hoshii-green"
                          required
                        >
                          <option value="">選択</option>
                          <option value="10">10代</option>
                          <option value="20">20代</option>
                          <option value="30">30代</option>
                          <option value="40">40代</option>
                          <option value="50">50代</option>
                          <option value="60">60代以上</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender" className="text-hoshii-ink">性別</Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <select
                          id="gender"
                          value={registerData.gender}
                          onChange={(e) => setRegisterData({ ...registerData, gender: e.target.value })}
                          className="w-full h-10 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hoshii-green"
                          required
                        >
                          <option value="">選択</option>
                          <option value="male">男性</option>
                          <option value="female">女性</option>
                          <option value="other">その他</option>
                          <option value="prefer_not_to_say">回答しない</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-hoshii-ink">パスワード</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="パスワード"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-hoshii-ink">パスワード確認</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="パスワード確認"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              <Button
                type="submit"
                disabled={formLoading}
                className="w-full bg-hoshii-green hover:bg-hoshii-green/90 text-white font-semibold py-3 px-6 rounded-2xl"
              >
                {formLoading ? (isLoginMode ? 'ログイン中...' : '登録中...') : (isLoginMode ? 'ログイン' : '新規登録')}
              </Button>
            </form>

            {/* 切り替えボタン */}
            <div className="text-center mt-4">
              <button
                onClick={() => {
                  setIsLoginMode(!isLoginMode);
                  setFormError('');
                }}
                className="text-sm text-hoshii-green hover:text-hoshii-green/80 transition-colors"
              >
                {isLoginMode ? '新規登録はこちらから' : '既にアカウントをお持ちの方はこちら'}
              </button>
              
              {/* リセットボタン */}
              <div className="mt-2">
                <button
                  onClick={resetEmailData}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  🔄
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}