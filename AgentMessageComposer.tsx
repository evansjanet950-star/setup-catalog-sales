import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Send, Languages, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface AgentMessageComposerProps {
  phoneNumber: string;
  targetLanguage: string;
  onMessageSent: () => void;
}

export default function AgentMessageComposer({ 
  phoneNumber, 
  targetLanguage,
  onMessageSent 
}: AgentMessageComposerProps) {
  const [message, setMessage] = useState('');
  const [translatedMessage, setTranslatedMessage] = useState('');
  const [translationQuality, setTranslationQuality] = useState(0);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  useEffect(() => {
    if (message.trim() && targetLanguage !== 'en') {
      const debounce = setTimeout(() => {
        translateMessage();
      }, 500);
      return () => clearTimeout(debounce);
    } else {
      setTranslatedMessage('');
      setTranslationQuality(0);
      setShowTranslation(false);
    }
  }, [message, targetLanguage]);

  const translateMessage = async () => {
    setIsTranslating(true);
    try {
      const { data, error } = await supabase.functions.invoke('translate-agent-message', {
        body: { message, targetLanguage, phoneNumber }
      });

      if (error) throw error;
      setTranslatedMessage(data.translatedMessage);
      setTranslationQuality(data.translationQuality);
      setShowTranslation(true);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    setIsSending(true);
    try {
      const messageToSend = targetLanguage === 'en' ? message : translatedMessage;
      
      // Store in database with both versions
      const { error: dbError } = await supabase
        .from('sms_conversations')
        .insert({
          customer_phone: phoneNumber,
          message_direction: 'outbound',
          message_body: messageToSend,
          original_message: message,
          translated_message: targetLanguage === 'en' ? null : translatedMessage,
          translation_quality: targetLanguage === 'en' ? null : translationQuality,
          was_translated: targetLanguage !== 'en',
          translation_language: targetLanguage,
          auto_response_sent: false
        });

      if (dbError) throw dbError;

      // Send SMS via Twilio
      await supabase.functions.invoke('send-sms-notification', {
        body: {
          to: phoneNumber,
          message: messageToSend
        }
      });

      setMessage('');
      setTranslatedMessage('');
      setShowTranslation(false);
      onMessageSent();
    } catch (error) {
      console.error('Send error:', error);
    } finally {
      setIsSending(false);
    }
  };

  const getQualityBadge = () => {
    if (translationQuality >= 0.9) {
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />High Quality</Badge>;
    } else if (translationQuality >= 0.7) {
      return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />Good</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Review Needed</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Your Message (English)</label>
          {targetLanguage !== 'en' && (
            <Badge variant="outline" className="text-xs">
              <Languages className="w-3 h-3 mr-1" />
              Auto-translate to {targetLanguage.toUpperCase()}
            </Badge>
          )}
        </div>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message in English..."
          className="min-h-[100px]"
        />
      </div>

      {showTranslation && translatedMessage && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">Translated Message</span>
            {getQualityBadge()}
          </div>
          <p className="text-sm text-blue-800">{translatedMessage}</p>
          {isTranslating && (
            <div className="flex items-center gap-2 mt-2 text-xs text-blue-600">
              <Loader2 className="w-3 h-3 animate-spin" />
              Translating...
            </div>
          )}
        </Card>
      )}

      <Button 
        onClick={sendMessage} 
        disabled={!message.trim() || isSending || (targetLanguage !== 'en' && !translatedMessage)}
        className="w-full"
      >
        {isSending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </>
        )}
      </Button>
    </div>
  );
}