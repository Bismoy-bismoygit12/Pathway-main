import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const connectionUri = process.env.MYSQL_URL || process.env.DATABASE_URL;

const pool = connectionUri
    ? mysql.createPool({
          uri: connectionUri,
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
          charset: "utf8mb4"
      })
    : mysql.createPool({
          host: process.env.DB_HOST || "localhost",
          port: Number(process.env.DB_PORT) || 3306,
          user: process.env.DB_USER || "root",
          password: process.env.DB_PASSWORD || "",
          database: process.env.DB_NAME || "pathway_healthcare",
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
          charset: "utf8mb4"
      });

// Export database connection pool
export default pool;
