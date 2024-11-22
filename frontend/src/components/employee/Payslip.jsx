import React, { useState, useEffect } from 'react';
import { Table, Card, Form } from 'react-bootstrap';
import Header from './Header';
import SideMenu from './SideMenu';
import Loader from '../Loader';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'

const ITEMS_PER_PAGE = 6;

export default function Payslips() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // Loading state
  const [payslips, setPayslips] = useState([]); // State to store payslips
  const [feedbackMessage, setFeedbackMessage] = useState({ type: "", message: "" });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1250); // Simulate loading
    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  // Fetch payslips from API based on selected year
  useEffect(() => {
    const fetchPayslips = async () => {
      setLoading(true); // Set loading to true while fetching
      try {
        const token = Cookies.get('token');
        const response = await axios.get(`/api/employees/payslips/${selectedYear}`, {
          headers: {
            Authorization: `Bearer ${token}` // Add token to headers
          }
        });; // Call the API
        setPayslips(response.data.data);
      } catch (error) {
        console.error('Error fetching payslips:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchPayslips(); // Call the fetch function
  }, [selectedYear]);

  // Update pagination calculations to use filteredPayslips
  const totalPages = Math.ceil(payslips.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = payslips.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to first page when year changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedYear]);

  const handleDownload = async (payslipId) => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`/api/employees/payslips/download/${payslipId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        responseType: 'blob', // Important for downloading files
      });
      // Extract the filename from the Content-Disposition header
      const disposition = response.headers.get('Content-Disposition');
      let filename = 'default_filename.pdf'; // Fallback filename

      if (disposition && disposition.indexOf('attachment') !== -1) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, ''); // Remove quotes if present
        }
      }
      // Create a URL for the file and trigger the download
      const blob = new Blob([response.data], { type: 'application/pdf' }); // Create a Blob from the response data
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`Download successful!`);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error(`Download failed!`);
      setFeedbackMessage({ type: "error", message: "Failed to download document." });
    }
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
                      <td className="col-4">{payslip.payslip_monthName}</td>
                      <td className="col-4">{new Date(payslip.payslip_receiveDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td className="col-4 text-end">
                        <button
                          className="btn btn-link text-primary p-0"
                          onClick={() => handleDownload(payslip.payslipID)}
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
      <ToastContainer />
    </div>
  );
}
