---
'@primer/doctocat-nextjs': minor
---

Added support for generating [llms.txt](https://llmstxt.org/) at build time. This file will make your site's content easily discoverable by Agentic AI tools like GitHub Copilot.

To enable this feature, create `app/llms.txt/route.ts`:

```ts
import {generateLLMsTxt} from '@primer/doctocat-nextjs/llms'

export const dynamic = 'force-static'

export async function GET() {
  const content = await generateLLMsTxt()

  return new Response(content, {
    headers: {'Content-Type': 'text/plain; charset=utf-8'},
  })
}
```

Important: Ensure that `title`, `description` and `keyword` fields are populated in your contents frontmatter.
