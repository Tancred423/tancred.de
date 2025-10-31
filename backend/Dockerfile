FROM denoland/deno:2.5.4

WORKDIR /app

COPY deno.json .
COPY deno.lock* .

RUN deno cache --reload deno.json || true

COPY . .

# Make entrypoint script executable
RUN chmod +x src/entrypoint.sh || true

EXPOSE 8000

# Use entrypoint script to run migrations and init admin before starting
CMD ["sh", "-c", "deno task migrate && deno task init-admin && deno task start"]

