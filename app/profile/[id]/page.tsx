import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getUserById } from "@/lib/actions"
import { UserProfile } from "@/components/user-profile"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const userData = await getUserById(params.id)

  if (!userData) {
    notFound()
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24 bg-gradient-to-b from-orange-50 to-yellow-50">
      <div className="w-full max-w-3xl flex flex-col items-center">
        <div className="mb-6 w-24 h-24 relative">
          <Image
            src="/logo.png"
            alt="Bushfire Revival International Ministry"
            fill
            className="object-contain"
            priority
          />
        </div>

        <Card className="shadow-lg w-full border-t-4 border-t-orange-500">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-slate-800">Your Profile Information</CardTitle>
            <CardDescription>Review your information and request updates if needed</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="flex justify-center py-4">Loading profile...</div>}>
              <UserProfile user={userData} />
            </Suspense>
            <Link href="/member-info">Back to Member Info</Link>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
