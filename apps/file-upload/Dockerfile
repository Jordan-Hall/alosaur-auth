FROM hayd/deno:1.6.2

WORKDIR /usr/src/app
COPY . .
USER deno
EXPOSE 8000
CMD [ "deno", "run", "--unstable", "-r", "-A", "--config", "./tsconfig.json", "./apps/file-upload/server.ts" ]
