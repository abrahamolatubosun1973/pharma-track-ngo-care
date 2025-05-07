
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

export default function Reports() {
  const { user } = useAuth();
  const [datePeriod, setDatePeriod] = useState("month");
  
  // Determine report types based on user role
  const isAdmin = user?.role === "admin";
  const isState = user?.location?.type === "state";
  const isFacility = user?.location?.type === "facility";
  
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
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
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
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export as CSV
              </Button>
              <Button variant="outline">
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
                <Button variant="outline" className="w-full">
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
                <Button variant="outline" className="w-full">
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
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export as CSV
              </Button>
              <Button variant="outline">
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
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export as CSV
                </Button>
                <Button variant="outline">
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
