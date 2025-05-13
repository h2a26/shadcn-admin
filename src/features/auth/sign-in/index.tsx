import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthLayout } from '@/features/auth/layout/auth-layout.tsx';
import { SignInForm } from './components/sign-in-form.tsx';


export default function SignIn() {
  return (
    <AuthLayout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          <Card className="gap-8 py-6">
            <CardHeader>
              <CardTitle className="text-lg tracking-tight">Login</CardTitle>
              <CardDescription>
                Enter your email and password below to <br />
                log into your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignInForm />
            </CardContent>
            <CardFooter>
              <p className="text-muted-foreground px-8 text-center text-sm">
                By clicking login, you agree to our{' '}
                <a
                  href="/terms"
                  className="hover:text-primary underline underline-offset-4"
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href="/privacy"
                  className="hover:text-primary underline underline-offset-4"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AuthLayout>
  )
}
