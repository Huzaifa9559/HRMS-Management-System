import React, { useState, useEffect } from 'react';
import Header from './Header';
import SideMenu from './SideMenu';
import { Eye, ChevronDown } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import Loader from '../Loader';

const ADocuments = () => {
  // Mock Data with relevant fields
  const [documentData] = useState([
    { employee: 'Randy Aminoff', title: 'ID Card', department: 'Design', month: 'September', year: '2021' },
    { employee: 'Nolan Franci', title: 'Picture', department: 'Mobile Departments', month: 'September', year: '2021' },
    { employee: 'Nolan Franci', title: 'Picture', department: 'Website', month: 'August', year: '2021' },
    { employee: 'Alice Johnson', title: 'Contract', department: 'Marketing', month: 'July', year: '2021' },
    { employee: 'Jane Doe', title: 'Payslip', department: 'Finance', month: 'July', year: '2022' },
    { employee: 'Bob Brown', title: 'Picture', department: 'Mobile Departments', month: 'September', year: '2021' },
  ]);

  const [filters, setFilters] = useState({ department: 'Department', month: 'Month', year: 'Year' });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Loading state
    useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1250); // Simulate loading
    return () => clearTimeout(timer);
    }, []);



  // Filtered data based on the selected filters
  const filteredDocumentData = documentData.filter((doc) => {
    const departmentFilter = filters.department === 'Department' || doc.department === filters.department;
    const monthFilter = filters.month === 'Month' || doc.month === filters.month;
    const yearFilter = filters.year === 'Year' || doc.year === filters.year;
    return departmentFilter && monthFilter && yearFilter;
  });

  // Unique options for filters
  const departments = ['Department', ...new Set(documentData.map((doc) => doc.department))];
  const months = ['Month', ...new Set(documentData.map((doc) => doc.month))];
  const years = ['Year', ...new Set(documentData.map((doc) => doc.year))];

  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <style>
        {`
          .documents-management-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            border-radius: 12px;
          }

          .documents-management-table th,
          .documents-management-table td {
            padding: 12px 12px; /* Add consistent padding */
            text-align: left; /* Align text to the left */
          }

          .documents-management-table th {
            font-weight: 600; /* Bold header text */
            font-size: 16px;
            color: black;
            background-color: #f9f9f9; /* Light background for header */
          }

          .documents-management-table td {
            font-size: 16px;
            color: black; /* Darker text for table data */
            border-bottom: 1px solid #e5e7eb; /* Subtle bottom border for rows */
          }

          .documents-management-table tbody tr:last-child td {
            border-bottom: none; /* Remove border from the last row */
          }

          .documents-management-table tbody tr {
            transition: background-color 0.3s ease;
          }

          .documents-management-table tbody tr:hover {
            background-color: #f9fafb; /* Light gray hover effect */
            cursor: pointer; /* Pointer cursor on hover */
          }

          .filter-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
          }

          .dropdown {
            display: inline-flex; /* Align text and chevron inline */
            align-items: center; /* Vertically align the chevron with text */
            padding: 8px 12px; /* Add consistent padding for compact spacing */
            border: 1px solid #ddd;
            border-radius: 8px; /* Smooth rounded edges */
            background-color: #ffffff; /* Ensure white background for visibility */
            cursor: pointer;
            margin-right: 10px; /* Spacing between dropdowns */
            font-size: 14px; /* Adjust font size for compact look */
            width: 125px; /* Set a specific width */
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* Light shadow for better contrast */
            transition: all 0.3s ease; /* Smooth hover effect */
            }

            .dropdown svg {
            margin-left: 4px; /* Reduce spacing between text and chevron */
            flex-shrink: 0; /* Prevent chevron from resizing */
            color: #6b7280; /* Subtle color for chevron */
            }


                .dropdown:hover {
                border-color: #3b82f6; /* Add hover effect with blue border */
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2); /* Enhanced hover shadow */
                }

                .dropdown:focus-within {
                outline: none;
                border-color: #2563eb; /* Focus state border color */
                box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2); /* Focus ring for accessibility */
                }


          .btn-view {
            padding: 8px 16px;
            border: none;
            background-color: #3b82f6;
            color: white;
            border-radius: 8px;
            cursor: pointer;
          }
        `}
      </style>
      <div className="d-flex" style={{ backgroundColor: '#f9f9f9', minHeight: '100vh', overflow: 'hidden' }}>
        <SideMenu />
        <div className="flex-grow-1 d-flex flex-column p-3" style={{ overflowY: 'auto' }}>
          <Header title="Documents" />
          <main style={{ padding: '20px' }}>
            {/* Filters Section */}
            <div className="filter-section">
              <h4 style={{ marginBottom: '5px' }}>All Received</h4>
              <div className="d-flex">
              <select
                className="dropdown"
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                >
                {departments.map((department, index) => (
                    <option key={index} value={department}>
                    {department}
                    </option>
                ))}
                <ChevronDown size={16} />
                </select>

                <select
                  className="dropdown"
                  value={filters.month}
                  onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                >
                  {months.map((month, index) => (
                    <option key={index} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
                <select
                  className="dropdown"
                  value={filters.year}
                  onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                >
                  {years.map((year, index) => (
                    <option key={index} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg p-3">
              <table className="documents-management-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Title</th>
                    <th>Departments</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocumentData.map((doc, index) => (
                    <tr key={index}>
                      <td>{doc.employee}</td>
                      <td>{doc.title}</td>
                      <td>{doc.department}</td>
                      <td>
                        <button
                          className="btn btn-link"
                          onClick={() => navigate("/admin/view-employee-leave")}
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default ADocuments;
