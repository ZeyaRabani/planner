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
  console.log("Delete User function called");
  const { id } = JSON.parse(event.body);
  console.log("User ID to delete:", id);
  
  try {
    let users = await readUsers();
    users = users.filter(user => user.id !== id);
    await writeUsers(users);
    console.log("User deleted");
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User deleted successfully" })
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message })
    };
  }
};