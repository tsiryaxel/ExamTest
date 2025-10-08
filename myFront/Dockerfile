FROM node:22

WORKDIR /app
COPY package*.json ./

# Installer Angular CLI globalement + dépendances locales
RUN npm install -g @angular/cli \
    && npm install

COPY . .

EXPOSE 4200
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--poll", "2000"]
