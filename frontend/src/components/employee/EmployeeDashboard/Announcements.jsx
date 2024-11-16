import React, { useState, useEffect } from 'react';
import { Table, Card, Form, Dropdown } from 'react-bootstrap';
import Header from './Header';
import SideMenu from './SideMenu';
import Loader from '../../Loader';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { AiOutlineEye, AiOutlineDownload } from 'react-icons/ai';

const myAnnouncements = [
  { title: "For Sending Picture", creationDate: "01-08-2021", department: "HR", id: 1 },
  { title: "Policy Update", creationDate: "10-07-2021", department: "Finance", id: 2 },
  { title: "Meeting Minutes", creationDate: "15-06-2021", department: "IT", id: 3 },
  { title: "New Hire Announcement", creationDate: "05-09-2021", department: "Marketing", id: 4 },
  { title: "Holiday Schedule", creationDate: "12-10-2021", department: "Operations", id: 5 },
];

const departments = ["Departments", "HR", "Finance", "IT", "Marketing", "Operations"];
const ITEMS_PER_PAGE = 6;

export default function Announcements() {
  const [selectedDepartment, setSelectedDepartment] = useState("Departments");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1250);
    return () => clearTimeout(timer);
  }, []);

  // Filter announcements based on selected department (if it's not "Departments")
  const filteredAnnouncements = selectedDepartment === "Departments"
    ? myAnnouncements
    : myAnnouncements.filter(announcement => announcement.department === selectedDepartment);

  const totalPages = Math.ceil(filteredAnnouncements.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredAnnouncements.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1); // Reset to the first page when department changes
  }, [selectedDepartment]);

  const changePage = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="d-flex" style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <SideMenu />
      <div className="flex-grow-1" style={{ padding: '20px' }}>
        <Header title="Announcements" />
        <div className="mt-4">
          <div className="d-flex justify-content-between align-items-center" style={{ marginTop: '40px', marginBottom: '10px' }}>
            <h5 style={{ fontWeight: '500', color: '#4b4b4b' }}>Announcements List</h5>
            <Form.Select 
              style={{ width: '150px' }}
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              {departments.map((department, index) => (
                <option key={index} value={department} disabled={department === "Departments"}>
                  {department}
                </option>
              ))}
            </Form.Select>
          </div>

          <Card>
            <Card.Body>
              <Table hover className="custom-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Creation Date</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((doc) => (
                    <tr key={doc.id}>
                      <td>{doc.title}</td>
                      <td>{doc.creationDate}</td>
                      <td className="text-center">
                        <Dropdown align="end">
                          <Dropdown.Toggle variant="link" className="p-0 custom-dropdown-toggle">
                            <BsThreeDotsVertical />
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="custom-dropdown-menu">
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

      <style>{`
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
