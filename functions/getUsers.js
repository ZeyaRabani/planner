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

exports.handler = async (event) => {
  console.log("Get Users function called");
  
  try {
    const users = await readUsers();
    return {
      statusCode: 200,
      body: JSON.stringify(users)
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message })
    };
  }
};