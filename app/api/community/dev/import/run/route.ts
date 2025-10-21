import { NextResponse } from "next/server";
import { importPresetActions } from "@/server/community/bulkImport";

export async function POST(){
  try{
    const done = await importPresetActions();
    return NextResponse.json(done);
  }catch(e:any){
    return NextResponse.json({ ok:false, error: e?.message ?? String(e) }, { status: 400 });
  }
}
