docker exec -it mongo-replica mongosh -u glauy -p glauy520 --authenticationDatabase admin

git branch -M main
git remote add origin git@github.com:Glauy/emojis-app.git

Deploying your app to serverless or edge functions?

$ npx prisma generate
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma

✔ Generated Prisma Client (v5.14.0) to .\node_modules\@prisma\client in 108ms

Start using Prisma Client in Node.js (See: https://pris.ly/d/client)

```
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
```

or start using Prisma Client at the edge (See: https://pris.ly/d/accelerate)

```
import { PrismaClient } from '@prisma/client/edge'
const prisma = new PrismaClient()
```

See other ways of importing Prisma Client: http://pris.ly/d/importing-client

┌─────────────────────────────────────────────────────────────┐
│ Deploying your app to serverless or edge functions? │
│ Try Prisma Accelerate for connection pooling and caching. │
│ https://pris.ly/cli/--accelerate │
└─────────────────────────────────────────────────────────────┘
