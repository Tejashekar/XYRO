"use client"

import { useEffect, useRef } from "react"
import { Loader2 } from "lucide-react"

interface SiteMapNode {
  url: string
  links: string[]
  forms: {
    action: string
    method: string
    inputs: { name: string; type: string }[]
  }[]
}

interface SiteMapVisualizerProps {
  siteMap: Record<string, SiteMapNode>
}

export default function SiteMapVisualizer({ siteMap }: SiteMapVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !siteMap || Object.keys(siteMap).length === 0) return

    // This is a simplified visualization - in a real app, you'd use a proper graph visualization library
    // like D3.js, Cytoscape.js, or react-force-graph

    const container = containerRef.current
    container.innerHTML = ""

    // Create a simple tree-like structure
    const rootUrl = Object.keys(siteMap)[0]
    const urlObj = new URL(rootUrl)
    const baseUrl = `${urlObj.protocol}//${urlObj.hostname}`

    // Create the root node
    const rootNode = document.createElement("div")
    rootNode.className = "bg-primary/10 p-3 rounded-lg mb-2 font-medium text-center"
    rootNode.textContent = baseUrl
    container.appendChild(rootNode)

    // Create a container for child nodes
    const childrenContainer = document.createElement("div")
    childrenContainer.className = "ml-6 space-y-2"
    container.appendChild(childrenContainer)

    // Add child nodes (pages)
    const processedUrls = new Set<string>()
    processedUrls.add(baseUrl)

    Object.keys(siteMap).forEach((url) => {
      if (url === baseUrl) return

      try {
        const urlObj = new URL(url)
        const path = urlObj.pathname + urlObj.search

        if (!processedUrls.has(url)) {
          const pageNode = document.createElement("div")
          pageNode.className = "flex items-center"

          const line = document.createElement("div")
          line.className = "border-l-2 border-dashed border-muted-foreground/30 h-6 mr-2"
          pageNode.appendChild(line)

          const content = document.createElement("div")
          content.className = "bg-muted p-2 rounded flex-1 text-sm"
          content.textContent = path || "/"
          pageNode.appendChild(content)

          childrenContainer.appendChild(pageNode)
          processedUrls.add(url)

          // If this page has forms, add them as children
          const node = siteMap[url]
          if (node.forms && node.forms.length > 0) {
            const formsContainer = document.createElement("div")
            formsContainer.className = "ml-8 space-y-1 mt-1"

            node.forms.forEach((form) => {
              const formNode = document.createElement("div")
              formNode.className = "flex items-center"

              const line = document.createElement("div")
              line.className = "border-l-2 border-dotted border-muted-foreground/20 h-5 mr-2"
              formNode.appendChild(line)

              const content = document.createElement("div")
              content.className = "bg-amber-500/10 p-1 rounded text-xs"
              content.textContent = `Form: ${form.method.toUpperCase()} ${form.action}`
              formNode.appendChild(content)

              formsContainer.appendChild(formNode)
            })

            childrenContainer.appendChild(formsContainer)
          }
        }
      } catch (e) {
        console.error("Invalid URL:", url)
      }
    })

    // Add a note about the visualization
    const note = document.createElement("div")
    note.className = "text-xs text-muted-foreground mt-4 text-center"
    note.textContent =
      "Note: This is a simplified visualization. In a real application, a proper graph visualization would be used."
    container.appendChild(note)
  }, [siteMap])

  if (!siteMap || Object.keys(siteMap).length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return <div ref={containerRef} className="h-full overflow-auto p-4" />
}
