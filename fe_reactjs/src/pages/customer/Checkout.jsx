import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { resetOrder } from '../../redux/orderRedux';
import { formatBirthDate } from '../../lib/utils';

const Checkout = () => {
    const dispatch = useDispatch()
    const { selectedSeats, ShowtimeInfo, orderFoods } = useSelector(state => state.order);

    const [successCheckout, setSuccessCheckout] = useState(false);

    const userinfo = useSelector((state) => state.user.currentUser.user);
    const userid = userinfo.AccountID;

    // Tính tổng giá trị của ghế
    const calculateTotalSeatPrice = () => {
        return selectedSeats.reduce((total, seat) => total + seat.TicketPrice, 0);
    };

    // Tính tổng giá trị của thức ăn
    const calculateTotalFoodPrice = () => {
        return orderFoods.reduce((total, food) => total + (food.Price * food.quantity), 0);
    };

    // Tính tổng đơn (ghế + thức ăn)
    const calculateTotalPrice = () => {
        const seatTotal = calculateTotalSeatPrice();
        const foodTotal = calculateTotalFoodPrice();
        return seatTotal + foodTotal;
    };

    const getShowtimeSeatIDData = () => {
        // Trả về một đối tượng với trường ShowtimeSeatIDs là mảng của ShowtimeSeatID
        return {
            ShowtimeSeatIDs: selectedSeats.map(seat => seat.ShowtimeSeatID)
        };
    };

    const handleCheckout = () => {
        const checkout = async () => {
            try {
                const seatList = selectedSeats.map(s => `${s.RowName}${s.SeatNumber}- ${s.TicketPrice.toLocaleString()}đ`).join("<br />");
                const orderFoodsSend = orderFoods.map(f => ({
                    FoodName: f.FoodName,
                    Description: f.Description,
                    Price: f.Price,
                    Quantity: f.quantity // Thêm số lượng
                }));
                const ShowtimeSeatIDData = getShowtimeSeatIDData();

                const orderData = {
                    BranchID: ShowtimeInfo.BranchID,
                    AccountID: userid,
                    MovieName: ShowtimeInfo.MovieName,
                    TheaterName: ShowtimeInfo.TheaterName,
                    BranchName: ShowtimeInfo.BranchName,
                    ShowDate: ShowtimeInfo.ShowDate,
                    StartTime: ShowtimeInfo.StartTime,
                    Seat: seatList,
                    Total: calculateTotalPrice() // Sử dụng tổng giá trị đã tính
                };

                // Create the order
                const addOrder = await axios.post(`${process.env.REACT_APP_API}/order/add-order`, orderData);
                const newOrderId = addOrder.data.orderID;

                await Promise.all(
                    orderFoodsSend.map(async (food) => {
                        await axios.post(`${process.env.REACT_APP_API}/orderFood/add-order-food/${newOrderId}`, food);
                    })
                );

                // Update seat status
                await axios.put(`${process.env.REACT_APP_API}/showtime-seat/update-showtime-seat-status`, ShowtimeSeatIDData);

                setSuccessCheckout(true);
                dispatch(resetOrder());
            } catch (error) {
                console.error("Lỗi khi thanh toán:", error);
            }
        };
        checkout(); // Gọi hàm checkout
    };

    const [selectedMethod, setSelectedMethod] = useState('');

    const handleRadioChange = (event) => {
        setSelectedMethod(event.target.value);
    };

    return (
        <>
            <Header />
            <Container className="my-4">
                {successCheckout ? (
                    <div style={{ border: '2px dashed black', padding: '20px' }}>
                        <div className='' style={{ background: '#eeeeee', borderRadius: '4px', padding: '30px' }}>
                            <div className='text-center'>
                                <h5 style={{ color: 'green' }}>Thanh toán thành công</h5>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div style={{ margin: '30px auto 35px' }}>
                            <h4 className='text-center'>
                                <span style={{ borderTop: '5px double black', borderBottom: '5px double black', padding: '5px' }}>
                                    Xác nhận thanh toán
                                </span>
                            </h4>
                        </div>
                        <div style={{ border: '2px dashed black', padding: '20px' }}>
                            <div className='' style={{ background: '#eeeeee', borderRadius: '4px', padding: '30px' }}>
                                <Row>
                                    <Col md={3}>
                                        <Card.Img
                                            variant="top"
                                            src={`${process.env.REACT_APP_API}/${ShowtimeInfo?.Poster}`}
                                            className="w-100 rounded"
                                        />
                                    </Col>
                                    <Col md={5} className="d-flex flex-column">
                                        <div style={{ borderBottom: "1px solid black" }}>
                                            <h4>{ShowtimeInfo.MovieName}</h4>
                                            <p>Thời lượng: {ShowtimeInfo.Duration} phút</p>
                                        </div>
                                        <div className="my-3 pb-3" style={{ borderBottom: "1px solid black" }}>
                                            <div>{ShowtimeInfo.BranchName} - {ShowtimeInfo.TheaterName}</div>
                                            <div>Suất: {ShowtimeInfo.StartTime} - {formatBirthDate(ShowtimeInfo.ShowDate)}</div>
                                            <div>Ghế: <strong>{selectedSeats.map(s => `${s.RowName}${s.SeatNumber}`).join(", ")}</strong></div>
                                            <div>
                                                Tổng cộng: <strong>{calculateTotalSeatPrice().toLocaleString()} đ</strong>
                                            </div>
                                        </div>
                                        <div className="pb-2" style={{ borderBottom: "1px solid black" }}>
                                            {orderFoods.map((food, index) => (
                                                <div key={index} style={{ marginBottom: '10px' }}>
                                                    <div>
                                                        <strong>{food.FoodName}</strong> - <span><strong>{food.Price.toLocaleString()} đ x {food.quantity}</strong></span>
                                                    </div>
                                                    {food.Description && <div><small>{food.Description}</small></div>}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-3 pb-3 d-flex justify-content-between">
                                            <h6>Tổng đơn:</h6>
                                            <h6>{calculateTotalPrice().toLocaleString()} đ</h6>
                                        </div>
                                    </Col>
                                    <Col md={4} className="d-flex flex-column">
                                        <h6 style={{ marginBottom: "25px" }}>Chọn phương thức thanh toán</h6>
                                        <Form.Check style={{ marginBottom: "15px" }}
                                            type="radio"
                                            label={
                                                <div className="d-flex align-items-center">
                                                    <img
                                                        src="https://cdn.galaxycine.vn/media/2020/10/20/momo-icon_1603203874499.png"
                                                        alt="MOMO"
                                                        style={{ width: 30, marginRight: 10 }}
                                                    />
                                                    MOMO
                                                </div>
                                            }
                                            value="MOMO"
                                            checked={selectedMethod === 'MOMO'}
                                            onChange={handleRadioChange}
                                        />
                                        <Form.Check style={{ marginBottom: "15px" }}
                                            type="radio"
                                            label={
                                                <div className="d-flex align-items-center">
                                                    <img
                                                        src="https://cdn.galaxycine.vn/media/2021/12/2/download_1638460623615.png"
                                                        alt="VNPAY"
                                                        style={{ width: 30, marginRight: 10 }}
                                                    />
                                                    VNPAY
                                                </div>
                                            }
                                            value="VNPAY"
                                            checked={selectedMethod === 'VNPAY'}
                                            onChange={handleRadioChange}
                                        />
                                        <Form.Check style={{ marginBottom: "15px" }}
                                            type="radio"
                                            label={
                                                <div className="d-flex align-items-center">
                                                    <img
                                                        src="https://cdn.galaxycine.vn/media/2024/7/10/zalopay_1720600308412.png"
                                                        alt="ZALOPAY"
                                                        style={{ width: 30, marginRight: 10 }}
                                                    />
                                                    ZALOPAY
                                                </div>
                                            }
                                            value="ZALOPAY"
                                            checked={selectedMethod === 'ZALOPAY'}
                                            onChange={handleRadioChange}
                                        />
                                        <Form.Check style={{ marginBottom: "15px" }}
                                            type="radio"
                                            label={
                                                <div className="d-flex align-items-center">
                                                    <img
                                                        src="https://cdn.galaxycine.vn/media/2022/4/29/shopee-pay_1651229746140.png"
                                                        alt="SHOPEEPAY"
                                                        style={{ width: 30, marginRight: 10 }}
                                                    />
                                                    SHOPEEPAY
                                                </div>
                                            }
                                            value="SHOPEEPAY"
                                            checked={selectedMethod === 'SHOPEEPAY'}
                                            onChange={handleRadioChange}
                                        />

                                        <Button
                                            variant="dark"
                                            style={{
                                                width: "100%",
                                                marginTop: "auto"
                                            }}
                                            onClick={() => handleCheckout()}
                                        >
                                            Thanh toán
                                        </Button>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </>
                )}
            </Container>
            <Footer />
        </>
    );
};

export default Checkout;
