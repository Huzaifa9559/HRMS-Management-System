import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Table, Card, Form, Dropdown, Modal, Button } from 'react-bootstrap';
import Header from './Header';
import SideMenu from './SideMenu';
import Loader from '../../Loader';
import SignatureCanvas from 'react-signature-canvas';
import { ToastContainer, toast } from 'react-toastify';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { AiOutlineEye, AiOutlineDownload, AiOutlineEdit } from 'react-icons/ai';
import axios from 'axios';
import Cookies from 'js-cookie';
import 'react-toastify/dist/ReactToastify.css'
import '../../../styles/MyDocuments.css'; // Import your CSS file for custom styles

const ITEMS_PER_PAGE = 6;

export default function MyDocuments() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState({ type: "", message: "" });
  const [myDocuments, setMyDocuments] = useState([]);
  const [signatures, setSignatures] = useState([]);

  const sigCanvas = useRef(null);

  const fetchDocuments = useCallback(async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get('/api/employees/my-documents', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setMyDocuments(response.data.data);

    } catch (error) {
      console.error(error);
    }
  }, [showSignatureModal]);

  useEffect(() => {
    fetchDocuments(); // Call the fetch function on component mount
    const timer = setTimeout(() => setLoading(false), 1250);
    return () => clearTimeout(timer);
  }, [fetchDocuments]);

  const filteredDocuments = myDocuments.filter(doc => {
    const documentYear = new Date(doc.document_receiveDate).getFullYear();
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
  function getObjectByDocumentID(items, documentID) {
    return items.find(item => item.document_ID === documentID);
  }

  const openSignatureModal = (documentId) => {
    let check = {};
    check = getObjectByDocumentID(currentItems, documentId);
    if (check.signature_status) {
      toast.error("Already Signed!");
      setShowSignatureModal(false);
    }
    else {
      setShowSignatureModal(true);
      setSelectedDocumentId(documentId);
    }

  };

  const saveSignature = async () => {
    if (sigCanvas.current) {
      const signatureData = sigCanvas.current.toDataURL("image/png");
      try {
        const response = await fetch('/api/employees/my-documents/save-signature', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ documentId: selectedDocumentId, signature: signatureData }),
        });

        if (response.ok) {
          setFeedbackMessage({ type: "success", message: "Signature saved successfully!" });
          setShowSignatureModal(false);
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

  const downloadDocument = async (documentId) => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`/api/employees/my-documents/download/${documentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        responseType: 'blob', // Important for downloading files
      });
      toast.success(`Download successful!`);
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

    } catch (error) {
      console.error("Download failed:", error);
      toast.error(`Download failed!`);
      setFeedbackMessage({ type: "error", message: "Failed to download document." });
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
            <h5 style={{ fontWeight: '500', color: '#4b4b4b' }}>My Documents</h5>
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
                    <th>Signed Status</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((doc) => (
                    <tr key={doc.document_ID}>
                      <td>{doc.document_type}</td>
                      <td>{new Date(doc.document_receiveDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td>
                        {doc.signature_status ? (
                          <span className="status-box signed">
                            Signed on {new Date(doc.signature_signedAt).toLocaleDateString('en-GB')}
                          </span>
                        ) : (
                          <span className="status-box not-signed">
                            Not Signed
                          </span>
                        )}
                      </td>
                      <td className="text-center">
                        <Dropdown align="end">
                          <Dropdown.Toggle variant="link" className="p-0 custom-dropdown-toggle">
                            <BsThreeDotsVertical />
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="custom-dropdown-menu">
                            <Dropdown.Item onClick={() => openSignatureModal(doc.document_ID)} className="d-flex align-items-center gap-2">
                              <AiOutlineEdit /> Digital Signature
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => downloadDocument(doc.document_ID)} className="d-flex align-items-center gap-2">
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
          {/* yaha par current item. status wo us document id ka status return karna chyai hai*/}
          {signatures.signature_status ? (
            <img src={signatures.signature} alt="Existing Signature" style={{ width: '100%', height: 'auto' }} />
          ) : (
            <SignatureCanvas
              ref={sigCanvas}
              penColor="black"
              canvasProps={{
                width: 400,
                height: 200,
                className: 'signature-canvas'
              }}
            />
          )}
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
      <ToastContainer />
    </div>
  );
}
