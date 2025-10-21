import { CommunitySidebar, CommunityMobileNav } from "@/components/community/sidebar";

export default async function Page() {
  // Mock notifications data
  const notifications = [
    {
      id: 'notif-1',
      type: 'achievement',
      message: '「公園の清掃活動」の目標を達成しました！🎉',
      timestamp: '2時間前',
      read: false
    },
    {
      id: 'notif-2',
      type: 'participation',
      message: '「地域の子どもたちと絵本読み聞かせ」に現在 24人が参加中です',
      timestamp: '4時間前',
      read: false
    },
    {
      id: 'notif-3',
      type: 'star',
      message: 'あなたのアクション「高齢者施設でのボランティア活動」に新しい星が灯されました！',
      timestamp: '1日前',
      read: true
    },
    {
      id: 'notif-4',
      type: 'community',
      message: '「Green Valley」コミュニティに新しいメンバーが参加しました',
      timestamp: '2日前',
      read: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <CommunitySidebar />
        
        <main className="flex-1 lg:ml-0">
          <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">更新情報</h1>
      <ul className="space-y-3">
        {notifications.map(notification => (
          <li 
            key={notification.id} 
            className={`p-4 rounded-xl shadow transition-colors ${
              notification.read ? 'bg-gray-50' : 'bg-white border-l-4 border-emerald-500'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-800">{notification.message}</p>
                <p className="text-sm text-gray-500 mt-1">{notification.timestamp}</p>
              </div>
              {!notification.read && (
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
              )}
            </div>
          </li>
        ))}
      </ul>
          </div>
        </main>
      </div>
      
      <CommunityMobileNav />
    </div>
  );
}