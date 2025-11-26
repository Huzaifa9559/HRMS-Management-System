import React, { useState, useEffect, useCallback } from 'react';
import { Table, Card, Form, Dropdown } from 'react-bootstrap';
import Header from './Header';
import SideMenu from './SideMenu';
import Loader from '../Loader';
import { ToastContainer, toast } from 'react-toastify';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { AiOutlineDownload } from 'react-icons/ai';
import axios from 'axios';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';

const ITEMS_PER_PAGE = 6;

const ADocuments = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState('Month');
  const [selectedDepartment, setSelectedDepartment] = useState('Human Resources (HR)');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);

  // Fetch documents on mount
  const fetchDocuments = useCallback(async () => {
    try {
      const response = await axios.get('/api/admin/my-documents');
      setDocuments(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load documents.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Filter documents based on filters
  const filteredDocuments = documents.filter(doc => {
    const documentYear = new Date(doc.document_receiveDate).getFullYear();
    const departmentFilter = selectedDepartment === 'Department' || doc.department === selectedDepartment;
    const monthFilter = selectedMonth === 'Month' || doc.month === selectedMonth;
    const yearFilter = documentYear === parseInt(selectedYear, 10);
    return departmentFilter && monthFilter && yearFilter;
  });

  const totalPages = Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredDocuments.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedYear, selectedMonth, selectedDepartment]);

  const downloadDocument = async (documentId) => {
    try {
      const response = await axios.get(`/api/admin/my-documents/download/${documentId}`,{
        responseType: 'blob',
      });

       const contentType = response.headers['content-type']; // MIME type
        const contentDisposition = response.headers['content-disposition']; // File name info
        const fileName = contentDisposition
            ? contentDisposition.split('filename=')[1]?.replace(/['"]/g, '') // Extract file name
            : 'downloaded-document';

        // Create a Blob with the appropriate type
      const blob = new Blob([response.data], { type: contentType });
      //const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      link.remove();
      toast.success('Document downloaded successfully.');
    } catch (error) {
      toast.error('Failed to download the document.');
    }
  };

  if (loading) {
    return <Loader />;
  }

  const departments = ['Department', ...new Set(documents.map(doc => doc.department))];
  const months = ['Month', ...new Set(documents.map(doc => doc.month))];

  return (
    <div className="d-flex" style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <SideMenu />
      <div className="flex-grow-1" style={{ padding: '20px' }}>
        <Header title="Documents Management" />
        <div className="mt-4">
          {/* Filters Section */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5>All Documents</h5>
            <div className="d-flex">
              <Form.Select
                className="dropdown"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                style={{ marginRight: '10px' }}
              >
                {departments.map((department, index) => (
                  <option key={index} value={department}>
                    {department}
                  </option>
                ))}
              </Form.Select>
              <Form.Select
                className="dropdown"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={{ marginRight: '10px' }}
              >
                {months.map((month, index) => (
                  <option key={index} value={month}>
                    {month}
                  </option>
                ))}
              </Form.Select>
              <Form.Select
                className="dropdown"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {Array.from({ length: 10 }, (_, i) => currentYear - i).map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Form.Select>
            </div>
          </div>

          {/* Table Section */}
          <Card>
            <Card.Body>
              <Table hover>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Document Type</th>
                    <th>Uploaded At Date</th>
                    <th>Signature Status</th>
                    <th>Department</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map(doc => (
                    <tr key={doc.document_ID}>
                      <td>{doc.name}</td>
                      <td>{doc.document_type}</td>
                      <td>
                        {new Date(doc.document_receiveDate).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                <td>
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip>
                      {doc.signature_signedAt
                        ? `Signed At: ${new Date(doc.signature_signedAt).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}`
                        : 'Not signed yet'}
                    </Tooltip>
                  }
                >
                  <span className={`status ${doc.signature_status.toLowerCase()}`}>
                    {doc.signature_status}
                  </span>
                </OverlayTrigger>
              </td>
                     
                      <td>{doc.department}</td>
                      <td className="text-center align-middle">
                        <Dropdown align="end">
                          <Dropdown.Toggle variant="link" className="p-0">
                            <BsThreeDotsVertical />
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="dropdown-menu-end">
                            <Dropdown.Item onClick={() => downloadDocument(doc.document_ID)}>
                              <AiOutlineDownload /> Download
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {/* Pagination */}
          <div className="pagination-container mt-3">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ADocuments;
