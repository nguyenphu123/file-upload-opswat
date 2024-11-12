import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file: any = formData.get("file"); // or what you need
    const workflow: any = formData.get("workflowName");
    // const apikey: any = formData.get("apikey");
    // var ruleOptions: any = {
    //   method: "POST",
    //   url: "http://172.16.2.104:8008/file/rules",
    //   headers: {
    //     "Content-Type": "application/json",
    //     apikey: result.session_id,
    //     user_agent: "vault",
    //   },
    //   body: JSON.stringify({}),
    //   json: true,
    // };

    // const ruleResponse = await fetch(
    //   `http://172.16.2.104:8008/file/rules`,
    //   ruleOptions
    // );
    // const ruleResult = await ruleResponse.json();
    const formData2 = new FormData();
    formData2.append("file", file);
    var uploadOptions: any = {
      method: "POST",
      url: "http://" + process.env.HOST + ":8008/file/sync",
      headers: {
        "Content-Type": "application/octet-stream",
        apikey: process.env.API_KEY,
        filename: file.name,
        // filepath: "",
        // user_agent: "",
        // rule: "MetaDefender Vault",
        workflow: workflow + " ",
        // batch: "",
        // archivepwd: "echo",
        // metadata: "",
        // callbackurl: "{callbackurl}",
        // sanitizedurl: "{sanitizedurl}",
        // downloadfrom: "{downloadfrom}",
        // "global-timeout": 60,
      },
      body: formData2,
      json: true,
    };
    const uploadResponse = await fetch(
      "http://" + process.env.HOST + ":8008/file/sync",
      uploadOptions
    );
    const uploadResult = await uploadResponse.json();

    return NextResponse.json(uploadResult);
  } catch (error) {
    console.log("[UPLOAD]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
