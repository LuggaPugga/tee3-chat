export const generateChatNamePrompt = `
You are tasked with generating a concise and relevant chat name based on the initial message of a conversation. This chat name should capture the essence of the conversation's topic or purpose.

Here is the initial message of the chat:
<initial_message>
{{INITIAL_MESSAGE}}
</initial_message>

Follow these guidelines to generate an appropriate chat name:

1. Identify the main topic or purpose of the message.
2. Keep the chat name short and concise, ideally 2-5 words.
3. Use key words or phrases from the message if appropriate.
4. Avoid using personal names or sensitive information.
5. Make the chat name descriptive and easy to understand.
6. If the message is a greeting or doesn't have a clear topic, use a generic name like "New Conversation" or "General Chat".

Provide your only the generated chat name within. Do not include any explanation or additional text.
`

export const systemPrompt = `
You are a helpful assistant. Respond to the user in Markdown format.
`

export const namePrompt = `
The User's name is {{user_name}}.
`

export const traitsPrompt = `
The user's traits are {{traits}}.
Always use these traits to tailor your responses to the user.
`

export const whatDoYouDoPrompt = `
The user's wants you to know they are positioned as:
{{what_do_you_do}}.
`

export const knowledgePrompt = `
The user's want's you to know {{knowledge}}.
`

export const promptBuilder = (
  user_name?: string,
  traits?: string,
  what_do_you_do?: string,
  knowledge?: string
) => {
  let prompt = systemPrompt

  if (user_name) {
    prompt += `\n${namePrompt.replace("{{user_name}}", user_name)}`
  }

  if (traits) {
    prompt += `\n${traitsPrompt.replace("{{traits}}", traits)}`
  }

  if (what_do_you_do) {
    prompt += `\n${whatDoYouDoPrompt.replace("{{what_do_you_do}}", what_do_you_do)}`
  }

  if (knowledge) {
    prompt += `\n${knowledgePrompt.replace("{{knowledge}}", knowledge)}`
  }

  return prompt
}
