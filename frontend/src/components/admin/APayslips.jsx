import React, { useState, useEffect, useMemo } from 'react';
import { Table, Card, Form } from 'react-bootstrap';
import Header from './Header';
import SideMenu from './SideMenu';
import Loader from '../Loader';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ITEMS_PER_PAGE = 10;

export default function AllEmployeesPayslips() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [payslips, setPayslips] = useState([]);

  // Fetch all employees' payslips
  useEffect(() => {
    const fetchPayslips = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/admin/payslips`);
        setPayslips(response.data.data || []);
      } catch (error) {
        console.error('Error fetching payslips:', error);
        toast.error('Failed to fetch payslips. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPayslips();
  }, []);

  // Dynamically filter payslips based on selected filters
  const filteredPayslips = useMemo(() => {
    return payslips.filter(
      (payslip) =>
        (selectedDepartment === 'All Departments' || payslip.department === selectedDepartment) &&
        (!selectedYear || payslip.payslip_year === Number(selectedYear))
    );
  }, [payslips, selectedDepartment, selectedYear]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredPayslips.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredPayslips.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to the first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedYear, selectedDepartment]);

  // Handle document download
  const handleDownload = async (payslipId) => {
    try {
      const response = await axios.get(`/api/admin/payslips/download/${payslipId}`, {
        responseType: 'blob',
      });
      const contentType = response.headers['content-type']; // MIME type
      const contentDisposition = response.headers['content-disposition']; // File name info
      const fileName = contentDisposition
        ? contentDisposition.split('filename=')[1]?.replace(/['"]/g, '') // Extract file name
        : 'downloaded-document';

      const blob = new Blob([response.data], { type: contentType });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Payslip downloaded successfully.');
    } catch (error) {
      console.error('Error downloading payslip:', error);
      toast.error('Failed to download payslip. Please try again.');
    }
  };

  if (loading) return <Loader />;

  // Extract unique departments for filter dropdown
  const departments = [
    'All Departments',
    ...new Set(payslips.map((payslip) => payslip.department)),
  ];

  return (
    <div className="d-flex" style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <SideMenu />
      <div className="flex-grow-1" style={{ padding: '20px' }}>
        <Header title="All Employees Payslips" />
        <div className="mt-4">
          {/* Filters */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 style={{ fontWeight: '500', color: '#4b4b4b' }}>All Employees Payslips</h5>
            <div className="d-flex">
              <Form.Select
                style={{ marginRight: '10px' }}
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                {departments.map((department, index) => (
                  <option key={index} value={department}>
                    {department}
                  </option>
                ))}
              </Form.Select>
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
          </div>
          {/* Table */}
          <Card>
            <Card.Body>
              <Table hover className="custom-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Month</th>
                    <th>Received Date</th>
                    <th className="text-end">Download</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((payslip) => (
                    <tr key={payslip.payslipID}>
                      <td>{payslip.name}</td>
                      <td>{payslip.department}</td>
                      <td>{payslip.month}</td>
                      <td>
                        {new Date(payslip.receiveDate).toLocaleDateString('en-GB', {
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
          {/* Pagination */}
          <div className="pagination-container d-flex justify-content-center mt-3">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
