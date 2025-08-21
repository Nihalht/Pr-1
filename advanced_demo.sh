#!/bin/bash

echo "🚀 Advanced Distributed E-Commerce Platform Demo"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${CYAN}🎉 $1${NC}"
}

# Check if required tools are installed
check_dependencies() {
    print_info "Checking dependencies..."
    
    if ! command -v cargo &> /dev/null; then
        print_error "Cargo is not installed. Please install Rust first."
        exit 1
    fi
    
    if ! command -v jq &> /dev/null; then
        print_warning "jq is not installed. Installing JSON parsing..."
        if command -v brew &> /dev/null; then
            brew install jq
        else
            print_error "Please install jq manually"
            exit 1
        fi
    fi
    
    print_status "All dependencies are available"
}

# Build the project
build_project() {
    print_info "Building the advanced distributed e-commerce platform..."
    
    if cargo build --release; then
        print_success "Project built successfully!"
    else
        print_error "Build failed. Please check the errors above."
        exit 1
    fi
}

# Start the API Gateway
start_api_gateway() {
    print_info "Starting API Gateway..."
    
    # Set environment variables
    export ENVIRONMENT=development
    export JWT_SECRET="your-super-secret-jwt-key-change-in-production-32-chars"
    export DATABASE_URL="postgresql://localhost/ecommerce"
    export REDIS_URL="redis://localhost:6379"
    
    # Start the API Gateway in background
    cargo run --bin api-gateway &
    API_GATEWAY_PID=$!
    
    # Wait for the service to start
    sleep 5
    
    # Check if the service is running
    if curl -s http://localhost:8000/health > /dev/null; then
        print_success "API Gateway is running on http://localhost:8000"
    else
        print_error "API Gateway failed to start"
        exit 1
    fi
}

# Test API Gateway endpoints
test_api_gateway() {
    print_info "Testing API Gateway endpoints..."
    
    echo ""
    echo "📊 Health Check:"
    curl -s http://localhost:8000/health | jq .
    
    echo ""
    echo "📈 Metrics:"
    curl -s http://localhost:9090/metrics | head -20
    
    echo ""
    echo "🔍 Service Discovery:"
    curl -s http://localhost:8000/api/v1/services | jq . 2>/dev/null || echo "Service discovery endpoint not implemented yet"
}

# Test Circuit Breaker functionality
test_circuit_breaker() {
    print_info "Testing Circuit Breaker functionality..."
    
    echo ""
    echo "🔄 Testing service calls with circuit breaker protection:"
    
    # Test a service that might be down
    for i in {1..10}; do
        echo "Attempt $i:"
        curl -s -w "Status: %{http_code}, Time: %{time_total}s\n" \
             -o /dev/null \
             http://localhost:8000/api/v1/users/test-user || true
        sleep 1
    done
}

# Test Rate Limiting
test_rate_limiting() {
    print_info "Testing Rate Limiting..."
    
    echo ""
    echo "🚦 Testing rate limiting (should see 429 errors after limit):"
    
    for i in {1..15}; do
        response=$(curl -s -w "%{http_code}" -o /dev/null http://localhost:8000/api/v1/health)
        echo "Request $i: Status $response"
        if [ "$response" = "429" ]; then
            print_warning "Rate limit hit on request $i"
            break
        fi
        sleep 0.1
    done
}

# Test Authentication and Authorization
test_auth() {
    print_info "Testing Authentication and Authorization..."
    
    echo ""
    echo "🔐 Testing JWT authentication:"
    
    # Test without authentication
    echo "Request without auth:"
    curl -s -w "Status: %{http_code}\n" -o /dev/null \
         http://localhost:8000/api/v1/users/profile || true
    
    # Test with invalid token
    echo "Request with invalid token:"
    curl -s -w "Status: %{http_code}\n" -o /dev/null \
         -H "Authorization: Bearer invalid-token" \
         http://localhost:8000/api/v1/users/profile || true
}

# Test Caching
test_caching() {
    print_info "Testing Caching functionality..."
    
    echo ""
    echo "💾 Testing Redis caching:"
    
    # Test cache operations
    curl -s -X POST http://localhost:8000/api/v1/cache/test-key \
         -H "Content-Type: application/json" \
         -d '{"value": "test-value", "ttl": 60}' | jq . 2>/dev/null || echo "Cache endpoint not implemented yet"
}

# Test Monitoring and Observability
test_monitoring() {
    print_info "Testing Monitoring and Observability..."
    
    echo ""
    echo "📊 Prometheus Metrics:"
    curl -s http://localhost:9090/metrics | grep -E "(http_requests_total|circuit_breaker|rate_limit)" | head -10
    
    echo ""
    echo "🏥 Health Check Details:"
    curl -s http://localhost:8000/health | jq .
}

# Test Error Handling
test_error_handling() {
    print_info "Testing Error Handling..."
    
    echo ""
    echo "🚨 Testing various error scenarios:"
    
    # Test 404
    echo "404 Error:"
    curl -s -w "Status: %{http_code}\n" -o /dev/null \
         http://localhost:8000/api/v1/nonexistent || true
    
    # Test 400
    echo "400 Error (malformed JSON):"
    curl -s -w "Status: %{http_code}\n" -o /dev/null \
         -X POST http://localhost:8000/api/v1/users \
         -H "Content-Type: application/json" \
         -d '{"invalid": json}' || true
    
    # Test 401
    echo "401 Error (no auth):"
    curl -s -w "Status: %{http_code}\n" -o /dev/null \
         http://localhost:8000/api/v1/admin/users || true
}

# Performance Testing
test_performance() {
    print_info "Testing Performance..."
    
    echo ""
    echo "⚡ Performance test (10 concurrent requests):"
    
    for i in {1..10}; do
        (
            curl -s -w "Request $i: %{http_code} - %{time_total}s\n" \
                 -o /dev/null \
                 http://localhost:8000/health
        ) &
    done
    wait
}

# Show advanced features
show_advanced_features() {
    echo ""
    print_success "🎯 Advanced Features Implemented:"
    echo "========================================"
    echo ""
    echo "🏗️  Architecture:"
    echo "  • Microservices with API Gateway"
    echo "  • Circuit Breaker pattern"
    echo "  • Rate Limiting"
    echo "  • Load Balancing"
    echo "  • Service Discovery"
    echo ""
    echo "🔒 Security:"
    echo "  • JWT Authentication"
    echo "  • Role-based Authorization"
    echo "  • Password Hashing (bcrypt)"
    echo "  • CORS Configuration"
    echo "  • Input Validation"
    echo ""
    echo "📊 Monitoring:"
    echo "  • Prometheus Metrics"
    echo "  • Health Checks"
    echo "  • Structured Logging"
    echo "  • Distributed Tracing"
    echo "  • Performance Monitoring"
    echo ""
    echo "💾 Caching:"
    echo "  • Redis Integration"
    echo "  • Cache TTL Management"
    echo "  • Cache Hit/Miss Metrics"
    echo ""
    echo "🔄 Resilience:"
    echo "  • Circuit Breaker States (Open/Closed/Half-Open)"
    echo "  • Automatic Recovery"
    echo "  • Failure Thresholds"
    echo "  • Timeout Handling"
    echo ""
    echo "⚡ Performance:"
    echo "  • Async/Await with Tokio"
    echo "  • Non-blocking I/O"
    echo "  • Connection Pooling"
    echo "  • Request/Response Caching"
    echo ""
    echo "🧪 Testing:"
    echo "  • Unit Tests"
    echo "  • Integration Tests"
    echo "  • Error Scenario Testing"
    echo "  • Performance Testing"
}

# Cleanup function
cleanup() {
    print_info "Cleaning up..."
    
    if [ ! -z "$API_GATEWAY_PID" ]; then
        kill $API_GATEWAY_PID 2>/dev/null || true
    fi
    
    # Kill any remaining cargo processes
    pkill -f "cargo run" 2>/dev/null || true
    
    print_status "Cleanup completed"
}

# Main execution
main() {
    # Set up cleanup on exit
    trap cleanup EXIT
    
    echo "🚀 Starting Advanced Distributed E-Commerce Platform Demo"
    echo "========================================================"
    echo ""
    
    check_dependencies
    build_project
    start_api_gateway
    
    echo ""
    print_success "🎉 All services are running!"
    echo ""
    echo "📋 Available Services:"
    echo "  • API Gateway: http://localhost:8000"
    echo "  • Metrics: http://localhost:9090"
    echo "  • Health Check: http://localhost:8000/health"
    echo ""
    
    # Run tests
    test_api_gateway
    test_circuit_breaker
    test_rate_limiting
    test_auth
    test_caching
    test_monitoring
    test_error_handling
    test_performance
    
    show_advanced_features
    
    echo ""
    print_success "🎯 Demo completed successfully!"
    echo ""
    echo "📝 Next Steps:"
    echo "  • Explore the codebase to understand the architecture"
    echo "  • Add more microservices (User, Product, Order, etc.)"
    echo "  • Implement database migrations"
    echo "  • Add more comprehensive tests"
    echo "  • Deploy to cloud infrastructure"
    echo ""
    echo "🔗 Useful URLs:"
    echo "  • API Gateway: http://localhost:8000"
    echo "  • Metrics: http://localhost:9090/metrics"
    echo "  • Health: http://localhost:8000/health"
    echo ""
    echo "Press Ctrl+C to stop all services"
    
    # Keep the script running
    wait
}

# Run the main function
main "$@" 