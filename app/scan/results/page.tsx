"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Shield, ArrowLeft, Download, AlertTriangle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import AIReport from "@/components/ai-report"

interface Vulnerability {
  id: string
  type: string
  severity: "critical" | "high" | "medium" | "low" | "info"
  url: string
  description: string
  payload?: string
  remediation: string
}

export default function ResultsPage() {
  const router = useRouter()
  const [scanType, setScanType] = useState<string>("")
  const [targetUrl, setTargetUrl] = useState<string>("")
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([])

  useEffect(() => {
    // Get the scan type from session storage
    const storedScanType = sessionStorage.getItem("scanType")
    if (!storedScanType) {
      router.push("/scan")
      return
    }

    setScanType(storedScanType)

    // Get the site map to extract the target URL
    const storedSiteMap = sessionStorage.getItem("siteMap")
    if (storedSiteMap) {
      const parsedSiteMap = JSON.parse(storedSiteMap)
      if (Object.keys(parsedSiteMap).length > 0) {
        const firstUrl = Object.keys(parsedSiteMap)[0]
        const urlObj = new URL(firstUrl)
        setTargetUrl(`${urlObj.protocol}//${urlObj.hostname}`)
      }
    }

    // Generate mock vulnerabilities based on scan type
    generateMockVulnerabilities(storedScanType)
  }, [router])

  const generateMockVulnerabilities = (type: string) => {
    const mockVulnerabilities: Vulnerability[] = []

    // XSS vulnerabilities
    if (type === "xss" || type === "comprehensive") {
      mockVulnerabilities.push({
        id: "vuln-1",
        type: "Reflected XSS",
        severity: "high",
        url: `${targetUrl || "https://example.com"}/search?q=`,
        description:
          "The search parameter is reflected in the page without proper encoding, allowing script injection.",
        payload: "<script>alert('XSS')</script>",
        remediation:
          "Implement proper output encoding for user-supplied data. Use context-specific encoding and consider a Content-Security-Policy.",
      })
    }

    // IDOR vulnerabilities
    if (type === "idor" || type === "comprehensive") {
      mockVulnerabilities.push({
        id: "vuln-2",
        type: "Insecure Direct Object Reference",
        severity: "critical",
        url: `${targetUrl || "https://example.com"}/api/users/123`,
        description:
          "The API endpoint allows access to user data by simply changing the ID parameter without proper authorization checks.",
        remediation:
          "Implement proper authorization checks for all API endpoints. Use indirect references or verify user permissions before allowing access to resources.",
      })
    }

    // SQL Injection vulnerabilities
    if (type === "sqli" || type === "comprehensive") {
      mockVulnerabilities.push({
        id: "vuln-3",
        type: "SQL Injection",
        severity: "critical",
        url: `${targetUrl || "https://example.com"}/products?id=1`,
        description: "The product ID parameter is vulnerable to SQL injection attacks.",
        payload: "1' OR '1'='1",
        remediation:
          "Use parameterized queries or prepared statements. Never concatenate user input directly into SQL queries.",
      })
    }

    // LFI vulnerabilities
    if (type === "lfi" || type === "comprehensive") {
      mockVulnerabilities.push({
        id: "vuln-4",
        type: "Local File Inclusion",
        severity: "high",
        url: `${targetUrl || "https://example.com"}/include?file=`,
        description: "The file parameter can be manipulated to include local files from the server.",
        payload: "../../../etc/passwd",
        remediation:
          "Validate and sanitize file paths. Use a whitelist of allowed files and avoid using user input for file operations.",
      })
    }

    // RFI vulnerabilities
    if (type === "rfi" || type === "comprehensive") {
      mockVulnerabilities.push({
        id: "vuln-5",
        type: "Remote File Inclusion",
        severity: "high",
        url: `${targetUrl || "https://example.com"}/include?file=`,
        description: "The file parameter can be manipulated to include remote files from external servers.",
        payload: "http://attacker.com/malicious.php",
        remediation:
          "Disable allow_url_include in PHP configuration. Validate and sanitize file paths. Use a whitelist of allowed files.",
      })
    }

    // CSRF vulnerabilities
    if (type === "csrf" || type === "comprehensive") {
      mockVulnerabilities.push({
        id: "vuln-6",
        type: "Cross-Site Request Forgery",
        severity: "medium",
        url: `${targetUrl || "https://example.com"}/account/settings`,
        description:
          "The account settings form does not implement CSRF protection, allowing attackers to submit requests on behalf of authenticated users.",
        remediation:
          "Implement anti-CSRF tokens for all state-changing operations. Verify the origin of requests and use SameSite cookies.",
      })
    }

    setVulnerabilities(mockVulnerabilities)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600 bg-red-100"
      case "high":
        return "text-orange-600 bg-orange-100"
      case "medium":
        return "text-amber-600 bg-amber-100"
      case "low":
        return "text-blue-600 bg-blue-100"
      case "info":
        return "text-slate-600 bg-slate-100"
      default:
        return "text-slate-600 bg-slate-100"
    }
  }

  const getSeverityCount = (severity: string) => {
    return vulnerabilities.filter((v) => v.severity === severity).length
  }

  const handleDownloadReport = () => {
    // Create a simple report in JSON format
    const report = {
      scanType,
      targetUrl,
      timestamp: new Date().toISOString(),
      vulnerabilities,
    }

    // Convert to a downloadable blob
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    // Create a temporary link and trigger download
    const a = document.createElement("a")
    a.href = url
    a.download = `security-scan-${targetUrl.replace(/https?:\/\//, "")}-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  if (!scanType) {
    return (
      <div className="container flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-medium mb-2">No scan results available</h2>
          <p className="text-muted-foreground mb-4">Please start a new scan to see results</p>
          <Button onClick={() => router.push("/scan")}>Start New Scan</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={() => router.push("/scan/sitemap")} className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Site Map
          </Button>
          <div className="ml-4">
            <h1 className="text-2xl font-bold">Scan Results</h1>
            <p className="text-sm text-muted-foreground">
              Target: <span className="font-medium">{targetUrl}</span> | Scan Type:{" "}
              <span className="font-medium capitalize">{scanType}</span>
            </p>
          </div>
        </div>
        <Button onClick={handleDownloadReport} className="gap-2">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Vulnerabilities Found</CardTitle>
              <CardDescription>
                {vulnerabilities.length > 0
                  ? `${vulnerabilities.length} vulnerabilities detected in this scan`
                  : "No vulnerabilities detected in this scan"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {vulnerabilities.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {vulnerabilities.map((vuln) => (
                    <AccordionItem key={vuln.id} value={vuln.id}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3 text-left">
                          <Badge className={getSeverityColor(vuln.severity)}>{vuln.severity.toUpperCase()}</Badge>
                          <span className="font-medium">{vuln.type}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <div>
                            <h4 className="text-sm font-medium mb-1">Description</h4>
                            <p className="text-sm text-muted-foreground">{vuln.description}</p>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-1">Affected URL</h4>
                            <p className="text-sm font-mono bg-muted p-2 rounded">{vuln.url}</p>
                          </div>

                          {vuln.payload && (
                            <div>
                              <h4 className="text-sm font-medium mb-1">Example Payload</h4>
                              <p className="text-sm font-mono bg-muted p-2 rounded">{vuln.payload}</p>
                            </div>
                          )}

                          <div>
                            <h4 className="text-sm font-medium mb-1">Remediation</h4>
                            <p className="text-sm text-muted-foreground">{vuln.remediation}</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Vulnerabilities Detected</h3>
                  <p className="text-muted-foreground max-w-md">
                    The scan did not detect any vulnerabilities of the selected type. However, this doesn't guarantee
                    that the website is completely secure.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add the AI Report component below the vulnerabilities card */}
          <div className="mt-6">
            <AIReport vulnerabilities={vulnerabilities} targetUrl={targetUrl} scanType={scanType} />
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Security Score</CardTitle>
              <CardDescription>Overall security assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  {vulnerabilities.length > 0 ? (
                    <>
                      <div className="inline-flex items-center justify-center rounded-full border-8 border-red-100 p-4 mb-4">
                        <span className="text-3xl font-bold text-red-600">D</span>
                      </div>
                      <h3 className="text-xl font-medium">Needs Improvement</h3>
                    </>
                  ) : (
                    <>
                      <div className="inline-flex items-center justify-center rounded-full border-8 border-green-100 p-4 mb-4">
                        <span className="text-3xl font-bold text-green-600">A</span>
                      </div>
                      <h3 className="text-xl font-medium">Excellent</h3>
                    </>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Critical</span>
                      <span className="text-sm font-medium">{getSeverityCount("critical")}</span>
                    </div>
                    <Progress
                      value={getSeverityCount("critical") > 0 ? 100 : 0}
                      className="h-2 bg-muted"
                      indicatorClassName="bg-red-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">High</span>
                      <span className="text-sm font-medium">{getSeverityCount("high")}</span>
                    </div>
                    <Progress
                      value={getSeverityCount("high") > 0 ? 100 : 0}
                      className="h-2 bg-muted"
                      indicatorClassName="bg-orange-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Medium</span>
                      <span className="text-sm font-medium">{getSeverityCount("medium")}</span>
                    </div>
                    <Progress
                      value={getSeverityCount("medium") > 0 ? 100 : 0}
                      className="h-2 bg-muted"
                      indicatorClassName="bg-amber-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Low</span>
                      <span className="text-sm font-medium">{getSeverityCount("low")}</span>
                    </div>
                    <Progress
                      value={getSeverityCount("low") > 0 ? 100 : 0}
                      className="h-2 bg-muted"
                      indicatorClassName="bg-blue-600"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vulnerabilities.length > 0 ? (
                  <>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">
                        Fix critical vulnerabilities immediately to prevent potential data breaches.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">Implement input validation and output encoding for all user inputs.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">
                        Consider implementing a Content Security Policy to mitigate XSS attacks.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">Continue regular security testing to maintain your security posture.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">
                        Consider implementing additional security headers for enhanced protection.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">
                        Stay updated with the latest security best practices and vulnerabilities.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => router.push("/scan")}>
                Start New Scan
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
