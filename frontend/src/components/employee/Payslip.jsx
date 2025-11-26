import React, { useState, useEffect } from 'react';
import { Table, Card, Form } from 'react-bootstrap';
import Header from './Header';
import SideMenu from './SideMenu';
import Loader from '../Loader';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ITEMS_PER_PAGE = 6;

export default function Payslips() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [payslips, setPayslips] = useState([]);

  // Fetch payslips from the API based on the selected year
  useEffect(() => {
    const fetchPayslips = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`/api/employees/payslips/${selectedYear}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPayslips(response.data.data || []);
      } catch (error) {
        
        toast.error('Failed to fetch payslips. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPayslips();
  }, [selectedYear]);

  // Pagination calculations
  const totalPages = Math.ceil(payslips.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = payslips.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to the first page when the year changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedYear]);

  // Handle document download
  const handleDownload = async (payslipId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`/api/employees/payslips/download/${payslipId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Payslip_${payslipId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Payslip downloaded successfully.');
    } catch (error) {
      
      toast.error('Failed to download payslip. Please try again.');
    }
  };

  // Handle page change
  const changePage = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <Loader />;

  return (
    <div className="d-flex" style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <SideMenu />
      <div className="flex-grow-1" style={{ padding: '20px' }}>
        <Header title="Payslips" />
        <div className="mt-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 style={{ fontWeight: '500', color: '#4b4b4b' }}>Payslips</h5>
            <Form.Select
              style={{ width: '120px' }}
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {Array.from({ length: 10 }, (_, i) => currentYear - i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Form.Select>
          </div>
          <Card>
            <Card.Body>
              <Table hover className="custom-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Received Date</th>
                    <th className="text-end">Download</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((payslip) => (
                    <tr key={payslip.payslipID}>
                      <td>{payslip.payslip_monthName}</td>
                      <td>
                        {new Date(payslip.payslip_receiveDate).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="text-end">
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
          {/* Pagination Controls */}
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
        .custom-table th,
        .custom-table td {
          padding: 15px;
        }

        .pagination-container {
          display: flex;
          gap: 5px;
        }

        .pagination-btn {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1px solid #ddd;
          background-color: #fff;
          color: #007bff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .pagination-btn.active {
          background-color: #007bff;
          color: #fff;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
      <ToastContainer />
    </div>
  );
}
