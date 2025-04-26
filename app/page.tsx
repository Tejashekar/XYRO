import type { Metadata } from "next"
import Link from "next/link"
import { Shield, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Security Scanner",
  description: "Web security vulnerability scanner for ethical hacking and bug hunting",
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-background border-b">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            <span className="text-lg font-bold">SecurityScanner</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
              About
            </Link>
            <Link href="/docs" className="text-sm font-medium hover:underline underline-offset-4">
              Documentation
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Web Security Vulnerability Scanner</h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Scan websites for XSS, IDOR, LFI/RFI and other security vulnerabilities. Identify and report potential
                  security issues.
                </p>
              </div>
              <div className="mx-auto w-full max-w-sm space-y-2">
                <div className="flex justify-center">
                  <Link href="/scan">
                    <Button size="lg" className="w-full">
                      Start Scanning
                    </Button>
                  </Link>
                </div>
                <p className="text-xs text-muted-foreground">
                  <AlertTriangle className="h-3 w-3 inline mr-1" />
                  Only scan websites you have permission to test.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Comprehensive Security Analysis</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Our scanner performs thorough analysis of web applications to identify security vulnerabilities.
                  </p>
                </div>
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/20 p-1">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">Cross-Site Scripting (XSS) Detection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/20 p-1">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">Insecure Direct Object References (IDOR)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/20 p-1">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">Local/Remote File Inclusion (LFI/RFI)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/20 p-1">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">SQL Injection Vulnerabilities</span>
                  </li>
                </ul>
              </div>
              <div className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last">
                <div className="h-full w-full bg-muted flex items-center justify-center">
                  <div className="p-8 rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-md">
                    <div className="flex flex-col space-y-1.5 p-6">
                      <h3 className="text-2xl font-semibold leading-none tracking-tight">Vulnerability Report</h3>
                      <p className="text-sm text-muted-foreground">Sample security analysis output</p>
                    </div>
                    <div className="p-6 grid gap-4">
                      <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-2 text-destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-medium">XSS vulnerability detected</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 p-2 text-amber-500">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-medium">IDOR vulnerability detected</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-green-500/10 p-2 text-green-500">
                        <Shield className="h-4 w-4" />
                        <span className="text-sm font-medium">No LFI/RFI vulnerabilities</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <CardTitle>1. Enter Target URL</CardTitle>
                  <CardDescription>Provide the URL of the website you want to scan</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Input the target website URL to begin the scanning process. Make sure you have proper authorization
                    to test the target.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>2. Generate Site Map</CardTitle>
                  <CardDescription>Our crawler maps the structure of the website</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    The scanner crawls the website to discover pages, endpoints, forms, and other elements that might be
                    vulnerable.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>3. Run Security Tests</CardTitle>
                  <CardDescription>Select and run vulnerability scans</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Choose from various security tests including XSS, IDOR, LFI/RFI, and more to identify potential
                    vulnerabilities.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-background">
        <div className="container flex flex-col gap-2 sm:flex-row py-6 w-full items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SecurityScanner. For educational and ethical testing purposes only.
          </p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link href="/terms" className="text-xs hover:underline underline-offset-4">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-xs hover:underline underline-offset-4">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
