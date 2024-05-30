import "server-only";
// import { prisma } from "./db";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getEmojisCount = async () => prisma.emoji.count();
