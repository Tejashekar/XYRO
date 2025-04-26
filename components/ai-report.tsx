"use client"

import { useState } from "react"
import { Loader2, Sparkles, Download, Copy, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import ReactMarkdown from "react-markdown"

interface AIReportProps {
  vulnerabilities: any[]
  targetUrl: string
  scanType: string
}

export default function AIReport({ vulnerabilities, targetUrl, scanType }: AIReportProps) {
  const [aiReport, setAiReport] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMockReport, setIsMockReport] = useState(false)

  const generateAIReport = async () => {
    if (vulnerabilities.length === 0) {
      toast({
        title: "No vulnerabilities to analyze",
        description: "The AI needs vulnerability data to generate a report.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vulnerabilities,
          targetUrl,
          scanType,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate AI report")
      }

      const data = await response.json()
      setAiReport(data.aiReport)
      setIsMockReport(data.isMockReport || false)
    } catch (error) {
      console.error("Error generating AI report:", error)
      toast({
        title: "Report generation failed",
        description: "There was an error generating the AI report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (aiReport) {
      navigator.clipboard.writeText(aiReport)
      toast({
        title: "Copied to clipboard",
        description: "The AI report has been copied to your clipboard.",
      })
    }
  }

  const downloadReport = () => {
    if (aiReport) {
      const blob = new Blob([aiReport], { type: "text/markdown" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `security-report-${targetUrl.replace(/https?:\/\//, "")}-${
        new Date().toISOString().split("T")[0]
      }.md`
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(url)
      document.body.removeChild(a)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle>AI-Powered Security Analysis</CardTitle>
        </div>
        <CardDescription>
          Generate a detailed security report with explanations and remediation steps using AI
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!aiReport && !isLoading && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Sparkles className="h-12 w-12 text-primary/50 mb-4" />
            <h3 className="text-xl font-medium mb-2">AI Report Generator</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Our AI can analyze the vulnerabilities and generate a comprehensive security report with detailed
              explanations and remediation steps.
            </p>
            <Button onClick={generateAIReport} className="gap-2">
              <Sparkles className="h-4 w-4" />
              Generate AI Report
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h3 className="text-xl font-medium mb-2">Generating Report</h3>
            <p className="text-muted-foreground max-w-md">
              Our AI is analyzing the vulnerabilities and generating a comprehensive security report. This may take a
              moment...
            </p>
          </div>
        )}

        {aiReport && !isLoading && (
          <>
            {isMockReport && (
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This is a simulated report. For AI-powered analysis, please configure your OpenAI API key.
                </AlertDescription>
              </Alert>
            )}
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div className="bg-muted/50 rounded-lg p-4 max-h-[500px] overflow-y-auto">
                <ReactMarkdown>{aiReport}</ReactMarkdown>
              </div>
            </div>
          </>
        )}
      </CardContent>
      {aiReport && !isLoading && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={copyToClipboard} className="gap-2">
            <Copy className="h-4 w-4" />
            Copy Report
          </Button>
          <Button onClick={downloadReport} className="gap-2">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
