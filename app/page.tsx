import FileUpload from "@/components/upload/file-upload";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-64 flex-col items-center justify-between p-24">
      <Image
        src={"/images/Logo Shinhan Bank.png"}
        alt=""
        width={300}
        height={150}
      ></Image>
      <FileUpload></FileUpload>
    </main>
  );
}
