"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Shield, AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function ScanPage() {
  const router = useRouter()
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isValidUrl, setIsValidUrl] = useState(true)

  const validateUrl = (input: string) => {
    try {
      new URL(input)
      setIsValidUrl(true)
      return true
    } catch (e) {
      setIsValidUrl(false)
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateUrl(url)) {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid URL including http:// or https://",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/crawl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error("Failed to crawl website")
      }

      const data = await response.json()

      // Store the site map in session storage to use in the next page
      sessionStorage.setItem("siteMap", JSON.stringify(data.siteMap))

      // Navigate to the site map page
      router.push("/scan/sitemap")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Scanning failed",
        description: "There was an error crawling the website. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl py-12">
      <Toaster />
      <div className="flex flex-col items-center space-y-6 text-center">
        <Shield className="h-12 w-12 text-primary" />
        <h1 className="text-3xl font-bold">Start Security Scan</h1>
        <p className="text-muted-foreground max-w-[600px]">
          Enter the URL of the website you want to scan for security vulnerabilities. Make sure you have proper
          authorization to test this website.
        </p>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Target Information</CardTitle>
          <CardDescription>Provide the URL of the website you want to scan</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Target URL</Label>
              <Input
                id="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className={!isValidUrl ? "border-destructive" : ""}
              />
              {!isValidUrl && (
                <p className="text-sm text-destructive">Please enter a valid URL including http:// or https://</p>
              )}
            </div>

            <div className="rounded-lg border p-3 bg-muted/50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <p className="text-sm font-medium">Important Notice</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Only scan websites that you own or have explicit permission to test. Unauthorized security testing may
                be illegal and unethical.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                "Start Scanning"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
