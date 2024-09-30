import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
const { S3Client } = require("@aws-sdk/client-s3");
export async function POST(req: Request) {
  const formData = await req.formData();
  const file: any = formData.get("file");
  try {
    const client = new S3Client({
      credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
      },
      endpoint: {
        url: "https://s3." + process.env.AWS_REGION + ".wasabisys.com",
      },
      region: process.env.AWS_REGION,
    });
    const buffer = Buffer.from(await file.arrayBuffer());
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: "lpc/"+file.name,
      Body: buffer,
      ContentType: "multipart/form-data",
    };
    const command = new PutObjectCommand(params);
    const response = await client.send(command);
    return NextResponse.json(response);
  } catch (error) {
    console.log("[UPLOAD]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
