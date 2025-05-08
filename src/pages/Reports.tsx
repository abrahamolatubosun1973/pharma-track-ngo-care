
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { FileText, Download, BarChart2, Activity, Database } from "lucide-react";
import { toast } from "sonner";

export default function Reports() {
  const { user } = useAuth();
  const [datePeriod, setDatePeriod] = useState("month");
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Determine report types based on user role
  const isAdmin = user?.role === "admin";
  const isState = user?.location?.type === "state";
  const isFacility = user?.location?.type === "facility";

  // Handler for generating reports
  const handleGenerateReport = () => {
    setIsGenerating(true);
    
    // Simulate report generation with a timeout
    setTimeout(() => {
      setIsGenerating(false);
      toast.success("Report generated successfully");
    }, 1500);
  };

  // Handler for exporting as CSV
  const handleExportCSV = () => {
    toast.loading("Preparing CSV export...", { duration: 1000 });
    
    // Simulate CSV generation process
    setTimeout(() => {
      // Create mock data for CSV
      const currentTab = document.querySelector('[aria-selected="true"]')?.getAttribute('value') || 'inventory';
      const headers = getHeadersForTab(currentTab);
      const mockData = generateMockData(currentTab, 10);
      
      // Convert data to CSV format
      const csvContent = [
        headers.join(','),
        ...mockData.map(row => headers.map(header => row[header] || '').join(','))
      ].join('\n');
      
      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${currentTab}-report-${getDateString()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("CSV exported successfully");
    }, 1200);
  };

  // Handler for exporting as PDF
  const handleExportPDF = () => {
    toast.loading("Preparing PDF export...", { duration: 1500 });
    
    // Simulate PDF generation process
    setTimeout(() => {
      const currentTab = document.querySelector('[aria-selected="true"]')?.getAttribute('value') || 'inventory';
      toast.success(`PDF export of ${currentTab} report complete`, {
        description: `${currentTab}-report-${getDateString()}.pdf has been downloaded`
      });
    }, 1800);
  };
  
  // Helper function to get date string for filenames
  const getDateString = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  
  // Helper function to get headers for each tab
  const getHeadersForTab = (tab) => {
    switch(tab) {
      case 'inventory':
        return ['Item Code', 'Item Name', 'Category', 'Unit', 'Quantity', 'Expiry Date', 'Value'];
      case 'distribution':
        return ['Date', 'From', 'To', 'Item Code', 'Item Name', 'Quantity', 'Batch No'];
      case 'patients':
        return ['Visit Date', 'Patient ID', 'Name', 'Age', 'Gender', 'Diagnosis', 'Medication', 'Quantity'];
      default:
        return ['Date', 'Item', 'Value'];
    }
  };
  
  // Helper function to generate mock data for exports
  const generateMockData = (tab, count) => {
    const data = [];
    for (let i = 0; i < count; i++) {
      if (tab === 'inventory') {
        data.push({
          'Item Code': `MED${1000 + i}`,
          'Item Name': `Medication ${i+1}`,
          'Category': ['Antibiotics', 'Analgesics', 'Antivirals'][i % 3],
          'Unit': 'Tablet',
          'Quantity': Math.floor(Math.random() * 1000) + 100,
          'Expiry Date': `2026-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
          'Value': `₦${(Math.random() * 10000 + 1000).toFixed(2)}`
        });
      } else if (tab === 'distribution') {
        data.push({
          'Date': `2025-${String(Math.floor(Math.random() * 5) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
          'From': 'Central Store',
          'To': ['Abia State', 'Enugu State', 'Imo State'][i % 3],
          'Item Code': `MED${1000 + i}`,
          'Item Name': `Medication ${i+1}`,
          'Quantity': Math.floor(Math.random() * 500) + 50,
          'Batch No': `BT${2000 + i}`
        });
      } else if (tab === 'patients') {
        data.push({
          'Visit Date': `2025-${String(Math.floor(Math.random() * 5) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
          'Patient ID': `PT${10000 + i}`,
          'Name': `Patient ${i+1}`,
          'Age': Math.floor(Math.random() * 70) + 18,
          'Gender': i % 2 === 0 ? 'Male' : 'Female',
          'Diagnosis': ['Malaria', 'Typhoid', 'Hypertension', 'Diabetes'][i % 4],
          'Medication': `Medication ${i+1}`,
          'Quantity': Math.floor(Math.random() * 30) + 5
        });
      }
    }
    return data;
  };
  
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Reports & Analytics</h1>
        <p className="page-description">
          Generate and download reports on inventory and dispensing activity
        </p>
      </div>

      <Tabs defaultValue="inventory" className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            {isFacility && <TabsTrigger value="patients">Patients</TabsTrigger>}
          </TabsList>
          
          <div className="flex gap-2">
            <select 
              className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={datePeriod}
              onChange={(e) => setDatePeriod(e.target.value)}
            >
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="quarter">Last 90 days</option>
              <option value="year">Last 365 days</option>
            </select>
            <Button variant="outline" onClick={handleGenerateReport} disabled={isGenerating}>
              <FileText className="mr-2 h-4 w-4" />
              {isGenerating ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>
        </div>

        {/* Inventory Reports Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isAdmin ? "5,840" : isState ? "2,430" : "857"}
                </div>
                <p className="text-xs text-muted-foreground">items in inventory</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isAdmin ? "32" : isState ? "18" : "7"}
                </div>
                <p className="text-xs text-muted-foreground">items below reorder level</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isAdmin ? "₦23.4M" : isState ? "₦8.7M" : "₦2.1M"}
                </div>
                <p className="text-xs text-muted-foreground">total inventory value</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
              <CardDescription>
                Overview of stock levels and value over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-muted-foreground text-center">
                <BarChart2 className="mx-auto h-12 w-12 mb-3" />
                <p>Interactive inventory trend chart will appear here</p>
                <p className="text-sm">
                  Showing data for: {datePeriod === "week" ? "Last 7 days" : 
                                     datePeriod === "month" ? "Last 30 days" :
                                     datePeriod === "quarter" ? "Last 90 days" : "Last 365 days"}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleExportCSV}>
                <Download className="mr-2 h-4 w-4" />
                Export as CSV
              </Button>
              <Button variant="outline" onClick={handleExportPDF}>
                <FileText className="mr-2 h-4 w-4" />
                Export as PDF
              </Button>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Expiry Analysis</CardTitle>
                <CardDescription>
                  Medications expiring within the next 90 days
                </CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <div className="text-muted-foreground text-center">
                  <Activity className="mx-auto h-10 w-10 mb-3" />
                  <p>Expiry trend analysis will appear here</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={handleExportCSV}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Expiry Report
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
                <CardDescription>
                  Breakdown of inventory by medication category
                </CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <div className="text-muted-foreground text-center">
                  <Database className="mx-auto h-10 w-10 mb-3" />
                  <p>Category distribution chart will appear here</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={handleExportPDF}>
                  <FileText className="mr-2 h-4 w-4" />
                  View Detailed Breakdown
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* Distribution Reports Tab */}
        <TabsContent value="distribution" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Distributed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isAdmin ? "12,540" : isState ? "4,875" : "856"}
                </div>
                <p className="text-xs text-muted-foreground">items distributed</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Distribution Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isAdmin ? "46" : isState ? "28" : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {isAdmin || isState ? "completed distributions" : "not applicable"}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {isAdmin || isState ? "Recipient Locations" : "Dispensed Items"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isAdmin ? "3 States" : isState ? "8 Facilities" : "856"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {isAdmin || isState ? "receiving locations" : "dispensed to patients"}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Distribution Trends</CardTitle>
              <CardDescription>
                Analysis of distribution patterns over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-muted-foreground text-center">
                <Activity className="mx-auto h-12 w-12 mb-3" />
                <p>Distribution trend chart will appear here</p>
                <p className="text-sm">
                  Showing data for: {datePeriod === "week" ? "Last 7 days" : 
                                     datePeriod === "month" ? "Last 30 days" :
                                     datePeriod === "quarter" ? "Last 90 days" : "Last 365 days"}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleExportCSV}>
                <Download className="mr-2 h-4 w-4" />
                Export as CSV
              </Button>
              <Button variant="outline" onClick={handleExportPDF}>
                <FileText className="mr-2 h-4 w-4" />
                Export as PDF
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Patient Reports Tab */}
        {isFacility && (
          <TabsContent value="patients" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">218</div>
                  <p className="text-xs text-muted-foreground">registered patients</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Patient Visits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">423</div>
                  <p className="text-xs text-muted-foreground">total visits this period</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">376</div>
                  <p className="text-xs text-muted-foreground">prescriptions filled</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Patient Visit Analysis</CardTitle>
                <CardDescription>
                  Trend of patient visits and medication dispensing
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-muted-foreground text-center">
                  <BarChart2 className="mx-auto h-12 w-12 mb-3" />
                  <p>Patient visit trend chart will appear here</p>
                  <p className="text-sm">
                    Showing data for: {datePeriod === "week" ? "Last 7 days" : 
                                      datePeriod === "month" ? "Last 30 days" :
                                      datePeriod === "quarter" ? "Last 90 days" : "Last 365 days"}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleExportCSV}>
                  <Download className="mr-2 h-4 w-4" />
                  Export as CSV
                </Button>
                <Button variant="outline" onClick={handleExportPDF}>
                  <FileText className="mr-2 h-4 w-4" />
                  Export as PDF
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
