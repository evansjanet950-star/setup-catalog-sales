import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 1-2 business days.",
    });
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Let's Stay Unapologetic — Reach Out!</h1>
          <p className="text-gray-600 mb-8">
            Whether you have a question, a collab idea, or just want to say you love our bold designs, we'd love to hear from you.
          </p>
          <p className="text-gray-600 mb-12">
            Drop us a message and we'll get back to you (when we feel like it… just kidding — within 1–2 business days).
          </p>

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
                <Textarea
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={6}
                  required
                />
                <Button type="submit" className="w-full bg-[#FF1FB8] hover:bg-[#EC1CD3]">
                  Send Message
                </Button>
              </form>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-6">Contact Info</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <a href="mailto:support@wedonotcareclub.com" className="text-[#FF1FB8] hover:underline">
                    support@wedonotcareclub.com
                  </a>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Instagram</h3>
                  <a href="https://instagram.com/wedonotcareclub" target="_blank" rel="noopener noreferrer" className="text-[#FF1FB8] hover:underline">
                    @wedonotcareclub
                  </a>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Business Address</h3>
                  <p className="text-gray-600">Victoria, BC, Canada</p>
                  <p className="text-sm text-gray-500 mt-1">(We're online-only and proudly independent)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
