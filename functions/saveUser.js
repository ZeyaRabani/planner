const users = [];

exports.handler = async (event) => {
  console.log("Function called");
  const { name } = JSON.parse(event.body);
  console.log("Name received:", name);
  
  try {
    const id = Date.now().toString();
    const newUser = { id, name };
    users.push(newUser);
    console.log("User created:", newUser);
    return {
      statusCode: 200,
      body: JSON.stringify(newUser)
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message })
    };
  }
};