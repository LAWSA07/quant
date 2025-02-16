import { NextRequest, NextResponse } from "next/server";
import { predictHandwriting } from "@/lib/mlModel";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Only handle image types
    const prediction = await predictHandwriting(buffer);
    const result = prediction.text;

    return NextResponse.json({ text: result });
  } catch (error) {
    console.error("Inference error:", error);
    return NextResponse.json(
      { error: "Failed to process file" },
      { status: 500 }
    );
  }
}
