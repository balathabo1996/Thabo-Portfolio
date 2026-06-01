const mongoose = require('mongoose');

const uri = "mongodb+srv://balathabo96:Thabo%401996@cluster0.cerulqu.mongodb.net/Thabo-Portfolio";

async function updateProject() {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    const db = mongoose.connection.db;
    const result = await db.collection('projects').updateOne(
      { title: { $regex: /JTResume/i } },
      { $set: { category: 'ai' } }
    );
    console.log("Matched:", result.matchedCount);
    console.log("Modified:", result.modifiedCount);
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

updateProject();
