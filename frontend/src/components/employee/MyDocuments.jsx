import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Table, Card, Form, Dropdown, Modal, Button } from 'react-bootstrap';
import Header from './Header';
import SideMenu from './SideMenu';
import Loader from '../Loader';
import SignatureCanvas from 'react-signature-canvas';
import { ToastContainer, toast } from 'react-toastify';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { AiOutlineDownload, AiOutlineEdit } from 'react-icons/ai';
import axios from 'axios';
import Cookies from 'js-cookie';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/MyDocuments.css';

const ITEMS_PER_PAGE = 6;

export default function MyDocuments() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [myDocuments, setMyDocuments] = useState([]);

  const sigCanvas = useRef(null);

  // Fetch documents on mount
  const fetchDocuments = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('/api/employees/my-documents', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyDocuments(response.data.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load documents.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const filteredDocuments = myDocuments.filter(doc => {
    const documentYear = new Date(doc.document_receiveDate).getFullYear();
    return documentYear === parseInt(selectedYear, 10);
  });

  const totalPages = Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredDocuments.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedYear]);

  const openSignatureModal = (documentId) => {
    const document = myDocuments.find(doc => doc.document_ID === documentId);
    if (document?.signature_status) {
      toast.error('This document is already signed.');
    } else {
      setShowSignatureModal(true);
      setSelectedDocumentId(documentId);
    }
  };

  const saveSignature = async () => {
    if (sigCanvas.current) {
      const signatureData = sigCanvas.current.toDataURL('image/png');
      try {
        const token = localStorage.getItem('authToken');
        await axios.post(
          '/api/employees/my-documents/save-signature',
          { documentId: selectedDocumentId, signature: signatureData },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Signature saved successfully.');
        setShowSignatureModal(false);
        fetchDocuments(); // Refresh the document list
      } catch (error) {
        console.error(error);
        toast.error('Failed to save the signature.');
      }
    }
  };

  const clearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
  };
  const downloadDocument = async (documentId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`/api/employees/my-documents/download/${documentId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Document_${documentId}.pdf`;
      link.click();
      link.remove();
      toast.success('Document downloaded successfully.');
    } catch (error) {
      console.error(error);
      toast.error('Failed to download the document.');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="d-flex" style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <SideMenu />
      <div className="flex-grow-1" style={{ padding: '20px' }}>
        <Header title="My Documents" />
        <div className="mt-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5>My Documents</h5>
            <Form.Select
              style={{ width: '120px' }}
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
          <Card>
            <Card.Body>
              <Table hover>
                <thead>
                  <tr>
                    <th>Document Type</th>
                    <th>Received Date</th>
                    <th>Signed Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map(doc => (
                    <tr key={doc.document_ID}>
                      <td>{doc.document_type}</td>
                      <td>
                        {new Date(doc.document_receiveDate).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td>
                        {doc.signature_status ? (
                          <span className="badge bg-success">Signed</span>
                        ) : (
                          <span className="badge bg-warning text-dark">Not Signed</span>
                        )}
                      </td>
                      <td className="text-center">
                        <Dropdown align="end">
                          <Dropdown.Toggle variant="link" className="p-0">
                            <BsThreeDotsVertical />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => openSignatureModal(doc.document_ID)}>
                              <AiOutlineEdit /> Sign Document
                            </Dropdown.Item>
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

      <Modal show={showSignatureModal} onHide={() => setShowSignatureModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Sign Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SignatureCanvas
            ref={sigCanvas}
            penColor="black"
            canvasProps={{ width: 400, height: 200, className: 'signature-canvas' }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={clearSignature}>
            Clear
          </Button>
          <Button variant="primary" onClick={saveSignature}>
            Save Signature
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
  );
}
