import React, { useState, useEffect } from 'react';
import { Table, Card, Form } from 'react-bootstrap';
import Header from './Header';
import SideMenu from './SideMenu';
import Loader from '../../Loader';

const payslips = [
  { month: "January", receivedDate: "02 Jan 2021", id: 1 },
  { month: "February", receivedDate: "01 Feb 2021", id: 2 },
  { month: "March", receivedDate: "02 Mar 2021", id: 3 },
  { month: "April", receivedDate: "07 Apr 2024", id: 4 },
  { month: "May", receivedDate: "02 May 2021", id: 5 },
  { month: "June", receivedDate: "04 Jun 2024", id: 6 },
  { month: "July", receivedDate: "02 Jul 2021", id: 7 },
  { month: "August", receivedDate: "02 Aug 2021", id: 8 },
  { month: "September", receivedDate: "02 Sep 2021", id: 9 },
  { month: "October", receivedDate: "02 Oct 2021", id: 10 },
  { month: "November", receivedDate: "02 Nov 2023", id: 11 },
  { month: "December", receivedDate: "02 Dec 2015", id: 12 },
];

const ITEMS_PER_PAGE = 6;

export default function Payslips() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1250); // Simulate loading
    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  // Add filter logic for payslips based on selected year
  const filteredPayslips = payslips.filter(payslip => {
    const payslipYear = new Date(payslip.receivedDate).getFullYear();
    return payslipYear === parseInt(selectedYear);
  });

  // Update pagination calculations to use filteredPayslips
  const totalPages = Math.ceil(filteredPayslips.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredPayslips.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to first page when year changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedYear]);

  const handleDownload = (id) => {
    console.log(`Downloading payslip ${id}`);
  };

  // Change page
  const changePage = (page) => {
    setCurrentPage(page);
  };

  // Show loader if loading is true
  if (loading) {
    return <Loader />;
  }
  
  return (
    <div className="d-flex" style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <SideMenu />
      <div className="flex-grow-1" style={{ padding: '20px' }}>
        <Header title="Documents" />
        <div className="mt-4">
        <div className="d-flex justify-content-between align-items-center" style={{ marginTop: '40px', marginBottom: '10px' }}>
        <h5 style={{ fontWeight: '500', color: '#4b4b4b' }}>PaySlips</h5>
        <Form.Select 
            style={{ width: '100px' }}
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
        >
            {Array.from({ length: 10 }, (_, i) => currentYear - i).map((year) => (
            <option key={year} value={year}>{year}</option>
            ))}
        </Form.Select>
        </div>

          <Card>
            <Card.Body>
              <Table hover className="custom-table">
                <thead>
                  <tr>
                    <th className="col-4">Month</th>
                    <th className="col-4">Received Date</th>
                    <th className="col-4 text-end">Download</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((payslip) => (
                    <tr key={payslip.id}>
                      <td className="col-4">{payslip.month}</td>
                      <td className="col-4">{payslip.receivedDate}</td>
                      <td className="col-4 text-end">
                        <button
                          className="btn btn-link text-primary p-0"
                          onClick={() => handleDownload(payslip.id)}
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
          {/* Compact Pagination Controls */}
          <div className="pagination-container d-flex justify-content-center mt-3">
            <button
              className="pagination-btn"
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => changePage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="pagination-btn"
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .custom-table tbody tr {
          height: 50px; /* Increase row height for spacing */
        }

        .custom-table th,
        .custom-table td {
          padding: 15px; /* Increase cell padding */
        }

        .pagination-container {
          display: flex;
          gap: 5px;
        }

        .pagination-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px solid #ddd;
          background-color: #f9f9f9;
          color: #007bff;
          font-size: 0.9rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .pagination-btn:hover {
          background-color: #007bff;
          color: #fff;
        }

        .pagination-btn.active {
          background-color: #007bff;
          color: #fff;
          font-weight: bold;
        }

        .pagination-btn:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}
