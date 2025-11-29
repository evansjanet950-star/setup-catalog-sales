import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function FAQ() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
          
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                Do you really print everything on demand?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Yes! Every item is made to order just for you. That means less waste, less mass production, and more uniqueness.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                How long does shipping take?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Most items ship within 2–5 business days, and then it's over to your local delivery carrier. Expect your item within 7–10 business days in North America.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                Can I return something if I change my mind?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Since each product is custom made, we don't accept returns for buyer's remorse — but if your item arrives damaged or defective, we'll replace it, no questions asked.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                Where are your products made?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                We partner with trusted North American print providers via Printify. Some items may ship from the US or Canada depending on your location.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
      <Footer />
    </div>
  );
}
