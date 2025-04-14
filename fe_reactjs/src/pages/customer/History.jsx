import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { store } from '../../redux/store';
import axios from 'axios';
import { formatBirthDate } from '../../lib/utils';

const History = () => {
    const [Orders, setOrders] = useState([]);

    const AccountID = store.getState().user.currentUser?.user.AccountID;
    useEffect(() => {
        if (!AccountID) return; // Tránh gọi API khi AccountID chưa có
        const getOrders = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API}/order/get-orders-of-account/${AccountID}`);
                setOrders(response.data.orders || []); // Use 'orders' field from response
            } catch (error) {
                console.error('Lỗi khi lấy danh sách đơn hàng:', error);
            }
        };
        getOrders();
    }, [AccountID]);

    return (
        <>
            <Header />
            <Container className="mt-4 mb-4">
                <div style={{ margin: '30px auto 35px' }}>
                    <h4 className='text-center'>
                        <span style={{ borderTop: '5px double black', borderBottom: '5px double black', padding: '5px' }}>
                            LỊCH SỬ GIAO DỊCH
                        </span>
                    </h4>
                </div>
                <div style={{ border: '2px dashed black', padding: '20px' }}>
                    <div className='' style={{ background: '#eeeeee', borderRadius: '4px', padding: '30px' }}>
                        {Orders.length === 0 ? (
                            <p className="text-center">Chưa có giao dịch nào.</p>
                        ) : (
                            Orders.map((order) => (
                                <Card key={order.OrderID} className="mb-3">
                                    <Card.Body>
                                        <Row>
                                            <Col md={9}>
                                                <h4>{order.MovieName}</h4>
                                                <div><strong>Chi nhánh: </strong>{order.BranchName} - {order.TheaterName}</div>
                                                <div><strong>Suất: </strong>{order.StartTime} - {formatBirthDate(order.ShowDate)}</div>
                                                <div><strong>Ghế: </strong><div dangerouslySetInnerHTML={{ __html: order.Seat }} /></div>
                                                {order.OrderFoods.length > 0 && (
                                                    <div>
                                                        <strong>Đồ ăn: </strong>
                                                        {order.OrderFoods.map((food) => (
                                                            <div className='d-flex gap-3' key={food.OrderFoodID}>
                                                                <div>
                                                                    {food.Price.toLocaleString()}đ x {food.Quantity}
                                                                </div>
                                                                <div>
                                                                    <strong> - {food.FoodName}: </strong> {food.Description}
                                                                </div>
                                                                
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                <div className="text-muted">
                                                    <strong>Thời gian đặt: </strong>
                                                    {new Date(order.CreatedAt).toLocaleString('vi-VN')}
                                                </div>
                                                <div className='d-flex gap-2 mt-3'>
                                                    <h5>Đã thanh toán: </h5>
                                                    <h5>{order.Total.toLocaleString()} đ</h5>
                                                </div>
                                            </Col>
                                            <Col md={3} className="text-end text-center">
                                                <Card.Img
                                                    variant="top"
                                                    src="https://anthinh.com/upload/ckfinder/images/BARCODE-1024x646.png"
                                                    style={{ width: "100%", marginBottom: "5px" }}
                                                />
                                                <div>Vui lòng đưa mã vạch trên cho nhân viên</div>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </Container>
            <Footer />
        </>
    );
};

export default History;
