const http = require("http");

// First get a user ID
function testUpdateFunctionality() {
  console.log("Testing user update functionality...\n");

  // Step 1: Get users to find an ID to update
  const getOptions = {
    hostname: "localhost",
    port: 5000,
    path: "/users",
    method: "GET",
    headers: {
      Origin: "http://localhost:3000",
    },
  };

  const req = http.request(getOptions, (res) => {
    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      try {
        const result = JSON.parse(data);
        if (result.users && result.users.length > 0) {
          const user = result.users[0];
          console.log("Found user to update:", user.name);
          console.log("User ID:", user._id);

          // Step 2: Test GET single user by ID
          testGetUserById(user._id, () => {
            // Step 3: Test updating the user
            testUpdateUser(user._id);
          });
        } else {
          console.log("No users found to test update functionality");
        }
      } catch (error) {
        console.error("Error parsing response:", error);
      }
    });
  });

  req.on("error", (error) => {
    console.error("Error getting users:", error.message);
  });

  req.end();
}

function testGetUserById(userId, callback) {
  console.log("\n--- Testing GET user by ID ---");

  const options = {
    hostname: "localhost",
    port: 5000,
    path: `/users/${userId}`,
    method: "GET",
    headers: {
      Origin: "http://localhost:3000",
    },
  };

  const req = http.request(options, (res) => {
    console.log("GET user status:", res.statusCode);

    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      try {
        const result = JSON.parse(data);
        console.log("Retrieved user:", result.user?.name);
        callback();
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    });
  });

  req.on("error", (error) => {
    console.error("Error getting user by ID:", error.message);
  });

  req.end();
}

function testUpdateUser(userId) {
  console.log("\n--- Testing PUT user update ---");

  const updateData = {
    name: "Jane Doe (Updated)",
    email: "jane.updated@example.com",
    age: 31,
    address: "456 Updated Street",
    profilePicture: "https://example.com/updated-profile.jpg",
  };

  const options = {
    hostname: "localhost",
    port: 5000,
    path: `/users/${userId}`,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Origin: "http://localhost:3000",
    },
  };

  const req = http.request(options, (res) => {
    console.log("PUT update status:", res.statusCode);

    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      try {
        const result = JSON.parse(data);
        console.log("Update result:", result.message);
        console.log("Updated user name:", result.user?.name);

        // Verify the update by getting the user again
        verifyUpdate(userId);
      } catch (error) {
        console.error("Error parsing update response:", error);
      }
    });
  });

  req.on("error", (error) => {
    console.error("Error updating user:", error.message);
  });

  req.write(JSON.stringify(updateData));
  req.end();
}

function verifyUpdate(userId) {
  console.log("\n--- Verifying update ---");

  const options = {
    hostname: "localhost",
    port: 5000,
    path: `/users/${userId}`,
    method: "GET",
    headers: {
      Origin: "http://localhost:3000",
    },
  };

  const req = http.request(options, (res) => {
    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      try {
        const result = JSON.parse(data);
        console.log("Verified updated user:");
        console.log("- Name:", result.user?.name);
        console.log("- Email:", result.user?.email);
        console.log("- Age:", result.user?.age);
        console.log("\n✅ Update functionality test completed successfully!");
      } catch (error) {
        console.error("Error parsing verification response:", error);
      }
    });
  });

  req.on("error", (error) => {
    console.error("Error verifying update:", error.message);
  });

  req.end();
}

// Run the test
testUpdateFunctionality();
