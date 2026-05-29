import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI as string || 'mongodb://mmnem0553_db_user:pir5Zg7NGabezWNL@ac-q2cogty-shard-00-00.iz7raxb.mongodb.net:27017,ac-q2cogty-shard-00-01.iz7raxb.mongodb.net:27017,ac-q2cogty-shard-00-02.iz7raxb.mongodb.net:27017/booking?ssl=true&replicaSet=atlas-9phvwa-shard-0&authSource=admin';
if (!uri) throw new Error('MONGODB_URI missing');

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;