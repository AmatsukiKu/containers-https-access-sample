FROM debian:buster-slim as fetch-dockerize
RUN apt-get update && apt-get install -y curl
# install dockerize
ENV DOCKERIZE_VERSION v0.6.1
RUN curl -SL https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
        | tar -xz -C /usr/local/bin

FROM node:10.16.3-buster-slim
# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer
# installs, work.
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

COPY local-root-ca.pem /usr/local/share/ca-certificates/local-root-ca.crt
RUN update-ca-certificates

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

COPY ./package* ./
# Install puppeteer so it's available in the container.
RUN npm i puppeteer \
    # Add user so we don't need --no-sandbox.
    # same layer as npm install to keep re-chowned files from using up several hundred MBs more space
    && groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /node_modules

# Run everything after as non-privileged user.
USER pptruser

COPY ./test.js /home/pptruser/

COPY --from=fetch-dockerize /usr/local/bin/dockerize /usr/local/bin/dockerize

CMD ["dockerize", "-wait", "https://nginx/", "-timeout", "60s", "npm", "run", "test"]
