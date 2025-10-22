'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Mail, Lock, User, Calendar, Users } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // ログインフォーム
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // 新規登録フォーム
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    password: '',
    confirmPassword: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await signIn(loginData.email, loginData.password);
    
    if (error) {
      setError('メールアドレスまたはパスワードが正しくありません');
    } else {
      // ログイン成功時はホームページに遷移
      window.location.href = '/home';
    }
    
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('パスワードが一致しません');
      setLoading(false);
      return;
    }

    const { error } = await signUp(registerData.email, registerData.password, {
      name: registerData.name,
      age: parseInt(registerData.age),
      gender: registerData.gender,
    });

    if (error) {
      setError('登録に失敗しました。メールアドレスが既に使用されている可能性があります');
    } else {
      setError('');
      alert('登録が完了しました！確認メールを送信しましたので、メールを確認してください。');
      setIsLogin(true);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-hoshii-mint via-white to-hoshii-sky flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* 戻るボタン */}
        <div className="mb-6">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-hoshii-ink hover:text-hoshii-green transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            ホームに戻る
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="kawaii-card border-0">
            <CardHeader className="text-center">
              <div className="text-4xl mb-2">🌟</div>
              <CardTitle className="text-2xl font-bold text-hoshii-ink">
                {isLogin ? 'Hoshiiにログイン' : 'Hoshiiに新規登録'}
              </CardTitle>
              <CardDescription className="text-hoshii-ink/70">
                {isLogin ? '星空の世界へようこそ' : '新しいアカウントを作成'}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {isLogin ? (
                // ログインフォーム
                <form onSubmit={handleLogin} className="space-y-4">
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
                        type="password"
                        placeholder="パスワード"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-hoshii-green hover:bg-hoshii-green/90 text-white"
                  >
                    {loading ? 'ログイン中...' : 'ログイン'}
                  </Button>
                </form>
              ) : (
                // 新規登録フォーム
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-hoshii-ink">お名前</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="お名前"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
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
                      <Label htmlFor="age" className="text-hoshii-ink">年齢</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="age"
                          type="number"
                          placeholder="25"
                          min="1"
                          max="120"
                          value={registerData.age}
                          onChange={(e) => setRegisterData({ ...registerData, age: e.target.value })}
                          className="pl-10"
                          required
                        />
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
                          <option value="">選択してください</option>
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
                        type="password"
                        placeholder="パスワード"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-hoshii-ink">パスワード確認</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="パスワード確認"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-hoshii-green hover:bg-hoshii-green/90 text-white"
                  >
                    {loading ? '登録中...' : '新規登録'}
                  </Button>
                </form>
              )}

              <div className="text-center">
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                  }}
                  className="text-sm text-hoshii-green hover:text-hoshii-green/80 transition-colors"
                >
                  {isLogin ? '新規登録の方はこちら' : '既にアカウントをお持ちの方はこちら'}
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
