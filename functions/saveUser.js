const fs = require('fs').promises;
const path = require('path');

const dataFile = path.join(__dirname, 'users.json');

async function readUsers() {
  try {
    const data = await fs.readFile(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading users file:", error);
    return [];
  }
}

async function writeUsers(users) {
  await fs.writeFile(dataFile, JSON.stringify(users, null, 2));
}

exports.handler = async (event) => {
  console.log("Save User function called");
  console.log("Event body:", event.body);
  
  try {
    let newUser;
    try {
      newUser = JSON.parse(event.body);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid JSON input", details: parseError.message })
      };
    }

    console.log("Parsed user data:", newUser);

    if (!newUser || !newUser.name || !Array.isArray(newUser.availability)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid user data structure" })
      };
    }

    let users = await readUsers();
    newUser.id = Date.now().toString();
    users.push(newUser);
    await writeUsers(users);
    
    console.log("User saved successfully");
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User saved successfully", userId: newUser.id })
    };
  } catch (error) {
    console.error("Error in saveUser function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error", details: error.message })
    };
  }
};