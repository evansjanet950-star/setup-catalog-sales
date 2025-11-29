import { useState, useEffect } from 'react';
import { VIPAccessGate } from '@/components/vip/VIPAccessGate';
import { ExclusiveProducts } from '@/components/vip/ExclusiveProducts';
import { MemberDirectory } from '@/components/vip/MemberDirectory';
import { ForumPost } from '@/components/vip/ForumPost';
import { MemberBenefitsCard } from '@/components/vip/MemberBenefitsCard';
import EventsCalendar from '@/components/vip/EventsCalendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { Crown, Sparkles } from 'lucide-react';

export default function VIP() {
  const [posts, setPosts] = useState<any[]>([]);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'General' });
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    loadUserInfo();
    loadPosts();
  }, []);

  const loadUserInfo = async () => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      const { data } = await supabase
        .from('vip_members')
        .select('*')
        .eq('email', email)
        .single();
      if (data) setUserInfo(data);
    }
  };

  const loadPosts = async () => {
    const { data } = await supabase
      .from('vip_forum_posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setPosts(data);
  };

  const handleCreatePost = async () => {
    const email = localStorage.getItem('userEmail');
    const name = localStorage.getItem('userName') || 'Anonymous';

    const { data } = await supabase.functions.invoke('create-forum-post', {
      body: { email, name, ...newPost }
    });

    if (data?.success) {
      setNewPost({ title: '', content: '', category: 'General' });
      setShowNewPost(false);
      loadPosts();
    }
  };

  return (
    <VIPAccessGate>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-12 h-12" />
              <h1 className="text-4xl font-bold">VIP Member Portal</h1>
            </div>
            <p className="text-xl">Exclusive access for Gold & Platinum members</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {userInfo && (
            <MemberBenefitsCard
              tier={userInfo.tier}
              name={userInfo.name}
              points={userInfo.total_points}
              memberSince={new Date(userInfo.joined_at).toLocaleDateString()}
            />
          )}

          <Tabs defaultValue="products" className="mt-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="products">Exclusive Products</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="forum">Member Forum</TabsTrigger>
              <TabsTrigger value="directory">Member Directory</TabsTrigger>
            </TabsList>


            <TabsContent value="products" className="mt-6">
              <ExclusiveProducts />
            </TabsContent>

            <TabsContent value="events" className="mt-6">
              {userInfo && (
                <EventsCalendar 
                  userEmail={userInfo.email}
                  userName={userInfo.name}
                  userTier={userInfo.tier}
                />
              )}
            </TabsContent>


            <TabsContent value="forum" className="mt-6">
              <div className="mb-6">
                {!showNewPost && (
                  <Button onClick={() => setShowNewPost(true)}>Create New Post</Button>
                )}
                {showNewPost && (
                  <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <h3 className="text-xl font-bold mb-4">New Forum Post</h3>
                    <Input
                      placeholder="Post title"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      className="mb-3"
                    />
                    <Select value={newPost.category} onValueChange={(v) => setNewPost({ ...newPost, category: v })}>
                      <SelectTrigger className="mb-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="Products">Products</SelectItem>
                        <SelectItem value="Events">Events</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea
                      placeholder="Post content"
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      className="mb-3"
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleCreatePost}>Post</Button>
                      <Button variant="outline" onClick={() => setShowNewPost(false)}>Cancel</Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                {posts.map(post => (
                  <ForumPost key={post.id} post={post} onReplyAdded={loadPosts} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="directory" className="mt-6">
              <MemberDirectory />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </VIPAccessGate>
  );
}
