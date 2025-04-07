"use client"

import { useState, useEffect } from "react"
import type { Report } from "@/types/zoo-types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Download, FileText, Printer } from "lucide-react"

interface ReportViewerProps {
  report: Report
  onBack: () => void
}

export function ReportViewer({ report, onBack }: ReportViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  useEffect(() => {
    // In a real app, this would fetch the actual report file
    // For demo purposes, we'll use sample PDFs based on the report category
    const fetchReport = async () => {
      setIsLoading(true)
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Map report categories to sample PDF URLs
        const pdfUrls: Record<string, string> = {
          Health: "https://www.africau.edu/images/default/sample.pdf",
          Inventory: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          Financial: "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf",
          Incident: "https://file-examples.com/storage/fe8c7eef0c6364f6c9504cc/2017/10/file-sample_150kB.pdf",
        }

        // Get the URL for the report category or use a default
        const url = pdfUrls[report.category] || pdfUrls["Health"]
        setPdfUrl(url)
      } catch (error) {
        console.error("Error fetching report:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReport()
  }, [report])

  const handleDownload = () => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank")
    }
  }

  const handlePrint = () => {
    if (pdfUrl) {
      const iframe = document.getElementById("report-iframe") as HTMLIFrameElement
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.focus()
        iframe.contentWindow.print()
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">{report.title}</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Card className="md:w-1/3">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Report Details</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Category:</span>
                    <span className="text-sm font-medium">{report.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Date:</span>
                    <span className="text-sm font-medium">{new Date(report.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Author:</span>
                    <span className="text-sm font-medium">{report.author}</span>
                  </div>
                </div>
              </div>

              {report.content && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Summary</h3>
                  <p className="mt-2 text-sm">{report.content}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex-1">
          <Tabs defaultValue="preview">
            <TabsList className="mb-4">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="text">Text View</TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="h-[600px] border rounded-md">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="space-y-4 w-full max-w-md">
                    <Skeleton className="h-8 w-3/4 mx-auto" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ) : pdfUrl ? (
                <iframe id="report-iframe" src={pdfUrl} className="w-full h-full" title={report.title} />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">Report preview not available</p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="text" className="h-[600px] border rounded-md p-4 overflow-auto">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold">{report.title}</h1>
                  <div className="text-sm text-muted-foreground">
                    <p>Author: {report.author}</p>
                    <p>Date: {new Date(report.date).toLocaleDateString()}</p>
                    <p>Category: {report.category}</p>
                  </div>
                  <div className="border-t pt-4">
                    {report.content ? (
                      <p>{report.content}</p>
                    ) : (
                      <p className="text-muted-foreground italic">
                        This is a sample report content for {report.title}. In a real application, this would contain
                        the actual text content of the report document. The content would be extracted from the PDF or
                        other document format and displayed here for easy reading without requiring the PDF viewer.
                      </p>
                    )}

                    <div className="mt-4 space-y-2">
                      <h2 className="text-xl font-semibold">Sample Report Content</h2>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam
                        ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget
                        aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.
                      </p>
                      <p>
                        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                        nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                        dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                      </p>
                      <h3 className="text-lg font-semibold">Key Findings</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Finding 1: Lorem ipsum dolor sit amet</li>
                        <li>Finding 2: Consectetur adipiscing elit</li>
                        <li>Finding 3: Nullam euismod, nisl eget aliquam ultricies</li>
                        <li>Finding 4: Quis aliquam nisl nunc quis nisl</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

