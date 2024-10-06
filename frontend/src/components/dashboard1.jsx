import React from 'react'
import { Bell, ChevronLeft, ChevronRight, Filter, MoreVertical, Search } from 'lucide-react'
import { Button } from "./button"
import { Input } from "./input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table"

const employees = [
  { id: 'EU234', name: 'Randy Aminoff', department: 'Designing', designation: 'UI UX designer', joiningDate: '05 Sep 2021', status: 'Enable' },
  { id: 'EU235', name: 'Jane Smith', department: 'Development', designation: 'Frontend Developer', joiningDate: '10 Oct 2021', status: 'Disable' },
  { id: 'EU236', name: 'John Doe', department: 'HR', designation: 'HR Manager', joiningDate: '15 Nov 2021', status: 'Enable' },
  { id: 'EU237', name: 'Alice Johnson', department: 'Marketing', designation: 'Marketing Specialist', joiningDate: '20 Dec 2021', status: 'Enable' },
  { id: 'EU238', name: 'Bob Brown', department: 'Sales', designation: 'Sales Representative', joiningDate: '25 Jan 2022', status: 'Enable' },
]

export default function dashboard1() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        <div className="p-4 flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center text-white font-bold">H</div>
          <span className="text-xl font-semibold">HRMS</span>
        </div>
        <nav className="mt-8">
          {['Dashboard', 'Organization', 'Attendance', 'Leave', 'Work Schedule', 'Documents', 'Travel Report', 'Setting'].map((item, index) => (
            <a
              key={index}
              href="#"
              className={`flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 ${item === 'Organization' ? 'bg-blue-50 text-blue-600' : ''}`}
            >
              <span className="mr-2">•</span>
              {item}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center">
            <ChevronLeft className="w-5 h-5 text-gray-400 mr-2" />
            <h1 className="text-xl font-semibold">Organization</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="w-5 h-5 text-gray-400" />
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </div>
        </header>

        {/* Employee List */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold mb-4">Employee List</h2>
              <div className="flex justify-between items-center">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input type="text" placeholder="Search Employee" className="pl-10 pr-4 py-2 w-64" />
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" className="flex items-center">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline">Export</Button>
                  <Button className="bg-green-500 hover:bg-green-600 text-white">Invite new employee</Button>
                </div>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Emp Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Joining Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.id}</TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.designation}</TableCell>
                    <TableCell>{employee.joiningDate}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${employee.status === 'Enable' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {employee.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-4 flex items-center justify-between border-t">
              <div className="text-sm text-gray-500">Showing 1 to 5 of 5 entries</div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}