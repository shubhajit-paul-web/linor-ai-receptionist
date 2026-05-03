// This file is not used in OPTION 1 architecture
// 
// ARCHITECTURE: Independent Microservices (No service-to-service calls)
// - AUTH Service: Handles user login/signup and JWT tokens
// - TENANT Service: Manages clinic data independently using user_id from JWT
// 
// FLOW:
// 1. User logs in → AUTH returns JWT
// 2. User accesses TENANT → TENANT verifies JWT and extracts user_id
// 3. TENANT queries its own database using user_id (no API calls to AUTH)
//
// All clinic data is stored in TENANT database, not fetched from AUTH

