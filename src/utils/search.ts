import { db } from "./instant"

export const search = (query: string) => {
  return db.useQuery({
    chats: {
      $: {
        where: {
          name: {
            $like: `%${query}%`,
          },
        },
      },
    },
  })
}
