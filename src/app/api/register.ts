import { NextResponse } from "next/server"
export async function POST(req: Request, res: Response) {
  try {
    const { nom ,prenoms , country , tel,  ref , email, pass } = await req.json()

    const a = await fetch("http://localhost:8000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({  nom ,prenoms , country, tel , ref , email, pass }),
    })
    return NextResponse.json({ status: 200, message: "success" })
  } catch (e) {
    console.log(e)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}