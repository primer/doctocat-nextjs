---
'@primer/doctocat-nextjs': minor
---

Upgraded internal framework to [Nextra v3](https://the-guild.dev/blog/nextra-3).

To migrate Doctocat to this release, follow these steps:

1. Install the latest version `npm i @primer/doctocat-nextjs@0.1.0`
2. Rename your `next.config.js` to be `next.config.mjs`. Add `type="module"` to your `package.json` and update the file contents to match the following:

```diff
-  const withDoctocat = require('@primer/doctocat-nextjs/doctocat.config.js')

-  module.exports = {
-  ...withDoctocat({

-  }),
-  }

+  import withDoctocat from '@primer/doctocat-nextjs/doctocat.config.js'

+  export default {
+  ...withDoctocat({

+  }),
+  }

```
