import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import DashboardSidebar from '../components/DashboardSidebar'; // add sidebar

const DashboardLayout = styled.div`
  display: flex;
  height: 100%;
`;

const DashboardWrapper = styled.div`
  flex: 1;
  padding: 2rem;
  background-color: #f1f5f9;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #0f172a;
  margin-bottom: 2rem;
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
`;

const StatCard = styled.div`
  background-color: #fff;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  justify-content: center;

  h3 {
    font-size: 1.2rem;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1.8rem;
    color: #0f172a;
    font-weight: bold;
  }
`;

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    buyers: 0,
    sellers: 0,
    brokers: 0,
    messages: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [buyersRes, sellersRes, brokersRes, messagesRes] = await Promise.all([
          axios.get("http://localhost:5000/api/buyer/count"),
          axios.get("http://localhost:5000/api/seller/count"),
          axios.get("http://localhost:5000/api/broker/count"),
          axios.get("http://localhost:5000/api/contact/count"),
        ]);

        setStats({
          buyers: buyersRes.data.count,
          sellers: sellersRes.data.count,
          brokers: brokersRes.data.count,
          messages: messagesRes.data.count,
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <DashboardLayout>
      <DashboardWrapper>
        <Title>Admin Dashboard</Title>
        <CardContainer>
          <StatCard>
            <h3>Total Buyers</h3>
            <p>{stats.buyers}</p>
          </StatCard>
          <StatCard>
            <h3>Total Sellers</h3>
            <p>{stats.sellers}</p>
          </StatCard>
          <StatCard>
            <h3>Total Brokers</h3>
            <p>{stats.brokers}</p>
          </StatCard>
          <StatCard>
            <h3>Messages</h3>
            <p>{stats.messages}</p>
          </StatCard>
        </CardContainer>
      </DashboardWrapper>
    </DashboardLayout>
  );
};

export default AdminDashboard;
