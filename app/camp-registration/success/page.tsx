import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { SuccessContent } from "./SuccessContent"
import { createServerClient } from "@/lib/supabase/server"

export default async function RegistrationSuccessPage({
    searchParams,
}: {
    searchParams: { id: string }
}) {
    const registrationId = searchParams?.id;
    
    if (!registrationId) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Invalid Registration</CardTitle>
                        <CardDescription>No registration ID provided</CardDescription>
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

    // Fetch the registration data from the database
    const supabase = await createServerClient()
    const { data: registration, error } = await supabase
        .from("camp_2025")
        .select("*")
        .eq("id", registrationId)
        .single()

    if (error || !registration) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Registration Not Found</CardTitle>
                        <CardDescription>We couldn't find your registration. Please contact support.</CardDescription>
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

    return <SuccessContent registration={registration} />
}
