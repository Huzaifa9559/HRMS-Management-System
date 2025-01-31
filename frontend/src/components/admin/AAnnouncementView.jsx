import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../Loader';
// Assuming you have the UpperMenu and SideMenu components already
import Header from './Header';
import SideMenu from './SideMenu';

const AnnouncementView = () => {
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      const announcementId = window.location.pathname.split('/').pop();
      try {
        const response = await axios.get(`/api/admin/announcements/view/${announcementId}`);
        setAnnouncement(response.data.data);
      } catch (error) {
        console.error('Error fetching announcement:', error);
      }
    };

    fetchAnnouncement();
  }, []);

  if (!announcement) return <div><Loader /></div>;

  return (
    <>
      <style>
        {`
          body {
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
          }
          .sidebar {
            width: 250px;
            min-height: 100vh;
            position: fixed;
            left: 0;
            top: 0;
            padding-top: 60px;
            background-color: #007bff;
            color: white;
            overflow-y: auto;
            box-shadow: 2px 0 5px rgba(0,0,0,0.1);
          }
          .main-content {
            margin-left: 250px;
            padding: 20px;
            background-color: #fff;
            min-height: calc(100vh - 60px);
          }
          .announcement-card {
            background-color: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            padding: 20px;
            transition: box-shadow 0.3s ease;
          }
          .announcement-card:hover {
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .announcement-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 8px;
            color: #333;
          }
          .announcement-date {
            font-size: 0.875rem;
            color: #666;
          }
          .announcement-content {
            font-size: 0.95rem;
            line-height: 1.6;
            color: #444;
          }
          @media (max-width: 768px) {
            .sidebar {
              width: 100% !important;
              position: relative !important;
              height: auto;
            }
            .main-content {
              margin-left: 0 !important;
            }
          }
        `}
      </style>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <div className="d-flex flex-grow-1">
          <div className="sidebar">
            <SideMenu />
          </div>
          <div className="main-content flex-grow-1">
            <div className="container-fluid py-4">
              <div className="mb-4">
                <a
                  href="/employee/announcements"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(-1);
                  }}
                  className="text-decoration-none text-muted"
                >
                  Back
                </a>
              </div>

              <h1 className="mb-4">Announcements</h1>

              <div className="announcement-card">
                <h2 className="announcement-title">
                  {announcement.announcement_title}
                </h2>
                <div className="announcement-date mb-3">
                  {announcement.announcement_date}
                </div>
                <div className="announcement-content">
                  {announcement.announcement_description}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnnouncementView;