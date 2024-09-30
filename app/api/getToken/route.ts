import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    var loginOptions = {
      method: "POST",
      url: "http://172.16.2.104:8008/login",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: process.env.PUBLIC_OPSWAT_USERNAME,
        password: process.env.PUBLIC_OPSWAT_PASSWORD,
      }),
      json: true,
    };
    const response = await fetch(
      `http://172.16.2.104:8008/login`,
      loginOptions
    );
    const result = await response.json();

    return NextResponse.json(result);
  } catch (error) {
    console.log("[APIKEY]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
