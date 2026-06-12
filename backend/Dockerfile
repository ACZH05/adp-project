FROM node:24-alpine

WORKDIR /src

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm dlx prisma generate


CMD ["pnpm", "run", "start:dev"]
