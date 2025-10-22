'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Users, 
  Target, 
  TrendingUp, 
  Shield, 
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  Heart,
  Leaf,
  Globe
} from 'lucide-react';

export default function BusinessPage() {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | 'enterprise'>('premium');

  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "チーム管理",
      description: "社員の行動を可視化し、チーム全体のエンゲージメントを向上"
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "目標設定",
      description: "企業のSDGs目標に合わせたアクション設定と進捗管理"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      description: "データ分析",
      title: "行動データの分析とレポート機能で改善点を発見"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "セキュリティ",
      description: "企業レベルのセキュリティとプライバシー保護"
    }
  ];

  const plans = [
    {
      id: 'basic' as const,
      name: 'ベーシック',
      price: '¥5,000',
      period: '/月',
      description: '小規模チーム向け',
      features: [
        '最大50名のメンバー',
        '基本的なアクション管理',
        '月次レポート',
        'メールサポート'
      ],
      popular: false
    },
    {
      id: 'premium' as const,
      name: 'プレミアム',
      price: '¥15,000',
      period: '/月',
      description: '中規模企業向け',
      features: [
        '最大200名のメンバー',
        '高度な分析機能',
        'リアルタイムダッシュボード',
        'カスタムアクション設定',
        '優先サポート',
        'API連携'
      ],
      popular: true
    },
    {
      id: 'enterprise' as const,
      name: 'エンタープライズ',
      price: 'カスタム',
      period: '',
      description: '大企業向け',
      features: [
        '無制限メンバー',
        '完全カスタマイズ',
        '専任サポート',
        'オンプレミス対応',
        'SSO連携',
        '24/7サポート'
      ],
      popular: false
    }
  ];

  const testimonials = [
    {
      name: "田中 花子",
      company: "株式会社エコテック",
      role: "人事部長",
      content: "Hoshiiのおかげで、社員の環境意識が格段に向上しました。SDGsの取り組みも具体的な数値で見える化でき、経営陣からの評価も高くなっています。",
      rating: 5
    },
    {
      name: "佐藤 太郎",
      company: "グリーンソリューションズ",
      role: "CEO",
      content: "チーム全体のエンゲージメントが向上し、離職率も下がりました。小さな行動の積み重ねが、企業文化の変革につながっています。",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-hoshii-mint via-white to-hoshii-sky">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 yk-halo opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Building2 className="h-8 w-8 text-hoshii-green" />
              <Badge variant="secondary" className="bg-hoshii-green/10 text-hoshii-green border-hoshii-green/20">
                企業向けソリューション
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-hoshii-ink mb-6">
              Hoshii for
              <span className="text-hoshii-green block">Business</span>
            </h1>
            
            <p className="text-xl text-hoshii-ink/70 mb-8 leading-relaxed">
              社員の行動変容を通じて、持続可能な企業文化を築く
              <br />
              企業向けエンゲージメントプラットフォーム
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-hoshii-green hover:bg-hoshii-green/90 text-white px-8 py-4 text-lg"
              >
                無料トライアルを始める
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-hoshii-green text-hoshii-green hover:bg-hoshii-green hover:text-white px-8 py-4 text-lg"
              >
                デモを見る
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-hoshii-ink mb-4">
              なぜ企業に選ばれるのか
            </h2>
            <p className="text-xl text-hoshii-ink/70">
              持続可能な企業文化の構築をサポートする機能
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full kawaii-card border-0">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-hoshii-green/10 rounded-full flex items-center justify-center mx-auto mb-4 text-hoshii-green">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-hoshii-ink mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-hoshii-ink/70">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-hoshii-ink mb-4">
              料金プラン
            </h2>
            <p className="text-xl text-hoshii-ink/70">
              チームの規模に合わせて最適なプランを選択
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                whileHover={{ y: -5 }}
                className={`relative ${plan.popular ? 'scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-hoshii-green text-white px-4 py-1">
                      人気プラン
                    </Badge>
                  </div>
                )}
                
                <Card className={`h-full kawaii-card border-0 ${plan.popular ? 'ring-2 ring-hoshii-green' : ''}`}>
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl font-bold text-hoshii-ink">
                      {plan.name}
                    </CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-hoshii-green">
                        {plan.price}
                      </span>
                      <span className="text-hoshii-ink/70">
                        {plan.period}
                      </span>
                    </div>
                    <CardDescription className="text-hoshii-ink/70 mt-2">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-hoshii-green flex-shrink-0" />
                          <span className="text-hoshii-ink">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={`w-full py-3 ${
                        plan.popular 
                          ? 'bg-hoshii-green hover:bg-hoshii-green/90 text-white' 
                          : 'bg-hoshii-ink hover:bg-hoshii-ink/90 text-white'
                      }`}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      {plan.id === 'enterprise' ? 'お問い合わせ' : 'プランを選択'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-hoshii-ink mb-4">
              導入企業の声
            </h2>
            <p className="text-xl text-hoshii-ink/70">
              実際にご利用いただいている企業様からの評価
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="kawaii-card border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-hoshii-green text-hoshii-green" />
                      ))}
                    </div>
                    
                    <blockquote className="text-hoshii-ink mb-4 italic">
                      &ldquo;{testimonial.content}&rdquo;
                    </blockquote>
                    
                    <div className="border-t pt-4">
                      <div className="font-semibold text-hoshii-ink">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-hoshii-ink/70">
                        {testimonial.role} / {testimonial.company}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="kawaii-card p-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Heart className="h-8 w-8 text-hoshii-green" />
                <Leaf className="h-8 w-8 text-hoshii-green" />
                <Globe className="h-8 w-8 text-hoshii-green" />
              </div>
              
              <h2 className="text-4xl font-bold text-hoshii-ink mb-4">
                持続可能な未来を、一緒に創りませんか？
              </h2>
              
              <p className="text-xl text-hoshii-ink/70 mb-8">
                企業の成長と社会貢献を両立する
                <br />
                新しい働き方をHoshiiで始めましょう
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-hoshii-green hover:bg-hoshii-green/90 text-white px-8 py-4 text-lg"
                >
                  無料トライアルを始める
                  <Zap className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-hoshii-green text-hoshii-green hover:bg-hoshii-green hover:text-white px-8 py-4 text-lg"
                >
                  資料をダウンロード
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
