import { useState } from 'react';

export default function SalesScripts({ isOpen, onClose }) {
  const [scriptsCategory, setScriptsCategory] = useState('');
  const [scriptsType, setScriptsType] = useState('');
  const [selectedScript, setSelectedScript] = useState(null);

  const salesScripts = {
    calling: {
      cold_call: [
        {
          label: 'Direct & Professional',
          script: `"Hi [Name], this is [Your Name] from Kinect B2B. I help businesses like yours generate qualified appointments with decision-makers in your target market. Do you have 2 minutes for me to explain how we're different from typical lead generation services?"

[Wait for response]

"Great! Unlike other services that just give you lists of contacts, we actually do the calling, emailing, and follow-up for you. We book qualified appointments directly into your calendar with people who are genuinely interested in what you offer. Our clients typically see 5-25 new appointments per month, depending on their package. Does that sound like something that could help your business?"`
        },
        {
          label: 'Casual & Conversational',
          script: `"Hey [Name], this is [Your Name] with Kinect B2B. Quick question - are you the person who handles new business development at [Company]?"

[Wait for response]

"Perfect! So here's why I'm calling... We specialize in getting businesses like yours in front of qualified prospects who actually want to talk. Basically, we handle all the cold calling and follow-up, and you just show up to the appointments we book for you. How does your team currently handle outbound sales?"`
        },
        {
          label: 'Problem-Focused',
          script: `"Hi [Name], [Your Name] calling from Kinect B2B. I'm reaching out because most business owners I talk to tell me they hate cold calling but they know they need more appointments. Sound familiar?"

[Wait for response]

"That's exactly what we solve. We become your outbound sales team - making thousands of calls, sending emails, and following up - all to book qualified appointments for you. You never have to cold call again. Can I take 90 seconds to explain how it works?"`
        }
      ],
      first_time: [
        {
          label: 'Warm Introduction',
          script: `"Hi [Name], this is [Your Name] from Kinect B2B calling back. Thanks for showing interest in our appointment setting services. I wanted to personally reach out and learn more about your business to see if we'd be a good fit to work together.

First, tell me - what does your ideal client look like? Who are you trying to get in front of?"

[Listen and take notes]

"Perfect. And how are you currently generating appointments or leads? What's working and what's not working?"

[Based on their answers, present the appropriate Pro Plan package]`
        },
        {
          label: 'Discovery Call',
          script: `"Hi [Name], [Your Name] here from Kinect B2B. I'm calling to learn more about your business and see how we might be able to help you grow. I have a few questions that will help me understand your situation better.

1. What industry are your ideal clients in?
2. What geographic area are you targeting?
3. Who are the decision-makers you need to reach?
4. What's your current monthly revenue goal from new clients?
5. How many new appointments per month would make a real difference for you?

[After gathering info]

Based on what you've shared, I think our [Pro Plan X] would be perfect for you. Let me explain why..."`
        },
        {
          label: 'Value-First Approach',
          script: `"Hi [Name], thanks for taking my call. Before I tell you anything about Kinect B2B, I want to make sure I understand your business and goals. That way, I can give you real value on this call, whether we end up working together or not.

What's your biggest challenge right now when it comes to getting new clients?"

[Listen deeply]

"Got it. And if you could wave a magic wand, what would your ideal client acquisition process look like?"

[Take notes]

"Here's what I'm thinking based on what you've told me..." [Present tailored solution]`
        }
      ],
      three_day_followup: [
        {
          label: 'Checking In',
          script: `"Hi [Name], this is [Your Name] from Kinect B2B. I wanted to follow up on our conversation from a few days ago about getting you more qualified appointments. Have you had a chance to think about what we discussed?"

[Wait for response]

"I completely understand. Let me ask you this - what's the biggest thing holding you back from moving forward? Is it the investment, timing, or are you just not sure it will work for your business?"

[Address their concern directly]

"Here's what I'd suggest - let's start with [specific plan] for 90 days. That gives you enough time to see real results without a huge commitment. How does that sound?"`
        },
        {
          label: 'Adding Value',
          script: `"Hey [Name], [Your Name] calling from Kinect B2B. Since we talked the other day, I've been thinking about your business and I had a couple ideas I wanted to share with you.

Based on your target market in [industry], I think we could really crush it for you if we focus on [specific strategy]. I've seen this work incredibly well for similar businesses.

Are you free for a quick 10-minute call to discuss this approach?"`
        },
        {
          label: 'Creating Urgency',
          script: `"Hi [Name], [Your Name] with Kinect B2B. I'm following up because I wanted to let you know - we're currently onboarding 3 new clients next week and after that, we won't have capacity to take on new projects until [date].

I remember you mentioned wanting to [their specific goal]. If that's still a priority, I'd love to get you locked in for our next onboarding session. We can have your campaign live and generating appointments within 10 business days.

What do you think - should I reserve a spot for you?"`
        }
      ],
      seven_day_followup: [
        {
          label: 'Re-engagement',
          script: `"Hi [Name], it's [Your Name] from Kinect B2B. I know it's been about a week since we last talked. I wanted to reach out one more time because I genuinely believe we can help you hit your growth goals.

Quick question - what would need to happen for this to become a priority for you? Is there something specific I can answer or clarify?"

[Listen carefully]

"I appreciate that. Here's what I'd suggest..." [Offer a specific next step]`
        },
        {
          label: 'Case Study Approach',
          script: `"Hey [Name], [Your Name] calling from Kinect B2B. I wanted to share something with you that I think you'll find interesting.

We just closed out a campaign for a client in [similar industry], and the results were incredible. They were skeptical at first, just like you, but within 60 days we booked them 18 qualified appointments that resulted in 5 new clients worth $47,000 in revenue.

The reason I'm calling is because your situation is almost identical to theirs. I think we could get you similar results. Want to hear how we did it?"`
        },
        {
          label: 'Last Chance',
          script: `"Hi [Name], [Your Name] with Kinect B2B. I'm calling one last time because I don't want you to miss out on this opportunity. After this call, I'll assume you're not interested and I won't bug you anymore - I promise.

But before I close your file, I have to ask - what's really stopping you? Because from everything you told me, this seems like exactly what you need to [achieve their stated goal].

Be honest with me - what's the real objection?"

[Have a genuine conversation and address the core issue]`
        }
      ],
      call_to_action: [
        {
          label: 'Direct Close',
          script: `"So [Name], based on everything we've discussed, I think [Pro Plan X] is perfect for your needs. It will get you [specific number] qualified appointments over the next 12 months, which based on your close rate, should result in [X] new clients and $[X] in revenue.

The investment is $[X]/month, or if you pay annually, it's $[X] which saves you one full month. Which payment option works better for you?"

[Assumptive close - assume they're ready to move forward]`
        },
        {
          label: 'Trial Close',
          script: `"Let me ask you this, [Name] - if we could guarantee you [X] appointments per month with your ideal clients, and you knew for certain that at least [X] of them would turn into paying customers, would you want to move forward today?"

[Wait for response]

"Great! That's exactly what we do. Let me show you how we can get started..."`
        },
        {
          label: 'Risk Reversal',
          script: `"Here's what I want to do for you, [Name]. Let's get you started with [specific plan] today. We'll run your campaign for 90 days. If by day 90 you haven't gotten at least [X] qualified appointments, I'll personally refund your setup fee and we'll part as friends.

But here's what I know will happen - you're going to get way more than [X] appointments, you're going to close deals, and in 6 months you're going to wish you started sooner.

So let's get this rolling. I can have everything set up by [date]. All I need from you is..."`
        }
      ],
      voicemail: [
        {
          label: 'Short & Intriguing',
          script: `"Hi [Name], this is [Your Name] from Kinect B2B. I have a quick question about your business that I think you'll find interesting. Give me a call back at [your number]. Again, that's [Your Name] at [number]. Looking forward to talking with you."`
        },
        {
          label: 'Value Proposition',
          script: `"Hey [Name], [Your Name] calling from Kinect B2B. We specialize in booking qualified appointments for businesses like yours - basically, we do all the cold calling so you don't have to. I wanted to see if this is something you'd be interested in exploring. Call me back at [number]. Thanks!"`
        },
        {
          label: 'Referral Voicemail',
          script: `"Hi [Name], this is [Your Name] with Kinect B2B. I was speaking with [Referral Name] and they suggested I reach out to you about how we're helping businesses in [industry] get more qualified appointments. Give me a call when you have a chance - [number]. Looking forward to connecting!"`
        }
      ]
    },
    texting: {
      cold_text: [
        {
          label: 'Permission-Based',
          script: `"Hi [Name], this is [Your Name] from Kinect B2B. I know this is out of the blue, but I help businesses like [Company] get more qualified appointments. Is it okay if I send you a quick message about how we do it?"`
        },
        {
          label: 'Direct & Brief',
          script: `"Hey [Name] - [Your Name] here from Kinect B2B. We book qualified sales appointments for businesses like yours. Interested in learning more? I can send you some quick info or we can hop on a brief call."`
        },
        {
          label: 'Question Hook',
          script: `"Hi [Name], quick question - is [Company] currently using any appointment setting services? We're helping similar businesses book 10-20 qualified appointments per month. Worth a conversation?"`
        }
      ],
      first_time: [
        {
          label: 'Thank You Follow-Up',
          script: `"Hi [Name], thanks for taking my call earlier! As promised, here's a quick overview: [Link to one-pager or video]. Let me know if you have any questions. Happy to jump on another call to discuss further!"`
        },
        {
          label: 'Meeting Confirmation',
          script: `"Hey [Name], confirming our call for [date/time]. I'll give you a ring at [phone number]. Looking forward to learning more about [Company] and seeing if we can help you grow!"`
        },
        {
          label: 'Resource Share',
          script: `"Hi [Name], I wanted to send you this case study from a client in [similar industry]. They went from 0 to 15 qualified appointments per month in 90 days. Thought you might find it interesting: [Link]"`
        }
      ],
      three_day_followup: [
        {
          label: 'Gentle Nudge',
          script: `"Hey [Name], just wanted to check in! Have you had a chance to think about what we discussed? Any questions I can answer for you?"`
        },
        {
          label: 'Value Add',
          script: `"Hi [Name], been thinking about your goals with [specific objective]. Had an idea I wanted to share. Got 5 minutes for a quick call?"`
        },
        {
          label: 'Simple Check-In',
          script: `"[Name] - [Your Name] here. Following up on our chat. Still interested in booking more appointments? Let's get something on the calendar to discuss next steps."`
        }
      ],
      seven_day_followup: [
        {
          label: 'Re-Engagement',
          script: `"Hi [Name], I know it's been a week since we talked. Still interested in learning how we can get you more qualified appointments? If not, totally fine - just let me know so I don't keep bothering you! 😊"`
        },
        {
          label: 'New Angle',
          script: `"Hey [Name], just wrapped up a campaign for another [industry] business. Results were amazing - 23 appointments in 2 months. Made me think of you. Want to see what we did?"`
        },
        {
          label: 'Final Attempt',
          script: `"[Name] - Last message, I promise! 😊 Just wanted to make sure this opportunity to grow your business didn't slip through the cracks. Should I close your file or is there still interest?"`
        }
      ],
      call_to_action: [
        {
          label: 'Ready to Start',
          script: `"[Name], based on our conversation, I think you're ready to move forward with [Pro Plan X]. I can have everything set up by [date]. Want me to send over the agreement and get you on the schedule?"`
        },
        {
          label: 'Limited Time Offer',
          script: `"Hey [Name], quick heads up - we're offering a discount on setup fees for clients who sign up this week ($349 → $249). Want to take advantage of this? We'd need to get started by Friday."`
        },
        {
          label: 'Simple Ask',
          script: `"[Name], you in? I think [Pro Plan X] is perfect for you. Let's get this rolling! I can send the agreement over now."`
        }
      ]
    },
    emailing: {
      cold_email: [
        {
          label: 'Professional & Direct',
          script: `Subject: Quick question about [Company]'s growth

Hi [Name],

I help businesses like [Company] generate qualified appointments with decision-makers in [industry].

Most of our clients come to us because:
- They're tired of cold calling
- Their team is too busy to prospect
- They want more predictable pipeline

We handle all the outreach and book appointments directly into your calendar with prospects who are actually interested in what you offer.

Worth a conversation?

Best,
[Your Name]
Kinect B2B
[Phone] | [Email]`
        },
        {
          label: 'Problem-Solution',
          script: `Subject: Struggling to get meetings with [Target Market]?

Hi [Name],

If you're like most business owners I talk to, getting in front of the right prospects is one of your biggest challenges.

What if you had a team making 1,000+ calls per month on your behalf, booking qualified appointments directly into your calendar?

That's exactly what we do at Kinect B2B.

Our clients typically see:
• 10-25 qualified appointments per month
• 50%+ show-up rate
• Appointments with actual decision-makers

Want to learn more? Let's schedule a 15-minute call.

[Calendar Link]

Thanks,
[Your Name]`
        },
        {
          label: 'Curiosity Hook',
          script: `Subject: [Name], thought of you

Hi [Name],

I came across [Company] and had a thought I wanted to share.

We recently helped a business similar to yours go from 2 sales meetings per month to 18. The difference? They stopped doing their own outreach and let us handle it.

Interested in learning how?

I'll keep this short - here's a 2-minute video explaining what we do:
[Video Link]

Let me know if you want to chat.

[Your Name]
Kinect B2B`
        }
      ],
      first_time: [
        {
          label: 'Post-Call Follow-Up',
          script: `Subject: Great talking with you, [Name]

Hi [Name],

Thanks for taking the time to speak with me today. I enjoyed learning about [Company] and your goals for [specific objective].

As discussed, here's what I recommend:

[Pro Plan X] - $[X]/month
• [X] Businesses Targeted (yearly)
• [X] Guaranteed Appointments
• Dedicated Account Manager
• Custom Client Portal

Next Steps:
1. Review the attached proposal
2. Schedule a setup call if you have questions
3. Let me know if you want to move forward

I'm confident we can help you achieve [their goal]. Let's get started!

Best,
[Your Name]
[Phone] | [Calendar Link]`
        },
        {
          label: 'Meeting Recap',
          script: `Subject: Recap of our conversation

Hi [Name],

Quick recap from our call:

✓ You're looking to get more appointments with [target market]
✓ Current challenge: [specific pain point]
✓ Goal: [X] new clients per month

What we discussed:
• Our [Pro Plan X] package
• $[X]/month investment
• Expected [X] appointments per month
• 90-day timeline to see results

I've attached:
1. Detailed proposal
2. Case study from similar client
3. Service agreement

Ready to move forward? Let's schedule your setup call: [Calendar Link]

Questions? Just reply to this email.

Thanks,
[Your Name]`
        },
        {
          label: 'Resource Send',
          script: `Subject: Resources from our call

Hi [Name],

As promised, here are the materials I mentioned:

📄 Case Study: How [Similar Company] got 23 appointments in 60 days
📊 ROI Calculator: See your potential return
📞 Client Testimonials: What others are saying

[Links to resources]

I also wanted to share this quick video that breaks down exactly how our process works: [Video Link]

Let me know when you're ready to get started. I can have your campaign live within 10 business days.

Best,
[Your Name]
[Phone] | [Email]`
        }
      ],
      three_day_followup: [
        {
          label: 'Checking In',
          script: `Subject: Following up - [Company] + Kinect B2B

Hi [Name],

Just wanted to check in on our conversation from earlier this week.

Have you had a chance to review the proposal? Any questions I can answer?

I'm here to help if you need any clarification on:
• Pricing and packages
• How the process works
• Expected timeline and results
• Case studies from your industry

Let me know!

Best,
[Your Name]`
        },
        {
          label: 'Adding Value',
          script: `Subject: Thought you'd find this interesting

Hi [Name],

I was reviewing your situation and wanted to share something that might help.

Based on what you told me about [specific goal], I put together a quick strategy outline for how we'd approach your campaign: [Attached]

This shows:
• Target market breakdown
• Outreach cadence
• Expected appointment volume
• 90-day timeline

No obligation - just wanted to give you a clear picture of what working together would look like.

Thoughts?

[Your Name]`
        },
        {
          label: 'Question Follow-Up',
          script: `Subject: Quick question

Hi [Name],

Quick question - what's holding you back from moving forward?

Is it:
a) The investment?
b) Not sure if it will work?
c) Need to run it by someone else?
d) Just not the right time?

Let me know and I can address whatever's on your mind.

Thanks,
[Your Name]`
        }
      ],
      seven_day_followup: [
        {
          label: 'Last Attempt',
          script: `Subject: Should I close your file?

Hi [Name],

I haven't heard back from you, so I'm assuming you're either:

a) Too busy to think about this right now
b) Decided to go a different direction
c) My emails are going to spam 😊

If it's (c), just reply "interested" and I'll give you a call.

If it's (a) or (b), no worries at all - just let me know so I can close your file and stop bothering you!

Either way, I appreciate your time.

Best,
[Your Name]`
        },
        {
          label: 'New Case Study',
          script: `Subject: New results I wanted to share

Hi [Name],

I know it's been a week since we talked, but I wanted to share something with you.

We just finished up a 90-day campaign for [Company in similar industry] and the results were incredible:

• 31 qualified appointments booked
• 8 new clients signed
• $67,000 in new revenue
• 5.8x ROI on their investment

I'm reaching out because their situation was almost identical to yours. Same industry, similar target market, even similar revenue goals.

If they can do it, so can you.

Still interested?

[Your Name]`
        },
        {
          label: 'Re-Engagement',
          script: `Subject: [Name], one more time...

Hi [Name],

I promise this is my last email (unless you reply, of course!).

I genuinely believe Kinect B2B can help [Company] grow. We've helped dozens of businesses in [industry] book more appointments and close more deals.

But I also respect that timing might not be right, or you might have other priorities.

So here's my ask: Just reply with one of these:

1. "Interested" - I'll call you and we'll talk
2. "Later" - I'll follow up in [30/60/90] days
3. "Not interested" - I'll never bother you again

Fair enough?

Thanks for your time,
[Your Name]`
        }
      ],
      call_to_action: [
        {
          label: 'Direct Close',
          script: `Subject: Ready to get started?

Hi [Name],

Based on our conversations, I think you're ready to move forward with [Pro Plan X].

Here's what happens next:

1. Sign the attached agreement (takes 2 minutes)
2. Schedule your setup call: [Calendar Link]
3. We launch your campaign within 10 business days
4. You start getting appointments booked into your calendar

Your investment: $[X]/month (or $[X]/year to save $[X])

Expected results: [X] qualified appointments over 12 months

Ready? Just reply "Let's do it" and I'll get everything rolling.

Looking forward to working together!

[Your Name]
[Phone]`
        },
        {
          label: 'Limited Time Offer',
          script: `Subject: Special offer for [Company] - Ends Friday

Hi [Name],

I wanted to give you a heads up on something.

We're offering a discount on setup fees this week only:

Regular: $349 setup fee
This Week: $199 setup fee
Savings: $150

If you want to take advantage of this, we need to get started by Friday.

Interested? Here's what to do:

1. Reply to this email
2. Sign the agreement I send over
3. Schedule your setup call

Don't miss out on this - I want to see you succeed!

Best,
[Your Name]`
        },
        {
          label: 'Simple & Direct',
          script: `Subject: Let's do this

Hi [Name],

I think we've talked enough. You know what we do, you know the investment, and you know the results you can expect.

So... you in?

If yes, just reply "YES" and I'll send over the agreement today.

If no, that's cool too - just let me know.

But I really think we can help [Company] grow.

Your move!

[Your Name]`
        }
      ]
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Script copied to clipboard!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 flex justify-between items-center">
          <h3 className="text-2xl font-black">📞 Sales Scripts</h3>
          <button
            onClick={onClose}
            className="text-3xl hover:bg-white/20 w-10 h-10 rounded-full transition"
          >
            ×
          </button>
        </div>

        <div className="p-6 max-h-[calc(90vh-100px)] overflow-y-auto">
          {/* Category Selection */}
          {!scriptsCategory && (
            <div>
              <h4 className="text-xl font-black text-gray-900 mb-4">Choose Category</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => setScriptsCategory('calling')}
                  className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl hover:shadow-lg transition"
                >
                  <div className="text-4xl mb-2">📞</div>
                  <p className="font-black text-blue-900">Calling Scripts</p>
                  <p className="text-sm text-gray-600">Cold calls, follow-ups, closings</p>
                </button>
                <button
                  onClick={() => setScriptsCategory('texting')}
                  className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl hover:shadow-lg transition"
                >
                  <div className="text-4xl mb-2">💬</div>
                  <p className="font-black text-green-900">Texting Scripts</p>
                  <p className="text-sm text-gray-600">SMS templates & follow-ups</p>
                </button>
                <button
                  onClick={() => setScriptsCategory('emailing')}
                  className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-xl hover:shadow-lg transition"
                >
                  <div className="text-4xl mb-2">📧</div>
                  <p className="font-black text-purple-900">Email Scripts</p>
                  <p className="text-sm text-gray-600">Cold emails & campaigns</p>
                </button>
              </div>
            </div>
          )}

          {/* Type Selection */}
          {scriptsCategory && !scriptsType && (
            <div>
              <button
                onClick={() => setScriptsCategory('')}
                className="mb-4 text-gray-600 hover:text-gray-900 font-semibold"
              >
                ← Back to Categories
              </button>
              <h4 className="text-xl font-black text-gray-900 mb-4">
                Choose Script Type
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.keys(salesScripts[scriptsCategory]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setScriptsType(type)}
                    className="p-4 bg-gray-50 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-left transition"
                  >
                    <p className="font-bold text-gray-900 capitalize">
                      {type.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-gray-600">
                      {salesScripts[scriptsCategory][type].length} variations
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Script Selection */}
          {scriptsCategory && scriptsType && !selectedScript && (
            <div>
              <button
                onClick={() => setScriptsType('')}
                className="mb-4 text-gray-600 hover:text-gray-900 font-semibold"
              >
                ← Back to Types
              </button>
              <h4 className="text-xl font-black text-gray-900 mb-4 capitalize">
                {scriptsType.replace(/_/g, ' ')} Scripts
              </h4>
              <div className="space-y-3">
                {salesScripts[scriptsCategory][scriptsType].map((script, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedScript(script)}
                    className="w-full p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg hover:shadow-lg text-left transition"
                  >
                    <p className="font-bold text-blue-900">{script.label}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{script.script}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Script View */}
          {selectedScript && (
            <div>
              <button
                onClick={() => setSelectedScript(null)}
                className="mb-4 text-gray-600 hover:text-gray-900 font-semibold"
              >
                ← Back to Scripts
              </button>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-6">
                <h4 className="text-2xl font-black text-blue-900 mb-4">
                  {selectedScript.label}
                </h4>
                <div className="bg-white rounded-lg p-6 mb-4 whitespace-pre-wrap font-mono text-sm">
                  {selectedScript.script}
                </div>
                <button
                  onClick={() => copyToClipboard(selectedScript.script)}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-indigo-700"
                >
                  📋 Copy to Clipboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}