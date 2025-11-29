import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { MessageSquare, AlertCircle, TrendingUp, TrendingDown, Minus, Languages, Eye, EyeOff } from 'lucide-react';
import AgentMessageComposer from './AgentMessageComposer';

interface Message {
  id: string;
  customer_phone: string;
  customer_email: string;
  message_direction: string;
  message_body: string;
  keyword_detected: string;
  sentiment_score: number;
  sentiment_label: string;
  auto_response_sent: boolean;
  escalated: boolean;
  detected_language: string;
  original_message?: string;
  translated_message?: string;
  translation_quality?: number;
  was_translated?: boolean;
  translation_language?: string;
  created_at: string;
}



interface Thread {
  phone: string;
  email: string;
  lastMessage: string;
  count: number;
  unread: number;
  sentiment: string;
  escalated: boolean;
}

export default function SMSResponseDashboard() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [customerLanguage, setCustomerLanguage] = useState('en');
  const [showOriginal, setShowOriginal] = useState<Record<string, boolean>>({});


  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedPhone) {
      loadMessages(selectedPhone);
    }
  }, [selectedPhone]);

  const loadConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('sms_conversations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const threadMap = new Map<string, Thread>();
      (data || []).forEach((msg: Message) => {
        const existing = threadMap.get(msg.customer_phone);
        if (!existing) {
          threadMap.set(msg.customer_phone, {
            phone: msg.customer_phone,
            email: msg.customer_email || '',
            lastMessage: msg.created_at,
            count: 1,
            unread: msg.message_direction === 'inbound' && !msg.auto_response_sent ? 1 : 0,
            sentiment: msg.sentiment_label || 'neutral',
            escalated: msg.escalated
          });
        } else {
          existing.count++;
          if (msg.message_direction === 'inbound' && !msg.auto_response_sent) {
            existing.unread++;
          }
          if (msg.escalated) existing.escalated = true;
        }
      });

      setThreads(Array.from(threadMap.values()));
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (phone: string) => {
    try {
      const { data, error } = await supabase
        .from('sms_conversations')
        .select('*')
        .eq('customer_phone', phone)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
      
      // Get customer's preferred language
      const { data: langData } = await supabase
        .from('customer_language_preferences')
        .select('preferred_language')
        .eq('phone_number', phone)
        .single();
      
      setCustomerLanguage(langData?.preferred_language || 'en');
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const toggleOriginalView = (messageId: string) => {
    setShowOriginal(prev => ({ ...prev, [messageId]: !prev[messageId] }));
  };

  const getQualityBadge = (quality?: number) => {
    if (!quality) return null;
    if (quality >= 0.9) {
      return <Badge className="bg-green-100 text-green-800 text-xs">High Quality</Badge>;
    } else if (quality >= 0.7) {
      return <Badge className="bg-yellow-100 text-yellow-800 text-xs">Good</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800 text-xs">Review Needed</Badge>;
    }
  };


  const getSentimentIcon = (sentiment: string) => {
    if (sentiment === 'positive') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (sentiment === 'negative') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getLanguageName = (code: string) => {
    const languages: Record<string, string> = {
      en: 'English',
      es: 'Español',
      fr: 'Français',
      de: 'Deutsch',
      zh: '中文'
    };
    return languages[code] || code;
  };

  const getLanguageColor = (code: string) => {
    const colors: Record<string, string> = {
      en: 'bg-blue-100 text-blue-800',
      es: 'bg-orange-100 text-orange-800',
      fr: 'bg-purple-100 text-purple-800',
      de: 'bg-green-100 text-green-800',
      zh: 'bg-red-100 text-red-800'
    };
    return colors[code] || 'bg-gray-100 text-gray-800';
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Conversations ({threads.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            {threads.map((thread) => (
              <div
                key={thread.phone}
                onClick={() => setSelectedPhone(thread.phone)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedPhone === thread.phone ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium">{thread.phone}</div>
                  {thread.escalated && <AlertCircle className="w-4 h-4 text-red-500" />}
                </div>
                {thread.email && (
                  <div className="text-sm text-gray-600 mb-2">{thread.email}</div>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {getSentimentIcon(thread.sentiment)}
                  <span>{thread.count} messages</span>
                  {thread.unread > 0 && (
                    <Badge variant="destructive" className="ml-auto">{thread.unread}</Badge>
                  )}
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>
            {selectedPhone ? `Conversation with ${selectedPhone}` : 'Select a conversation'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedPhone ? (
            <>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4 pr-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.message_direction === 'outbound' ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`max-w-[70%] rounded-lg p-3 ${
                        msg.message_direction === 'outbound'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <div className="text-sm mb-1">
                          {showOriginal[msg.id] && msg.original_message 
                            ? msg.original_message 
                            : msg.message_body}
                        </div>
                        <div className="flex items-center gap-2 text-xs opacity-70 flex-wrap">
                          <span>{new Date(msg.created_at).toLocaleString()}</span>
                          {msg.detected_language && (
                            <Badge className={`text-xs ${getLanguageColor(msg.detected_language)}`}>
                              {getLanguageName(msg.detected_language)}
                            </Badge>
                          )}
                          {msg.was_translated && (
                            <>
                              <Badge className="bg-purple-100 text-purple-800 text-xs">
                                <Languages className="w-3 h-3 mr-1" />
                                Translated
                              </Badge>
                              {getQualityBadge(msg.translation_quality)}
                            </>
                          )}
                        </div>
                      </div>
                      {msg.was_translated && msg.original_message && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleOriginalView(msg.id)}
                          className="mt-1 text-xs h-6"
                        >
                          {showOriginal[msg.id] ? (
                            <>
                              <Eye className="w-3 h-3 mr-1" />
                              Show Translation
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 mr-1" />
                              Show Original
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="border-t pt-4">
                <AgentMessageComposer
                  phoneNumber={selectedPhone}
                  targetLanguage={customerLanguage}
                  onMessageSent={() => loadMessages(selectedPhone)}
                />
              </div>
            </>
          ) : (
            <div className="h-[500px] flex items-center justify-center text-gray-400">
              Select a conversation to view messages
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
