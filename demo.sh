#!/bin/bash

echo "🚀 Advanced Rust Chat Server Demo"
echo "=================================="
echo ""

# Check if server is running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ Server is not running. Starting it now..."
    cargo run &
    sleep 3
fi

echo "✅ Server is running at http://localhost:3000"
echo ""

echo "📊 Testing API Endpoints:"
echo "-------------------------"

echo "1. Getting users:"
curl -s http://localhost:3000/api/users | jq .

echo ""
echo "2. Creating a user:"
curl -s -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"demo_user","email":"demo@example.com"}' | jq .

echo ""
echo "3. Getting messages:"
curl -s http://localhost:3000/api/messages | jq .

echo ""
echo "4. Creating a message:"
USER_ID=$(curl -s -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"message_user","email":"message@example.com"}' | jq -r '.id')

curl -s -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d "{\"content\":\"Hello from Rust! 🦀\",\"user_id\":\"$USER_ID\",\"message_type\":\"Text\"}" | jq .

echo ""
echo "5. Getting messages again:"
curl -s http://localhost:3000/api/messages | jq .

echo ""
echo "🎯 Advanced Features:"
echo "-------------------"
echo "• Real-time WebSocket messaging"
echo "• Thread-safe state management with DashMap"
echo "• Async/await with Tokio runtime"
echo "• Custom error handling with thiserror"
echo "• Modern web frontend with responsive design"
echo "• RESTful API with JSON serialization"
echo "• CORS support for cross-origin requests"
echo "• Structured logging with tracing"

echo ""
echo "🌐 Open your browser and visit: http://localhost:3000"
echo "   The chat application will automatically create users and connect via WebSocket!"
echo ""
echo "📝 To stop the server, press Ctrl+C" 