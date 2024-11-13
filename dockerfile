# Build Stage
FROM node:20-alpine AS BUILD_IMAGE
# ARG NEXT_PUBLIC_HOST

# ENV NEXT_PUBLIC_HOST=${NEXT_PUBLIC_HOST}
# ARG NEXT_PUBLIC_API_KEY

# ENV NEXT_PUBLIC_API_KEY=${NEXT_PUBLIC_API_KEY}

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# RUN npx sonarqube-scanner
# RUN  rm -rf ./.scannerwork
RUN npm run build


# Production Stage
FROM node:20-alpine AS PRODUCTION_STAGE
WORKDIR /app
COPY --from=BUILD_IMAGE /app/package*.json ./
COPY --from=BUILD_IMAGE /app/.next ./.next
COPY --from=BUILD_IMAGE /app/public ./public
COPY --from=BUILD_IMAGE /app/node_modules ./node_modules
ENV NODE_ENV=production 
EXPOSE 3000
CMD ["npm", "start"]