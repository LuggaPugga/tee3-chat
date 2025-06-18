import { db } from "@/utils/instant"
import { Sparkles, Newspaper, Code, GraduationCap } from "lucide-react"
import { useState } from "react"

const categories = [
  {
    icon: Sparkles,
    label: "Create",
    questions: [
      "Write a short story about a robot discovering emotions",
      "Help me outline a sci-fi novel set in a post-apocalyptic world",
      "Create a character profile for a complex villain with sympathetic motives",
      "Give me 5 creative writing prompts for flash fiction",
    ],
  },
  {
    icon: Newspaper,
    label: "Explore",
    questions: [
      "Good books for fans of Rick Rubin",
      "Countries ranked by number of corgis",
      "Most successful companies in the world",
      "How much does Claude cost?",
    ],
  },
  {
    icon: Code,
    label: "Code",
    questions: [
      "Write code to invert a binary search tree in Python",
      "What's the difference between Promise.all and Promise.allSettled?",
      "Explain React's useEffect cleanup function",
      "Best practices for error handling in async/await",
    ],
  },
  {
    icon: GraduationCap,
    label: "Learn",
    questions: [
      "Beginner's guide to TypeScript",
      "Explain the CAP theorem in distributed systems",
      "Why is AI so expensive?",
      "Are black holes real?",
    ],
  },
]

const suggestedQuestions = [
  "How does AI work?",
  "Are black holes real?",
  'How many Rs are in the word "strawberry"?',
  "What is the meaning of life?",
]

export default function ChatWelcomeScreen({ setPrompt }: { setPrompt: (prompt: string) => void }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { data } = db.useQuery({
    preferences: {
      $: {
        limit: 1,
      },
    },
  })

  return (
    <div className="flex items-start justify-center">
      <div className="w-full space-y-6 px-2 pt-[calc(max(15vh,2.5rem))] duration-300 animate-in fade-in-50 zoom-in-95 sm:px-8">
        <h2 className="text-3xl font-semibold">
          How can I help you
          {data?.preferences.length && data.preferences.length > 0
            ? ", " + data.preferences[0].name
            : ""}
          ?
        </h2>

        <div className="flex flex-row flex-wrap gap-2.5 text-sm max-sm:justify-evenly">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.label}
                className={`justify-center whitespace-nowrap text-sm transition-colors
                 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
                  disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 
                  [&_svg]:shrink-0 ${selectedCategory === category.label ? "border-reflect button-reflect bg-[rgb(162,59,103)] font-semibold shadow hover:bg-[#d56698] active:bg-[rgb(162,59,103)] disabled:hover:bg-[rgb(162,59,103)] disabled:active:bg-[rgb(162,59,103)] dark:bg-primary/20 dark:hover:bg-pink-800/70 dark:active:bg-pink-800/40 disabled:dark:hover:bg-primary/20 disabled:dark:active:bg-primary/20 text-pink-50" : "bg-secondary/30 text-secondary-foreground/90 outline outline-1 outline-secondary/70 hover:bg-secondary"} h-9 flex items-center gap-1
                   rounded-xl px-5 py-2 font-semibold backdrop-blur-xl max-sm:size-16 max-sm:flex-col sm:gap-2 sm:rounded-full`}
                data-selected="false"
                onClick={() =>
                  setSelectedCategory(selectedCategory === category.label ? null : category.label)
                }
              >
                <Icon className="max-sm:block" />
                <div>{category.label}</div>
              </button>
            )
          })}
        </div>

        <div className="flex flex-col text-foreground">
          {selectedCategory
            ? categories
                .find((category) => category.label === selectedCategory)
                ?.questions.map((question, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 border-t border-secondary/40 py-1 first:border-none"
                  >
                    <button
                      onClick={() => setPrompt(question)}
                      className="w-full rounded-md py-2 text-left text-secondary-foreground hover:bg-secondary/50 sm:px-3"
                    >
                      <span>{question}</span>
                    </button>
                  </div>
                ))
            : suggestedQuestions.map((question, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 border-t border-secondary/40 py-1 first:border-none"
                >
                  <button
                    onClick={() => setPrompt(question)}
                    className="w-full rounded-md py-2 text-left text-secondary-foreground hover:bg-secondary/50 sm:px-3"
                  >
                    <span>{question}</span>
                  </button>
                </div>
              ))}
        </div>
      </div>
    </div>
  )
}
