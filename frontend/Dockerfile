FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


FROM node:20-alpine AS production
WORKDIR /app
COPY --from=build /app/build /app/build
RUN npm install -g serve

CMD ["serve", "-s", "build", "-l", "3000"]

EXPOSE 3000
