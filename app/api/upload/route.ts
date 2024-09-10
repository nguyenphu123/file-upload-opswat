import { NextResponse } from "next/server";
import fsPromises from "fs/promises";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file: any = formData.get("file"); // or what you need
    const workflow: any = formData.get("workflowName");
    // const buffer = Buffer.from(await file.arrayBuffer());

    var loginOptions = {
      method: "POST",
      url: "http://172.16.2.104:8008/login",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: "admin",
        password: "Admin@123",
      }),
      json: true,
    };
    const response = await fetch(
      `http://172.16.2.104:8008/login`,
      loginOptions
    );
    const result = await response.json();
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
    var uploadOptions: any = {
      method: "POST",
      url: "http://172.16.2.104:8008/file",
      headers: {
        "Content-Type": "application/octet-stream",
        apikey: result.session_id,
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
      body: file,
      json: true,
    };
    const uploadResponse = await fetch(
      `http://172.16.2.104:8008/file`,
      uploadOptions
    );
    const uploadResult = await uploadResponse.json();
    return NextResponse.json(uploadResult);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
