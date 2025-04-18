
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();
const uri = "mongodb+srv://minkha:${process.env.DB_password}@minkha.jf6dcwq.mongodb.net/?retryWrites=true&w=majority&appName=minkha";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
  }
}
run().catch(console.dir);