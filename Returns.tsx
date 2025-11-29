import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function Returns() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Return & Exchange Policy</h1>
          <h2 className="text-2xl font-semibold text-[#FF1FB8] mb-8">We Don't Do Drama — But We Do Replacements</h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              All of our items are made to order, so we can't accept returns for sizing issues or buyer's remorse. But if your item shows up with a defect or damage, contact us within 7 days and we'll make it right.
            </p>

            <h3 className="text-xl font-semibold mb-4">To qualify for a replacement:</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-8">
              <li>Send a photo of the issue to: <a href="mailto:support@wedonotcareclub.com" className="text-[#FF1FB8] hover:underline">support@wedonotcareclub.com</a></li>
              <li>Include your order number in the subject line</li>
              <li>We'll confirm and ship a replacement item ASAP</li>
            </ul>

            <div className="bg-gray-50 border-l-4 border-[#FF1FB8] p-6 rounded">
              <p className="font-semibold mb-2">Important Note:</p>
              <p className="text-gray-600">
                We are not responsible for incorrect shipping info entered at checkout.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
