export const generateChatNamePrompt = `
Create a short, concise human readable name (maximum 50 characters) that summarizes the following message. Return only the name, no quotes or explanation. It will be used in the UI as the chat name.
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
