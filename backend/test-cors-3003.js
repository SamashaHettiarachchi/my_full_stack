const http = require("http");

function testCORSForPort3003() {
  console.log("Testing CORS for localhost:3003...\n");

  const options = {
    hostname: "localhost",
    port: 5000,
    path: "/users",
    method: "GET",
    headers: {
      Origin: "http://localhost:3003",
    },
  };

  const req = http.request(options, (res) => {
    console.log("Response Status:", res.statusCode);
    console.log("\nCORS Headers for port 3003:");
    console.log(
      "Access-Control-Allow-Origin:",
      res.headers["access-control-allow-origin"]
    );
    console.log(
      "Access-Control-Allow-Methods:",
      res.headers["access-control-allow-methods"]
    );
    console.log(
      "Access-Control-Allow-Credentials:",
      res.headers["access-control-allow-credentials"]
    );

    if (
      res.headers["access-control-allow-origin"] === "http://localhost:3003"
    ) {
      console.log("\n✅ SUCCESS: Port 3003 is now allowed!");
    } else {
      console.log("\n❌ FAILED: Port 3003 is still blocked");
    }
  });

  req.on("error", (error) => {
    console.error("Error testing CORS:", error.message);
  });

  req.end();
}

testCORSForPort3003();
