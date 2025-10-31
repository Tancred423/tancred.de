#!/bin/sh

# Run migrations
echo "Running database migrations..."
deno task migrate

# Initialize admin user from environment variables
echo "Initializing admin user..."
deno task init-admin

# Start the server
echo "Starting server..."
exec deno task "$@"

