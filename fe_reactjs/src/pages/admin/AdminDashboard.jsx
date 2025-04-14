import React from 'react';
import { Col, Container, Row, Card, Button } from 'react-bootstrap';
import { Group, Business, Movie, AttachMoney, Stadium, EventSeat } from '@mui/icons-material'; // MUI icons
import Sidebar from '../../components/Sidebar';
import SidebarAdmin from './sidebarAdmin';

const AdminDashboard = () => {
    const statistics = [
        { title: 'Thành viên', value: 1200, color: '#4CAF50', icon: <Group fontSize="large" /> },
        { title: 'Chi nhánh', value: 15, color: '#2196F3', icon: <Business fontSize="large" /> },
        { title: 'Rạp phim', value: 50, color: '#FFC107', icon: <Stadium fontSize="large" /> },
        { title: 'Phim đang chiếu', value: 50, color: '#0dcaf0', icon: <Movie fontSize="large" /> },
        { title: 'Doanh thu tháng này', value: '~ 2.5 tỷ VND', color: '#FF5722', icon: <AttachMoney fontSize="large" /> },
        { title: 'Tổng ghế đã bán', value: '12,000', color: '#dc3545', icon: <EventSeat fontSize="large" /> },
        ];

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Container fluid style={{ flex: 1 }}>
                <Row style={{ height: '100%' }}>
                    <Sidebar links={SidebarAdmin} />

                    <Col md={9} className="p-4">
                        <div className="py-3 d-flex justify-content-between align-items-center">
                            <h4>Số liệu cơ bản</h4>
                        </div>

                        <Row>
                            {statistics.map((stat, index) => (
                                <Col md={3} key={index} className="mb-4">
                                    <Card
                                        className="shadow-sm"
                                        style={{
                                            borderRadius: '12px',
                                            textAlign: 'center',
                                            backgroundColor: stat.color,
                                            color: 'white',
                                        }}
                                    >
                                        <Card.Body>
                                            <div className="d-flex justify-content-center mb-3">
                                                {stat.icon}
                                            </div>
                                            <h5 className="mb-2">{stat.title}</h5>
                                            <h3 style={{ fontWeight: 'bold' }}>{stat.value}</h3>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        {/* Thêm button Chi tiết thống kê */}
                        <div className="d-flex justify-content-center mt-4">
                            <Button
                                variant="dark"
                                size="lg"
                                style={{ width: '100%', maxWidth: '400px' }}
                                onClick={() => alert('Đi đến trang chi tiết thống kê')}
                            >
                                Xem chi tiết thống kê
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AdminDashboard;
