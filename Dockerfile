# Stage 1: Build the React Application
FROM node:20-bullseye as builder

WORKDIR /app

# Declare build arguments for Vite env vars
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID

# Convert ARGs to ENV so Vite can read them at build time
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Production Runtime (Node + LaTeX)
FROM node:20-bullseye

WORKDIR /app

# Install LaTeX (TexLive) for PDF Generation
# using bullseye (Debian) for stable package availability
RUN apt-get update && apt-get install -y \
    texlive-latex-base \
    texlive-fonts-recommended \
    texlive-latex-extra \
    texlive-xetex \
    && rm -rf /var/lib/apt/lists/*

# Copy backend dependencies
COPY package*.json ./
RUN npm install --production

# Copy built frontend from Stage 1
COPY --from=builder /app/dist ./dist

# Copy backend source code
COPY server.js latexTemplate.js ./

# Expose port (Render sets PORT env var)
EXPOSE 3000

# Start server
CMD ["node", "server.js"]
