import mongoose from "mongoose";

/******************************
 *
 * MongoDB Configuration
 *
 ******************************/
const connectOptions = {
  connectTimeoutMS: 5000,
  serverSelectionTimeoutMS: 5000,
  heartbeatFrequencyMS: 1000,
  socketTimeoutMS: 30000, // Close sockets after 30 seconds of inactivity
  useUnifiedTopology: true,
};
const defaultMongoUri = "mongodb://127.0.0.1:27017/wwoz_events";

export const startMongo = async (uri = defaultMongoUri) => {
  try {
    await mongoose.connect(uri, connectOptions);
  } catch (err) {
    console.error(`mongoose error: ${err}`);
    mongoose.disconnect();
  }
};

mongoose.connection.on("connected", () => {
  console.log("mongoose connected");
});

mongoose.connection.on("error", (err) => {
  console.error(`error connecting to mongo: ${err}`);
});
mongoose.connection.on("disconnected", () => {
  console.warn("mongoose disconnected");
});
mongoose.connection.on("reconnected", () => {
  console.warn("mongoose reconnected");
});
mongoose.connection.on("reconnectFailed", () => {
  console.error("mongoose reconnect failed");
});

mongoose.connection.once("open", () => {
  console.log("mongoose connection open");
});
