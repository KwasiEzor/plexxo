import { Head, usePage } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import type { BreadcrumbItem } from '@/types';
import { CreditCard, Check } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Billing settings',
        href: '/settings/billing',
    },
];

export default function Billing({
    intent,
    subscription,
}: {
    intent: { client_secret: string };
    subscription: any;
}) {
    const { auth } = usePage().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Billing settings" />

            <h1 className="sr-only">Billing settings</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Subscription"
                        description="Manage your subscription plan and billing"
                    />

                    {subscription ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>Active Plan: {subscription.type}</CardTitle>
                                <CardDescription>
                                    Your subscription is currently {subscription.stripe_status}
                                </CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <Button variant="outline">Manage Subscription</Button>
                            </CardFooter>
                        </Card>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card className="flex flex-col">
                                <CardHeader>
                                    <CardTitle>Free</CardTitle>
                                    <CardDescription>Perfect for trying out Plexxo</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <div className="text-3xl font-bold mb-4">0€<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                                    <ul className="space-y-2">
                                        <li className="flex items-center text-sm">
                                            <Check className="mr-2 h-4 w-4 text-green-500" />
                                            1 Project
                                        </li>
                                        <li className="flex items-center text-sm">
                                            <Check className="mr-2 h-4 w-4 text-green-500" />
                                            Basic AI Generation
                                        </li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="outline" className="w-full" disabled>Current Plan</Button>
                                </CardFooter>
                            </Card>

                            <Card className="flex flex-col border-primary">
                                <CardHeader>
                                    <CardTitle>Premium</CardTitle>
                                    <CardDescription>For serious authors and creators</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <div className="text-3xl font-bold mb-4">19€<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                                    <ul className="space-y-2">
                                        <li className="flex items-center text-sm">
                                            <Check className="mr-2 h-4 w-4 text-green-500" />
                                            Unlimited Projects
                                        </li>
                                        <li className="flex items-center text-sm">
                                            <Check className="mr-2 h-4 w-4 text-green-500" />
                                            Advanced RAG & Reviewer
                                        </li>
                                        <li className="flex items-center text-sm">
                                            <Check className="mr-2 h-4 w-4 text-green-500" />
                                            Priority AI Generation
                                        </li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full">Upgrade to Premium</Button>
                                </CardFooter>
                            </Card>
                        </div>
                    )}

                    <div className="space-y-6 pt-6">
                        <Heading
                            variant="small"
                            title="Payment Method"
                            description="Update your credit card and billing details"
                        />
                        
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center">
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Card Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Plexxo uses Stripe for secure payment processing. 
                                    Your card information never touches our servers.
                                </p>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline">Update Payment Method</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
