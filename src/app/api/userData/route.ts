import { NextResponse } from "next/server";

export async function GET() {
  const data = {
    id: 0,
    name: "Test",
    username: "test@yopmail.com",
    email: "test@yopmail.com",
    phone: "1-770-736-8031",
    website: "test.com",
  };
  return NextResponse.json(data);
}
