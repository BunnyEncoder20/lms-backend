# Stage 1: development (hot reload)
FROM node:20-alpine AS development
WORKDIR /usr/src/app
COPY package*.json ./
COPY prisma ./prisma
RUN npm install
RUN npx prisma generate
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# Stage 2: build
FROM node:20-alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
COPY prisma ./prisma
RUN npm install
RUN npx prisma generate
COPY . .
RUN npm run build

# Stage 3: production runtime
FROM node:20-alpine AS production
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package*.json ./
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
