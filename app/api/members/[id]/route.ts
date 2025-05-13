import { getUserById } from "@/lib/actions"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const userData = await getUserById(params.id)

    if (!userData) {
        return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    return NextResponse.json(userData)
}
