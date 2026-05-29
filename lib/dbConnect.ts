import mongoose from 'mongoose';

// تأكد من وجود رابط قاعدة البيانات (استخدم القيمة الافتراضية إذا لم توجد في البيئة)
const MONGODB_URI: string = (process.env.MONGODB_URI as string) || 
  'mongodb://mmnem0553_db_user:pir5Zg7NGabezWNL@ac-q2cogty-shard-00-00.iz7raxb.mongodb.net:27017,ac-q2cogty-shard-00-01.iz7raxb.mongodb.net:27017,ac-q2cogty-shard-00-02.iz7raxb.mongodb.net:27017/booking?ssl=true&replicaSet=atlas-9phvwa-shard-0&authSource=admin';

if (!MONGODB_URI) {
  throw new Error('❌ MONGODB_URI is not defined in environment variables');
}

let cached = (global as any).mongoose || { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;