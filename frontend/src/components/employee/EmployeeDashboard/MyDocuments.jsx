import React, { useState, useRef, useEffect } from 'react';
import { Table, Card, Form, Dropdown, Modal, Button } from 'react-bootstrap';
import Header from './Header';
import SideMenu from './SideMenu';
import Loader from '../../Loader';
import SignatureCanvas from 'react-signature-canvas';
import { ToastContainer, toast } from 'react-toastify';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { AiOutlineEye, AiOutlineDownload, AiOutlineEdit } from 'react-icons/ai';

const myDocuments = [
  { documentType: "Job Contract", receivedDate: "01 Aug 2021", id: 1 },
  { documentType: "Promotion Letter", receivedDate: "01 Aug 2021", id: 2 },
  { documentType: "Achievement Letter", receivedDate: "01 Aug 2021", id: 3 },
  { documentType: "Salary Slip", receivedDate: "01 Sep 2021", id: 4 },
  { documentType: "Tax Form", receivedDate: "15 Feb 2022", id: 5 },
  { documentType: "Insurance Policy", receivedDate: "10 Mar 2022", id: 6 },
  { documentType: "Certificate of Employment", receivedDate: "20 Jun 2022", id: 7 },
  { documentType: "Annual Review", receivedDate: "30 Dec 2022", id: 8 },
  { documentType: "Leave Approval", receivedDate: "12 Jul 2023", id: 9 },
  { documentType: "Performance Bonus", receivedDate: "18 Dec 2023", id: 10 },
  { documentType: "Medical Certificate", receivedDate: "05 Jan 2024", id: 11 },
  { documentType: "Travel Reimbursement", receivedDate: "20 Feb 2024", id: 12 },
  { documentType: "Retirement Plan", receivedDate: "14 Mar 2024", id: 13 },
  { documentType: "Non-Disclosure Agreement", receivedDate: "01 May 2024", id: 14 },
  { documentType: "Employee Handbook", receivedDate: "10 May 2024", id: 15 },
];

const ITEMS_PER_PAGE = 6;

export default function MyDocuments() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState({ type: "", message: "" });

  const sigCanvas = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1250);
    return () => clearTimeout(timer);
  }, []);

  const filteredDocuments = myDocuments.filter(doc => {
    const documentYear = new Date(doc.receivedDate).getFullYear();
    return documentYear === parseInt(selectedYear);
  });

  const totalPages = Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredDocuments.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedYear]);

  const changePage = (page) => {
    setCurrentPage(page);
  };

  const openSignatureModal = (documentId) => {
    setSelectedDocumentId(documentId);
    setShowSignatureModal(true);
  };

  const saveSignature = async () => {
    if (sigCanvas.current) {
      const signatureData = sigCanvas.current.toDataURL("image/png");
  
      try {
        const response = await fetch('/api/save-signature', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ documentId: selectedDocumentId, signature: signatureData }),
        });
  
        if (response.ok) {
          setFeedbackMessage({ type: "success", message: "Signature saved successfully!" });
        } else {
          setFeedbackMessage({ type: "error", message: "Failed to save signature. Please try again." });
        }
      } catch (error) {
        setFeedbackMessage({ type: "error", message: "An error occurred while saving the signature." });
      }
    }
  };
    

  const clearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
  };

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
            <h5 style={{ fontWeight: '500', color: '#4b4b4b'}}>My Documents</h5>
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
                    <th>Document Type</th>
                    <th>Received Date</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((doc) => (
                    <tr key={doc.id}>
                      <td>{doc.documentType}</td>
                      <td>{doc.receivedDate}</td>
                      <td className="text-center">
                        <Dropdown align="end">
                          <Dropdown.Toggle variant="link" className="p-0 custom-dropdown-toggle">
                            <BsThreeDotsVertical />
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="custom-dropdown-menu">
                            <Dropdown.Item onClick={() => openSignatureModal(doc.id)} className="d-flex align-items-center gap-2">
                              <AiOutlineEdit /> Digital Signature
                            </Dropdown.Item>
                            <Dropdown.Item href="#view" className="d-flex align-items-center gap-2">
                              <AiOutlineEye /> View
                            </Dropdown.Item>
                            <Dropdown.Item href="#download" className="d-flex align-items-center gap-2">
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

      <Modal show={showSignatureModal} onHide={() => setShowSignatureModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Digital Signature</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SignatureCanvas
            ref={sigCanvas}
            penColor="black"
            canvasProps={{
              width: 400,
              height: 200,
              className: 'signature-canvas'
            }}
          />
        </Modal.Body>
        <Modal.Footer>
        <div className="feedback-message">
            {feedbackMessage.message && (
            <span
                style={{
                color: feedbackMessage.type === "success" ? "green" : "red",
                marginRight: "auto", // Align to the left
                }}
            >
                {feedbackMessage.message}
            </span>
            )}
        </div>
        <Button variant="secondary" onClick={clearSignature}>
            Clear
        </Button>
        <Button variant="primary" onClick={saveSignature}>
            Save Signature
        </Button>
        </Modal.Footer>


      </Modal>

      <ToastContainer />

      <style jsx>{`
        .custom-dropdown-toggle::after {
          display: none;
        }

        .custom-dropdown-menu {
          border-radius: 8px;
          padding: 8px 16px;
        }

        .custom-table tbody tr {
          height: 50px;
        }

        .pagination-container {
          display: flex;
          gap: 5px;
        }

        .pagination-btn {
          width: 32px;
          height: 32px;
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
