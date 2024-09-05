const fs = require('fs').promises;
const path = require('path');

const dataFile = path.join(__dirname, 'users.json');

async function readUsers() {
  try {
    const data = await fs.readFile(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeUsers(users) {
  await fs.writeFile(dataFile, JSON.stringify(users, null, 2));
}

exports.handler = async (event) => {
  console.log("Function called");
  const { name, availability } = JSON.parse(event.body);
  console.log("Data received:", { name, availability });
  
  try {
    const users = await readUsers();
    let user = users.find(u => u.name === name);
    if (user) {
      user.availability = availability;
    } else {
      user = { id: Date.now().toString(), name, availability };
      users.push(user);
    }
    await writeUsers(users);
    console.log("User saved:", user);
    return {
      statusCode: 200,
      body: JSON.stringify(user)
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message })
    };
  }
};