"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, RotateCw, CheckCircle2, AlertCircle } from "lucide-react"

type VerificationStatus = 'verifying' | 'success' | 'error' | 'expired'

export default function VerifyEmailPage() {
  // In a real app, this would come from the URL params or API
  const [status, setStatus] = useState<VerificationStatus>('verifying')
  const [countdown, setCountdown] = useState(30)

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setStatus('success');
          // Force a session update to reflect the new email verification status
          const event = new Event('visibilitychange');
          document.dispatchEvent(event);
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
      }
    };

    verifyEmail();

    // Countdown for resend email
    const countdownInterval = setInterval(() => {
      setCountdown((prev: number) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, [])

  const handleResendEmail = () => {
    // In a real app, this would trigger an API call to resend the verification email
    setStatus('verifying')
    setCountdown(30)
    
    setTimeout(() => {
      setStatus('success')
    }, 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            {status === 'verifying' && (
              <div className="rounded-full bg-blue-100 p-3">
                <RotateCw className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
            )}
            {status === 'success' && (
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            )}
            {status === 'error' && (
              <div className="rounded-full bg-red-100 p-3">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {status === 'verifying' && 'Verifying your email...'}
            {status === 'success' && 'Email verified!'}
            {status === 'error' && 'Verification failed'}
            {status === 'expired' && 'Link expired'}
          </CardTitle>
          <CardDescription className="text-center">
            {status === 'verifying' && 'Please wait while we verify your email address.'}
            {status === 'success' && 'Your email has been successfully verified. You can now access your account.'}
            {status === 'error' && 'There was an error verifying your email. Please try again.'}
            {status === 'expired' && 'The verification link has expired. Please request a new one.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'success' ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                You will be redirected to the login page in a few seconds...
              </p>
              <Button asChild className="w-full">
                <Link href="/auth/login">Go to Login</Link>
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>user@example.com</span>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Didn't receive the email? Check your spam folder or</p>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleResendEmail}
                disabled={countdown > 0 || status === 'verifying'}
              >
                {status === 'verifying' ? (
                  <>
                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  `Resend email${countdown > 0 ? ` (${countdown}s)` : ''}`
                )}
              </Button>
              
              <Button variant="link" className="text-sm" asChild>
                <Link href="/auth/register">Change email address</Link>
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-center text-sm text-muted-foreground">
            Having trouble?{' '}
            <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
              Contact support
            </a>
          </p>
          
          <div className="text-center text-xs text-muted-foreground mt-4">
            <p>© {new Date().getFullYear()} Family Wealth Tracker. All rights reserved.</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
