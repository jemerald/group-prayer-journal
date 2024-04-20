// Get the client
import mysql from "mysql2/promise";
import { createId } from "@paralleldrive/cuid2";

const TestUserId = "test-user-1";

// Create the connection to database
export async function dbtest() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  // A simple SELECT query
  try {
    const [results, fields] = await connection.query(
      `SELECT * FROM User WHERE id = 'test-user-1'`
    );

    console.log(results); // results contains rows returned by server
    console.log(fields); // fields contains extra meta data about results, if available
  } catch (err) {
    console.log(err);
  }
}

export async function setupBlankJournal(
  name: string,
  userId: string = TestUserId
) {
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  try {
    // delete any existing journal with the same name
    await connection.execute(
      "DELETE FROM PrayerJournal WHERE userId = ? AND name = ?",
      [userId, name]
    );
    await connection.execute(
      "INSERT INTO PrayerJournal (id, userId, name) VALUES (?, ?, ?)",
      [createId(), userId, name]
    );
  } catch (err) {
    console.log(err);
  }
}

export async function deleteJournal(name: string, userId: string = TestUserId) {
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  try {
    await connection.execute(
      "DELETE FROM PrayerJournal WHERE userId = ? AND name = ?",
      [userId, name]
    );
  } catch (err) {
    console.log(err);
  }
}
