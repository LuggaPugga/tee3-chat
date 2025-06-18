import { Mail, MessageSquare, Bug, Lightbulb, Send } from "lucide-react"

export default function Contact() {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Contact Us</h2>
        <p className="text-muted-foreground">
          Get help, report issues, or share feedback with our team.
        </p>

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Quick Actions</h3>
              <div className="space-y-3">
                <button className="flex items-center gap-3 w-full p-4 border rounded-lg hover:bg-accent text-left">
                  <Bug className="h-6 w-6 text-red-500" />
                  <div>
                    <h4 className="font-medium">Report a Bug</h4>
                    <p className="text-sm text-muted-foreground">
                      Found something broken? Let us know!
                    </p>
                  </div>
                </button>

                <button className="flex items-center gap-3 w-full p-4 border rounded-lg hover:bg-accent text-left">
                  <Lightbulb className="h-6 w-6 text-yellow-500" />
                  <div>
                    <h4 className="font-medium">Feature Request</h4>
                    <p className="text-sm text-muted-foreground">
                      Suggest new features or improvements
                    </p>
                  </div>
                </button>

                <button className="flex items-center gap-3 w-full p-4 border rounded-lg hover:bg-accent text-left">
                  <MessageSquare className="h-6 w-6 text-blue-500" />
                  <div>
                    <h4 className="font-medium">General Support</h4>
                    <p className="text-sm text-muted-foreground">
                      Need help with using the platform?
                    </p>
                  </div>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-medium">Email Support</h4>
                    <p className="text-sm text-muted-foreground">support@t3chat.com</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Response Times</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Pro users: Within 4 hours</p>
                    <p>• Free users: Within 24 hours</p>
                    <p>• Critical issues: Within 1 hour</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Send us a Message</h3>
            <form className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <select className="w-full p-2 border rounded-md bg-background">
                    <option>General Question</option>
                    <option>Bug Report</option>
                    <option>Feature Request</option>
                    <option>Billing Issue</option>
                    <option>Technical Support</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <select className="w-full p-2 border rounded-md bg-background">
                    <option>Low</option>
                    <option selected>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <textarea
                  className="w-full p-3 border rounded-md bg-background min-h-[120px]"
                  placeholder="Describe your issue or question in detail..."
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-input" />
                  <span className="text-sm">Include system information for debugging</span>
                </label>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                  Send Message
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Resources</h3>
            <div className="grid gap-3 md:grid-cols-3">
              <a
                href="#"
                className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">?</span>
                </div>
                <div>
                  <h4 className="font-medium">FAQ</h4>
                  <p className="text-sm text-muted-foreground">Common questions</p>
                </div>
              </a>

              <a
                href="#"
                className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 text-sm font-medium">📖</span>
                </div>
                <div>
                  <h4 className="font-medium">Documentation</h4>
                  <p className="text-sm text-muted-foreground">User guides</p>
                </div>
              </a>

              <a
                href="#"
                className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 dark:text-purple-400 text-sm font-medium">
                    💬
                  </span>
                </div>
                <div>
                  <h4 className="font-medium">Community</h4>
                  <p className="text-sm text-muted-foreground">Discord server</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
