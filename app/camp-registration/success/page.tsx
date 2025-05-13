import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { SuccessContent } from "./SuccessContent"

export default async function RegistrationSuccessPage({
    searchParams,
}: {
    searchParams: { data: string }
}) {
    const data = await searchParams?.data;
    
    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Invalid Registration</CardTitle>
                        <CardDescription>No registration data found</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/camp-registration" className="w-full">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Registration
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const registration = JSON.parse(decodeURIComponent(data))
    return <SuccessContent registration={registration} />
}
