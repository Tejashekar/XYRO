import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { vulnerabilities, targetUrl, scanType } = await request.json()

    if (!vulnerabilities || !targetUrl) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    // Check if OpenAI API key is available
    const openaiApiKey = process.env.OPENAI_API_KEY

    // If no API key is available, generate a mock report instead
    if (!openaiApiKey) {
      console.log("OpenAI API key not found, generating mock report")
      return NextResponse.json({
        aiReport: generateMockReport(vulnerabilities, targetUrl, scanType),
        isMockReport: true,
      })
    }

    // Convert vulnerabilities to a string format for the AI prompt
    const vulnerabilitiesText = vulnerabilities
      .map(
        (v: any) => `
Type: ${v.type}
Severity: ${v.severity}
URL: ${v.url}
Description: ${v.description}
${v.payload ? `Payload: ${v.payload}` : ""}
`,
      )
      .join("\n---\n")

    // Generate the AI report
    const { text: aiReport } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
You are a cybersecurity expert analyzing vulnerability scan results. Generate a comprehensive security report based on the following scan data:

Target Website: ${targetUrl}
Scan Type: ${scanType}

Vulnerabilities Found:
${vulnerabilitiesText}

Your report should include:
1. An executive summary of the findings
2. Detailed analysis of each vulnerability with clear explanations in plain language
3. Risk assessment for the organization
4. Prioritized remediation steps with code examples where appropriate
5. General security recommendations

Format the report in markdown with appropriate headings and sections.
`,
      temperature: 0.7,
      maxTokens: 2000,
    })

    return NextResponse.json({ aiReport, isMockReport: false })
  } catch (error) {
    console.error("AI Report Generation Error:", error)
    return NextResponse.json(
      {
        aiReport: "Failed to generate AI report. Please check your OpenAI API key configuration.",
        isMockReport: true,
        error: "Failed to generate AI report. Please check your OpenAI API key configuration.",
      },
      { status: 200 },
    )
  }
}

// Function to generate a mock report when API key is not available
function generateMockReport(vulnerabilities: any[], targetUrl: string, scanType: string) {
  const criticalCount = vulnerabilities.filter((v) => v.severity === "critical").length
  const highCount = vulnerabilities.filter((v) => v.severity === "high").length
  const mediumCount = vulnerabilities.filter((v) => v.severity === "medium").length
  const lowCount = vulnerabilities.filter((v) => v.severity === "low").length

  const totalVulnerabilities = vulnerabilities.length

  return `# Security Assessment Report

## Executive Summary

A security assessment was conducted on **${targetUrl}** focusing on ${scanType} vulnerabilities. The scan identified **${totalVulnerabilities} vulnerabilities** of varying severity levels:

- Critical: ${criticalCount}
- High: ${highCount}
- Medium: ${mediumCount}
- Low: ${lowCount}

${
  totalVulnerabilities > 0
    ? "These findings indicate significant security concerns that should be addressed promptly to prevent potential exploitation."
    : "No vulnerabilities were detected in this scan, suggesting good security practices are in place for the tested vectors."
}

## Vulnerability Details

${vulnerabilities
  .map(
    (v) => `
### ${v.type} (${v.severity.toUpperCase()})

**Description:** ${v.description}

**Affected URL:** \`${v.url}\`

${v.payload ? `**Example Payload:** \`${v.payload}\`` : ""}

**Remediation:** ${v.remediation}

**Impact:** ${getSeverityImpact(v.severity)}
`,
  )
  .join("\n")}

## Risk Assessment

${getRiskAssessment(totalVulnerabilities, criticalCount, highCount)}

## Remediation Priorities

${getRemediationPriorities(vulnerabilities)}

## General Security Recommendations

1. **Implement Input Validation:** All user inputs should be validated on both client and server sides.
2. **Apply Output Encoding:** Use context-appropriate encoding for all dynamic content.
3. **Deploy Content Security Policy (CSP):** Restrict resource loading to trusted sources.
4. **Use Parameterized Queries:** Never concatenate user input directly into database queries.
5. **Implement Proper Access Controls:** Verify user permissions for all resource access.
6. **Regular Security Testing:** Conduct periodic security assessments to identify new vulnerabilities.
7. **Keep Systems Updated:** Regularly update all software components to patch known vulnerabilities.

---

*Note: This is a simulated report generated without using the OpenAI API. For more detailed analysis, please configure your OpenAI API key.*
`
}

function getSeverityImpact(severity: string) {
  switch (severity) {
    case "critical":
      return "This vulnerability poses an immediate threat to the application and could lead to complete system compromise, data breaches, or service disruption."
    case "high":
      return "This vulnerability represents a significant risk to the application security and could lead to unauthorized access to sensitive data or functionality."
    case "medium":
      return "This vulnerability presents a moderate risk and could be exploited in combination with other vulnerabilities to escalate privileges or access protected resources."
    case "low":
      return "This vulnerability presents a minimal risk but should still be addressed as part of a defense-in-depth security strategy."
    default:
      return "The impact of this vulnerability is undetermined."
  }
}

function getRiskAssessment(total: number, critical: number, high: number) {
  if (total === 0) {
    return "Based on this scan, the application appears to have good security controls in place for the tested vectors. However, this does not guarantee complete security, and regular testing should continue."
  }

  if (critical > 0) {
    return "The application is at **HIGH RISK** of compromise. Critical vulnerabilities provide attackers with direct paths to sensitive data or system control. Immediate remediation is strongly recommended before continuing production operations."
  }

  if (high > 0) {
    return "The application is at **SIGNIFICANT RISK**. The identified high-severity vulnerabilities could lead to unauthorized access to sensitive functionality or data. Prompt remediation is recommended."
  }

  return "The application is at **MODERATE RISK**. While no critical or high-severity issues were identified, the existing vulnerabilities could potentially be combined or exploited under specific circumstances. These should be addressed as part of regular security maintenance."
}

function getRemediationPriorities(vulnerabilities: any[]) {
  if (vulnerabilities.length === 0) {
    return "No specific vulnerabilities to remediate based on this scan."
  }

  const criticalAndHigh = vulnerabilities.filter((v) => v.severity === "critical" || v.severity === "high")

  if (criticalAndHigh.length === 0) {
    return "Address the identified medium and low severity issues as part of regular security maintenance."
  }

  return `
1. **Immediate Priorities:**
${criticalAndHigh.map((v, i) => `   ${i + 1}. Fix the ${v.type} vulnerability at \`${v.url}\``).join("\n")}

2. **Secondary Priorities:**
   - Address remaining medium and low severity issues
   - Implement additional security controls to prevent similar vulnerabilities
   - Conduct a follow-up scan after remediation
`
}
