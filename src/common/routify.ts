import { app } from "../app"

export const routify = async (): Promise<void> => {
  const children = new Bun.Glob("src/modules/**/**.ts").scan({
    absolute: true
  })

  for await (const path of children) {
    const { route } = await import(path)
    route(app)
  }
}
