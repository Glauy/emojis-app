import { prisma } from "@/server/db";
import { EmojiContextProps, Response } from "@/server/utils";
import { NextResponse } from "next/server";

// export const runtime = "edge";
export const fetchCache = "force-no-store";
export const revalidate = 0;
// https://www.gravatar.com/avatar/c77014cbf66a89ee372ee6ed477c913f?s=64&d=robohash
export async function GET(request: Request, { params }: EmojiContextProps) {
  try {
    const emoji = await prisma.emoji.findUnique({
      where: { id: params.id },
    });
    if (!emoji) return Response.emojiNotFound();

    return NextResponse.json({ emoji }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.internalServerError();
  }
}
