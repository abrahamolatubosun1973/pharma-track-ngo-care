
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bell, Package, ArrowRight, Users } from "lucide-react";

// Mock data for dashboard
const mockStats = {
  central: {
    totalDrugs: 187,
    lowStock: 12,
    expired: 3,
    recentDistributions: [
      { id: 1, state: "Abia", date: "2023-05-01", items: 34 },
      { id: 2, state: "Enugu", date: "2023-05-02", items: 28 },
      { id: 3, state: "Imo", date: "2023-05-03", items: 41 }
    ],
    statePerformance: [
      { state: "Abia", drugsDistributed: 1245, patientsServed: 623 },
      { state: "Enugu", drugsDistributed: 1876, patientsServed: 892 },
      { state: "Imo", drugsDistributed: 1532, patientsServed: 721 }
    ]
  },
  state: {
    name: "Abia",
    totalDrugs: 76,
    lowStock: 5,
    expired: 1,
    facilitiesCount: 8,
    recentDistributions: [
      { id: 1, facility: "General Hospital Umuahia", date: "2023-05-01", items: 12 },
      { id: 2, facility: "Primary Health Center Aba", date: "2023-05-02", items: 8 },
      { id: 3, facility: "St. Mary's Hospital", date: "2023-05-03", items: 15 }
    ],
    facilityPerformance: [
      { facility: "General Hospital Umuahia", drugsDistributed: 423, patientsServed: 211 },
      { facility: "Primary Health Center Aba", drugsDistributed: 316, patientsServed: 158 },
      { facility: "St. Mary's Hospital", drugsDistributed: 389, patientsServed: 194 }
    ]
  },
  facility: {
    name: "General Hospital Umuahia",
    totalDrugs: 42,
    lowStock: 3,
    expired: 1,
    patientsServed: 211,
    dispensingHistory: [
      { date: "2023-05-01", count: 23 },
      { date: "2023-05-02", count: 18 },
      { date: "2023-05-03", count: 27 },
      { date: "2023-05-04", count: 21 },
      { date: "2023-05-05", count: 19 }
    ],
    topMedicines: [
      { name: "Paracetamol", dispensed: 87 },
      { name: "Amoxicillin", dispensed: 56 },
      { name: "Metformin", dispensed: 43 },
      { name: "Hydrochlorothiazide", dispensed: 38 }
    ]
  }
};

export default function Dashboard() {
  const { user } = useAuth();
  
  // Determine which data to show based on user's role and location
  let dashboardData;
  let dashboardType: "central" | "state" | "facility" = "central";
  
  if (user?.location) {
    dashboardType = user.location.type as "central" | "state" | "facility";
  }
  
  dashboardData = mockStats[dashboardType];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">
          Overview of pharmaceutical inventory and distribution
        </p>
      </div>

      {/* Alert Section */}
      {(dashboardData.lowStock > 0 || dashboardData.expired > 0) && (
        <Alert className="mb-6 border-yellow-200 bg-yellow-50 text-yellow-800">
          <Bell className="h-4 w-4" />
          <AlertTitle>Attention Required</AlertTitle>
          <AlertDescription className="flex flex-wrap gap-2">
            {dashboardData.lowStock > 0 && (
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                {dashboardData.lowStock} items low on stock
              </Badge>
            )}
            {dashboardData.expired > 0 && (
              <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                {dashboardData.expired} expired items
              </Badge>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {/* Total Drugs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Drugs</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalDrugs}</div>
            <p className="text-xs text-muted-foreground">items in inventory</p>
          </CardContent>
        </Card>

        {/* For Central/State: Distribution Stats */}
        {(dashboardType === "central" || dashboardType === "state") && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Distribution</CardTitle>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardType === "central" 
                  ? dashboardData.statePerformance.reduce((sum, item) => sum + item.drugsDistributed, 0)
                  : dashboardData.facilityPerformance.reduce((sum, item) => sum + item.drugsDistributed, 0)
                }
              </div>
              <p className="text-xs text-muted-foreground">drugs distributed</p>
            </CardContent>
          </Card>
        )}

        {/* For Facility: Patients Served */}
        {dashboardType === "facility" && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.patientsServed}</div>
              <p className="text-xs text-muted-foreground">patients served</p>
            </CardContent>
          </Card>
        )}

        {/* For Central: States Count */}
        {dashboardType === "central" && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">States</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.statePerformance.length}</div>
              <p className="text-xs text-muted-foreground">states supported</p>
            </CardContent>
          </Card>
        )}

        {/* For State: Facilities Count */}
        {dashboardType === "state" && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Facilities</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.facilitiesCount}</div>
              <p className="text-xs text-muted-foreground">healthcare facilities</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Performance Section */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        {/* Central: State Performance */}
        {dashboardType === "central" && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>State Performance</CardTitle>
              <CardDescription>Drug distribution and patient service by state</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.statePerformance.map((state) => (
                  <div key={state.state} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{state.state}</div>
                      <div className="text-sm text-muted-foreground">
                        {state.drugsDistributed} drugs | {state.patientsServed} patients
                      </div>
                    </div>
                    <Progress value={(state.drugsDistributed / 2000) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* State: Facility Performance */}
        {dashboardType === "state" && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Facility Performance</CardTitle>
              <CardDescription>Drug distribution and patient service by facility</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.facilityPerformance.map((facility) => (
                  <div key={facility.facility} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{facility.facility}</div>
                      <div className="text-sm text-muted-foreground">
                        {facility.drugsDistributed} drugs | {facility.patientsServed} patients
                      </div>
                    </div>
                    <Progress value={(facility.drugsDistributed / 500) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Facility: Top Medicines */}
        {dashboardType === "facility" && (
          <Card>
            <CardHeader>
              <CardTitle>Top Medicines</CardTitle>
              <CardDescription>Most frequently dispensed medicines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.topMedicines.map((medicine) => (
                  <div key={medicine.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{medicine.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {medicine.dispensed} dispensed
                      </div>
                    </div>
                    <Progress value={(medicine.dispensed / 100) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Facility: Dispensing History */}
        {dashboardType === "facility" && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Dispensing Activity</CardTitle>
              <CardDescription>Patients served in the last 5 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.dispensingHistory.map((day) => (
                  <div key={day.date} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{day.date}</div>
                      <div className="text-sm text-muted-foreground">
                        {day.count} patients
                      </div>
                    </div>
                    <Progress value={(day.count / 30) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            {dashboardType === "central" && "Latest distributions to states"}
            {dashboardType === "state" && "Latest distributions to facilities"}
            {dashboardType === "facility" && "Latest patient visits"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardType === "central" && dashboardData.recentDistributions.map((dist) => (
              <div key={dist.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <div className="font-medium">{dist.state}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(dist.date).toLocaleDateString()}
                  </div>
                </div>
                <Badge variant="secondary">{dist.items} items</Badge>
              </div>
            ))}
            
            {dashboardType === "state" && dashboardData.recentDistributions.map((dist) => (
              <div key={dist.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <div className="font-medium">{dist.facility}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(dist.date).toLocaleDateString()}
                  </div>
                </div>
                <Badge variant="secondary">{dist.items} items</Badge>
              </div>
            ))}
            
            {dashboardType === "facility" && dashboardData.dispensingHistory.map((day, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-2">
                <div>
                  <div className="font-medium">Daily Patient Visits</div>
                  <div className="text-sm text-muted-foreground">
                    {day.date}
                  </div>
                </div>
                <Badge variant="secondary">{day.count} patients</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
