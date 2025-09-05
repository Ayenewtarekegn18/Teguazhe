"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/layout/navbar"
import { Search, ChevronDown, MessageCircle, Mail, Phone } from "lucide-react"

const faqs = [
  {
    question: "How do I book a bus ticket?",
    answer:
      "You can book a bus ticket by searching for your route on our homepage, selecting your preferred bus, choosing seats, entering passenger details, and completing the payment through our secure Chapa payment gateway.",
  },
  {
    question: "Can I cancel my booking?",
    answer:
      "Yes, you can cancel your booking up to 2 hours before departure. Cancellation charges may apply depending on the timing of cancellation. You can cancel from your bookings page.",
  },
  {
    question: "How do I track my bus?",
    answer:
      "You can track your bus in real-time by going to the 'Track Bus' section and entering your booking ID, or by clicking the 'Track Bus' button in your booking details.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept all major payment methods through Chapa payment gateway including mobile money, bank transfers, and credit/debit cards.",
  },
  {
    question: "Can I change my seat after booking?",
    answer:
      "Seat changes are subject to availability and can be done up to 4 hours before departure. Additional charges may apply for premium seats.",
  },
  {
    question: "What if I miss my bus?",
    answer:
      "If you miss your bus, please contact our customer support immediately. Depending on the circumstances and ticket type, we may be able to reschedule you to the next available bus.",
  },
  {
    question: "Are there any baggage restrictions?",
    answer:
      "Each passenger is allowed one carry-on bag and one checked bag up to 20kg. Additional baggage charges apply for excess weight.",
  },
  {
    question: "How early should I arrive at the station?",
    answer:
      "We recommend arriving at the bus station at least 30 minutes before departure time to complete check-in and boarding procedures.",
  },
]

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [openItems, setOpenItems] = useState<string[]>([])

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleItem = (index: string) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index]))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground">
            Find answers to common questions about our bus booking service
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* FAQ List */}
        <div className="space-y-4 mb-12">
          {filteredFAQs.map((faq, index) => (
            <Collapsible
              key={index}
              open={openItems.includes(index.toString())}
              onOpenChange={() => toggleItem(index.toString())}
            >
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardTitle className="flex items-center justify-between text-left">
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          openItems.includes(index.toString()) ? "rotate-180" : ""
                        }`}
                      />
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No FAQs found matching your search.</p>
          </div>
        )}

        {/* Contact Support */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Still Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <MessageCircle className="h-6 w-6" />
                <span>Live Chat</span>
                <span className="text-xs text-muted-foreground">Available 24/7</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Mail className="h-6 w-6" />
                <span>Email Support</span>
                <span className="text-xs text-muted-foreground">support@transportai.com</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Phone className="h-6 w-6" />
                <span>Call Us</span>
                <span className="text-xs text-muted-foreground">+251-911-123456</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
