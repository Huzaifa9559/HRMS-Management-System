import React from 'react';

export default function Dashboard() {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white p-4 shadow-md">
                <div className="flex items-center mb-8">
                    <span className="text-2xl font-bold text-blue-600">HRMS</span>
                </div>
                <nav>
                    <SidebarItem label="Dashboard" active />
                    <SidebarItem label="Attendance" />
                    <SidebarItem label="Leave" />
                    <SidebarItem label="Work Schedule" />
                    <SidebarItem label="Documents" />
                    <SidebarItem label="Travel" />
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-semibold">Dashboard</h1>
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                    <SummaryCard title="Current Year Leave" value="30 Day's" />
                    <SummaryCard title="Current Month Leave" value="04 Day's" />
                    <SummaryCard title="Yesterday Working Hours" value="08 h 30 min" />
                </div>

                {/* Leave Requests and Calendar */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-lg font-semibold mb-4">Leave</h2>
                        <LeaveTable />
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-lg font-semibold mb-4">September 2023</h2>
                        {/* Placeholder for calendar */}
                        <div className="bg-gray-200 h-64 flex items-center justify-center">
                            Calendar Placeholder
                        </div>
                    </div>
                </div>

                {/* Timesheet */}
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-lg font-semibold mb-4">Timesheet</h2>
                    <Timesheet />
                </div>
            </main>
        </div>
    )
}

function SidebarItem({ label, active = false }) {
    return (
        <div className={`p-2 rounded-lg mb-2 ${active ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
            {label}
        </div>
    )
}

function SummaryCard({ title, value }) {
    return (
        <div className="bg-white p-4 rounded shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    )
}

function LeaveTable() {
    const leaveData = [
        { employee: "Brandon Kyngaard", days: "1.5 Days", status: "Pending" },
        { employee: "Brandon Kyngaard", days: "1.5 Days", status: "Pending" },
        { employee: "Brandon Kyngaard", days: "1.5 Days", status: "Approved" },
        { employee: "Brandon Kyngaard", days: "1.5 Days", status: "Pending" },
        { employee: "Brandon Kyngaard", days: "1.5 Days", status: "Pending" },
        { employee: "Brandon Kyngaard", days: "1.5 Days", status: "Pending" },
    ]

    return (
        <table className="w-full">
            <thead>
                <tr className="text-left text-xs font-semibold text-gray-600 uppercase">
                    <th className="pb-2">Employee</th>
                    <th className="pb-2">Days</th>
                    <th className="pb-2">Status</th>
                </tr>
            </thead>
            <tbody>
                {leaveData.map((item, index) => (
                    <tr key={index} className="border-t">
                        <td className="py-2">{item.employee}</td>
                        <td className="py-2">{item.days}</td>
                        <td className="py-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${item.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                {item.status}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

function Timesheet() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return (
        <table className="w-full">
            <thead>
                <tr className="text-left text-xs font-semibold text-gray-600 uppercase">
                    <th className="pb-2">Plan</th>
                    {days.map(day => <th key={day} className="pb-2">{day}</th>)}
                </tr>
            </thead>
            <tbody>
                <tr className="border-t">
                    <td className="py-2">Last Week</td>
                    {days.map(day => (
                        <td key={day} className="py-2">
                            {day === 'Sat' ? '8:00 - 18:00' : '9:00 - 18:00'}
                        </td>
                    ))}
                </tr>
            </tbody>
        </table>
    )
}