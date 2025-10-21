import { Html, Head, Body, Container, Heading, Text, Link, Hr } from '@react-email/components';

export default function ThankYouEmail({ name, totalStars, links }:{
  name?: string;
  totalStars: number;
  links: { png: string; svg: string; pdf: string; home: string };
}) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "ui-sans-serif, system-ui", background: "#fdf7ff", padding: "20px" }}>
        <Container style={{ background: "#ffffff", borderRadius: "16px", padding: "20px" }}>
          <Heading style={{ margin: "0 0 8px 0" }}>💖 茨城Frogsの応援と参加ありがとうございます</Heading>
          <Text style={{ margin: "8px 0", color: "#555" }}>
            {name ? `${name} さん、` : ""}あなたの一歩が、星空を明るくしました。現在の合計スター数は
            <strong> {totalStars.toLocaleString()} </strong>です。
          </Text>
          
          <Text style={{ margin: "16px 0 8px 0", fontWeight: "bold" }}>茨城Frogsとは？</Text>
          <Text style={{ margin: "8px 0", color: "#555" }}>
            茨城県にゆかりのある学生向けの、イノベーター人財育成プログラムです。
            世界を舞台に活躍する起業家/投資家/クリエイターや、メンターからサポートをもらいながら
            「テクノロジーを駆使して、社会や未来をより良くするビジネスの創造」に挑みます。
          </Text>
          <Text style={{ margin: "8px 0" }}>
            <Link href="https://www.ibarakifrogs.com/" style={{ color: "#0066cc" }}>
              🌐 茨城Frogs公式サイト: https://www.ibarakifrogs.com/
            </Link>
          </Text>
          
          <Text style={{ margin: "16px 0 8px 0", fontWeight: "bold" }}>現在の星空を見る：</Text>
          <Text style={{ margin: "8px 0" }}>
            <Link href={links.home}>🌌 LEAP DAY の星空を見る</Link>
          </Text>
          
          <Text style={{ margin: "16px 0 8px 0", color: "#666", fontStyle: "italic" }}>
            ※ 星座カード、レポートのダウンロードリンクは後ほど（イベント期間が終了してから）お送りいたします。
          </Text>
          
          <Hr style={{ margin: "20px 0" }} />
          <Text style={{ fontSize: "12px", color: "#777" }}>#LEAPDAY #IbarakiFrogs #星になる応援</Text>
        </Container>
      </Body>
    </Html>
  );
}
