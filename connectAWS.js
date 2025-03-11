const { DynamoDBClient, ListTablesCommand } = require('@aws-sdk/client-dynamodb');
require('dotenv').config();

let client;

try {
  // Ensure environment variables are present
  if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY || !process.env.AWS_SECRET_KEY) {
    throw new Error('❌ Missing AWS environment variables.');
  }

  client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    },
  });

  // Validate credentials by making a test request
  const validateConnection = async () => {
    try {
      await client.send(new ListTablesCommand({}));
      console.log('✅ AWS DynamoDB Client connected successfully.');
    } catch (error) {
      console.error('❌ AWS connection failed. Check credentials:', error);
      process.exit(1); // Exit if AWS connection fails
    }
  };

  validateConnection();
} catch (error) {
  console.error('❌ Error during AWS client initialization:', error);
  process.exit(1); // Exit if client setup fails
}

module.exports = client;


