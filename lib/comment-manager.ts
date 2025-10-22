// グローバルなコメント管理
let globalComments: Array<{id: string; name: string; label: string; comment: string; created_at: string}> = [];
let commentListeners: Array<(comments: typeof globalComments) => void> = [];

export const commentManager = {
  // コメントを追加
  addComment: (comment: typeof globalComments[0]) => {
    globalComments = [comment, ...globalComments];
    commentListeners.forEach(listener => listener(globalComments));
    
    // ローカルストレージにも保存
    const projectId = '8c182150-47c5-4933-b664-c343f5703031';
    const userComments = globalComments.filter(c => !c.id.startsWith('demo'));
    localStorage.setItem(`comments_${projectId}`, JSON.stringify(userComments));
  },
  
  // コメントを取得
  getComments: () => globalComments,
  
  // リスナーを追加
  addListener: (listener: (comments: typeof globalComments) => void) => {
    commentListeners.push(listener);
    return () => {
      commentListeners = commentListeners.filter(l => l !== listener);
    };
  },
  
  // 初期化（ローカルストレージから復元）
  init: () => {
    const projectId = '8c182150-47c5-4933-b664-c343f5703031';
    const savedComments = localStorage.getItem(`comments_${projectId}`);
    if (savedComments) {
      try {
        const parsedComments = JSON.parse(savedComments);
        globalComments = [...parsedComments];
      } catch (e) {
        console.error('コメント復元エラー:', e);
      }
    }
  }
};
