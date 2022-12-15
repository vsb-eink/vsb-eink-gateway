# Build stage
FROM node:18-alpine as builder
WORKDIR /app
# Set up pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate
# Install dependencies
COPY pnpm-lock.yaml ./
RUN pnpm fetch --dev
ADD package.json ./
RUN pnpm install --offline --dev
# Build
COPY . ./
RUN pnpm build

# Run stage
FROM node:18-alpine
WORKDIR /app
# Set up pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate
# Install dependencies
COPY pnpm-lock.yaml ./
RUN pnpm fetch --prod
# Copy source code
COPY --from=builder /app ./
RUN pnpm install --offline --prod
# Run the app
EXPOSE 8080
CMD [ "node", "dist/bin.js" ]
