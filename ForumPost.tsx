import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, ThumbsUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ForumPostProps {
  post: any;
  onReplyAdded: () => void;
}

export function ForumPost({ post, onReplyAdded }: ForumPostProps) {
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replies, setReplies] = useState<any[]>([]);
  const [showReplies, setShowReplies] = useState(false);

  const handleReply = async () => {
    const email = localStorage.getItem('userEmail');
    const name = localStorage.getItem('userName') || 'Anonymous';

    const { data } = await supabase.functions.invoke('add-forum-reply', {
      body: { postId: post.id, email, name, content: replyContent }
    });

    if (data?.success) {
      setReplyContent('');
      setShowReply(false);
      onReplyAdded();
      loadReplies();
    }
  };

  const loadReplies = async () => {
    const { data } = await supabase
      .from('vip_forum_replies')
      .select('*')
      .eq('post_id', post.id)
      .order('created_at', { ascending: true });

    if (data) setReplies(data);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xl font-bold">{post.title}</h3>
          <p className="text-sm text-gray-500">by {post.author_name}</p>
        </div>
        <Badge>{post.category}</Badge>
      </div>
      <p className="text-gray-700 mb-4">{post.content}</p>
      <div className="flex gap-4 text-sm text-gray-500">
        <button className="flex items-center gap-1"><ThumbsUp className="w-4 h-4" /> {post.likes}</button>
        <button 
          onClick={() => { setShowReplies(!showReplies); if (!showReplies) loadReplies(); }}
          className="flex items-center gap-1"
        >
          <MessageCircle className="w-4 h-4" /> {post.replies} replies
        </button>
      </div>
      {showReplies && replies.map(reply => (
        <div key={reply.id} className="mt-4 pl-4 border-l-2 border-gray-200">
          <p className="text-sm font-semibold">{reply.author_name}</p>
          <p className="text-sm text-gray-700">{reply.content}</p>
        </div>
      ))}
      {!showReply && <Button variant="outline" size="sm" onClick={() => setShowReply(true)} className="mt-4">Reply</Button>}
      {showReply && (
        <div className="mt-4">
          <Textarea value={replyContent} onChange={(e) => setReplyContent(e.target.value)} placeholder="Write your reply..." />
          <div className="flex gap-2 mt-2">
            <Button onClick={handleReply} size="sm">Post Reply</Button>
            <Button variant="outline" size="sm" onClick={() => setShowReply(false)}>Cancel</Button>
          </div>
        </div>
      )}
    </Card>
  );
}
