"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import SiteMapVisualizer from "@/components/site-map-visualizer"

interface SiteMapNode {
  url: string
  links: string[]
  forms: {
    action: string
    method: string
    inputs: { name: string; type: string }[]
  }[]
}

export default function SiteMapPage() {
  const router = useRouter()
  const [siteMap, setSiteMap] = useState<Record<string, SiteMapNode> | null>(null)
  const [targetUrl, setTargetUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Retrieve the site map from session storage
    const storedSiteMap = sessionStorage.getItem("siteMap")
    if (storedSiteMap) {
      const parsedSiteMap = JSON.parse(storedSiteMap)
      setSiteMap(parsedSiteMap)

      // Extract the target URL from the first key
      if (Object.keys(parsedSiteMap).length > 0) {
        const firstUrl = Object.keys(parsedSiteMap)[0]
        const urlObj = new URL(firstUrl)
        setTargetUrl(`${urlObj.protocol}//${urlObj.hostname}`)
      }
    } else {
      // If no site map is found, redirect back to the scan page
      router.push("/scan")
    }
  }, [router])

  const handleScanStart = (scanType: string) => {
    setIsLoading(true)

    // Simulate scanning process
    setTimeout(() => {
      setIsLoading(false)

      // Store the scan type in session storage
      sessionStorage.setItem("scanType", scanType)

      // Navigate to the results page
      router.push("/scan/results")
    }, 2000)
  }

  if (!siteMap) {
    return (
      <div className="container flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-8">
      <Toaster />

      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.push("/scan")} className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="ml-4">
          <h1 className="text-2xl font-bold">Site Map</h1>
          <p className="text-sm text-muted-foreground">
            Target: <span className="font-medium">{targetUrl}</span>
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Website Structure</CardTitle>
              <CardDescription>Visual representation of the crawled website structure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] border rounded-md p-4 bg-muted/30">
                <SiteMapVisualizer siteMap={siteMap} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Vulnerability Scan</CardTitle>
              <CardDescription>Select the type of security scan to perform</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="xss" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="xss">Common</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
                <TabsContent value="xss" className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleScanStart("xss")}
                    disabled={isLoading}
                  >
                    Cross-Site Scripting (XSS)
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleScanStart("idor")}
                    disabled={isLoading}
                  >
                    Insecure Direct Object References
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleScanStart("sqli")}
                    disabled={isLoading}
                  >
                    SQL Injection
                  </Button>
                </TabsContent>
                <TabsContent value="advanced" className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleScanStart("lfi")}
                    disabled={isLoading}
                  >
                    Local File Inclusion (LFI)
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleScanStart("rfi")}
                    disabled={isLoading}
                  >
                    Remote File Inclusion (RFI)
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleScanStart("csrf")}
                    disabled={isLoading}
                  >
                    Cross-Site Request Forgery
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleScanStart("comprehensive")} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  "Run Comprehensive Scan"
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Site Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Pages Discovered:</span>
                  <span className="font-medium">{Object.keys(siteMap).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Forms Found:</span>
                  <span className="font-medium">
                    {Object.values(siteMap).reduce((acc, node) => acc + node.forms.length, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Links Analyzed:</span>
                  <span className="font-medium">
                    {Object.values(siteMap).reduce((acc, node) => acc + node.links.length, 0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
