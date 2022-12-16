# Build stage
FROM node:18-alpine as builder
WORKDIR /app
# Set up pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate
# Install dependencies
COPY pnpm-lock.yaml ./
RUN pnpm fetch
ADD package.json ./
RUN pnpm install --offline
# Build
COPY . ./
RUN pnpm build

# Run stage
FROM node:18-alpine as runner
WORKDIR /app
# Set up pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate
# Install dependencies
COPY pnpm-lock.yaml ./
RUN pnpm fetch --prod
# Copy necessary files to run the app
COPY --from=builder /app/package.json ./
RUN pnpm install --offline --prod
COPY --from=builder /app/dist/ ./dist
# Run the app
EXPOSE 8080
CMD [ "node", "dist/bin.js" ]
