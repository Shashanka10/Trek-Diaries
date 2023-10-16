import { db } from "@/lib/db/db";
import { users } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { redis } from "@/lib/db/upstash";
import { cacheUserSchema, CachedUser } from "../zodSchema/cachedUser";

export const countUserByEmail = async (email: string) => {
  try {
    const countUser = db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(
        eq(users.email, sql.placeholder("email")),
      )
      .prepare("count_users");
    const result = await countUser.execute({ email });
    return result[0].count;
  } catch {
    console.error("Error in counting users");
    throw new Error("Error in counting users");
  }
};

export const countUserById = async (id: string) => {
  try {
    const countUser = db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(
        eq(users.id, sql.placeholder("id"))
      )
      .prepare("count_users");
    const result = await countUser.execute({ id });
    return result[0].count;
  } catch {
    console.error("Error in counting users");
    throw new Error("Error in counting users");
  }
};

export const cacheUser = async ({
  uuid,
  email,
  password,
  name,
  dob,
  salt,
  token,
}: {
  uuid: string;
  email: string;
  password: string;
  name: string;
  dob: string;
  salt: string;
  token: string;
}) => {
  const res = await redis.set(
    token,
    JSON.stringify({ email, password, name, dob, salt, uuid }),
    { ex: 3600 }
  );

  if (res !== "OK") {
    console.error("Error in setting redis");
    throw new Error("Error in setting redis");
  }
};

export const findCachedUser = async (token: string) => {
  try {
    const user: CachedUser = cacheUserSchema.parse(await redis.get(token));
    return user;
  } catch {
    console.error("Error in finding cached user");
    throw new Error("Error in finding cached user");
  }
};

export const deleteCachedUser = async (token: string) => {
  try {
    const res = await redis.del(token);
    if (res !== 1) {
      console.error("Error in deleting cache");
      throw new Error("Error in deleting cache");
    }
  } catch {
    console.error("Error in deleting cache");
    throw new Error("Error in deleting cache");
  }
}

export const insertUser = async (user: CachedUser) => {
  try {
    const { uuid, email, password, name, dob, salt } = user;
    const insertUser = db
      .insert(users)
      .values({
        id: sql.placeholder("id"),
        name: sql.placeholder("name"),
        email: sql.placeholder("email"),
        password: sql.placeholder("password"),
        salt: sql.placeholder("salt"),
        dob: sql.placeholder("dob"),
      })
      .prepare("insert_user");
    await insertUser.execute({ id: uuid, name, email, password, dob, salt });
  } catch {
    console.error("Error in inserting user");
    throw new Error("Error in inserting user");
  }
};
