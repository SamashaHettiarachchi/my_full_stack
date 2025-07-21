const http = require("http");

function testCORS() {
  const options = {
    hostname: "localhost",
    port: 5000,
    path: "/users",
    method: "GET",
    headers: {
      Origin: "http://localhost:3000",
    },
  };

  console.log("Testing CORS headers...");

  const req = http.request(options, (res) => {
    console.log("Response Status:", res.statusCode);
    console.log("\nCORS Headers:");
    console.log(
      "Access-Control-Allow-Origin:",
      res.headers["access-control-allow-origin"]
    );
    console.log(
      "Access-Control-Allow-Methods:",
      res.headers["access-control-allow-methods"]
    );
    console.log(
      "Access-Control-Allow-Headers:",
      res.headers["access-control-allow-headers"]
    );
    console.log(
      "Access-Control-Allow-Credentials:",
      res.headers["access-control-allow-credentials"]
    );

    console.log("\nAll Response Headers:");
    console.log(res.headers);

    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      console.log("\nResponse Data:", JSON.parse(data));

      // Now test OPTIONS request
      testOptionsRequest();
    });
  });

  req.on("error", (error) => {
    console.error("Error testing CORS:", error.message);
  });

  req.end();
}

function testOptionsRequest() {
  const options = {
    hostname: "localhost",
    port: 5000,
    path: "/users",
    method: "OPTIONS",
    headers: {
      Origin: "http://localhost:3000",
      "Access-Control-Request-Method": "POST",
      "Access-Control-Request-Headers": "Content-Type",
    },
  };

  console.log("\n--- Testing OPTIONS (preflight) request ---");

  const req = http.request(options, (res) => {
    console.log("OPTIONS Response Status:", res.statusCode);
    console.log("\nOPTIONS CORS Headers:");
    console.log(
      "Access-Control-Allow-Origin:",
      res.headers["access-control-allow-origin"]
    );
    console.log(
      "Access-Control-Allow-Methods:",
      res.headers["access-control-allow-methods"]
    );
    console.log(
      "Access-Control-Allow-Headers:",
      res.headers["access-control-allow-headers"]
    );
    console.log(
      "Access-Control-Allow-Credentials:",
      res.headers["access-control-allow-credentials"]
    );
  });

  req.on("error", (error) => {
    console.error("Error testing OPTIONS:", error.message);
  });

  req.end();
}

testCORS();
