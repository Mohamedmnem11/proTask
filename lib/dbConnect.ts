import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mmnem0553_db_user:pir5Zg7NGabezWNL@ac-q2cogty-shard-00-00.iz7raxb.mongodb.net:27017,ac-q2cogty-shard-00-01.iz7raxb.mongodb.net:27017,ac-q2cogty-shard-00-02.iz7raxb.mongodb.net:27017/booking?ssl=true&replicaSet=atlas-9phvwa-shard-0&authSource=admin';
if (!MONGODB_URI) {
  throw new Error('❌ MONGODB_URI is not defined');
}

async function dbConnect() {
  // الاتصال مباشرة (إذا كان متصلاً بالفعل، mongoose يعيد استخدام الاتصال)
  await mongoose.connect(MONGODB_URI);
  return mongoose;
}

export default dbConnect;