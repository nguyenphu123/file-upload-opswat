import { NextResponse } from "next/server";
import fsPromises from "fs/promises";

export async function POST(req: Request) {
  const { apikey, analysisID } = await req.json();
  try {
    var checkStatus: any = {
      method: "GET",
      url: `http://172.16.2.104:8008/file/${analysisID}`,

      headers: {
        apikey: apikey,
        // user_agent: "{user_agent}",
      },
    };
    const response = await fetch(
      `http://172.16.2.104:8008/file/` + analysisID,
      checkStatus
    );
    const returnResult = await response.json();
    return NextResponse.json(returnResult);
  } catch (error) {
    // console.log("[STATUS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
