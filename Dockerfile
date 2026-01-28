# Stage 1: Build the React Application
FROM node:20-bullseye as builder

WORKDIR /app

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
