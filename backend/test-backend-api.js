// Test file to verify backend functionality
const testBackend = async () => {
  try {
    // Test 1: Register a new user
    console.log("Testing user registration...");
    const registerResponse = await fetch(
      "http://localhost:5000/users/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "testuser123",
          email: "test@example.com",
          password: "password123",
          firstName: "Test",
          lastName: "User",
        }),
      }
    );

    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log("✅ Registration successful:", registerData);

      // Test 2: Login with the new user
      console.log("\nTesting user login...");
      const loginResponse = await fetch("http://localhost:5000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log("✅ Login successful:", loginData);

        // Test 3: Update user profile
        console.log("\nTesting profile update...");
        const updateResponse = await fetch(
          `http://localhost:5000/users/${loginData.user._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${loginData.token}`,
            },
            body: JSON.stringify({
              firstName: "Updated",
              lastName: "Name",
              bio: "This is my updated bio",
              phone: "+1234567890",
            }),
          }
        );

        if (updateResponse.ok) {
          const updateData = await updateResponse.json();
          console.log("✅ Profile update successful:", updateData);
        } else {
          console.log("❌ Profile update failed:", await updateResponse.text());
        }

        // Test 4: Get user profile
        console.log("\nTesting get user profile...");
        const profileResponse = await fetch(
          `http://localhost:5000/users/${loginData.user._id}`
        );

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          console.log("✅ Get profile successful:", profileData);
        } else {
          console.log("❌ Get profile failed:", await profileResponse.text());
        }
      } else {
        console.log("❌ Login failed:", await loginResponse.text());
      }
    } else {
      console.log("❌ Registration failed:", await registerResponse.text());
    }
  } catch (error) {
    console.error("❌ Test failed with error:", error.message);
  }
};

// Run the test if this file is executed directly
if (typeof window === "undefined") {
  // Node.js environment
  const fetch = require("node-fetch"); // You might need to install this: npm install node-fetch
  testBackend();
} else {
  // Browser environment
  testBackend();
}

console.log("Backend API Test Started...");
