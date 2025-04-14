import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import Footer from '../../components/Footer';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addSeat, addShowtime } from '../../redux/orderRedux';
import { toast } from 'react-toastify';
import { formatBirthDate } from '../../lib/utils';

const SelectSeat = () => {
    const [seatingData, setSeatingData] = useState(null);
    const [ShowtimeInfo, setShowtimeInfo] = useState(null)
    const [selectedSeats, setSelectedSeats] = useState([]);

    const location = useLocation();
    const ShowtimeID = location.pathname.split("/")[2];
    const navigate = useNavigate();

    const dispatch = useDispatch()

    useEffect(() => {
        const getSeatingData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API}/showtime-seat/get-seat-of-showtime?ShowtimeID=${ShowtimeID}`);
                setSeatingData(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu ghế:", error);
            }
        };

        const getShowtimeInfo = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API}/showtime/get-showtimes-info-in-selectSeat/${ShowtimeID}`);
                setShowtimeInfo(response.data.data[0]);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu xuất chiếu:", error);
            }
        };

        getSeatingData();
        getShowtimeInfo()
    }, [ShowtimeID]);

    const toggleSeatSelection = (seat) => {
        if (selectedSeats.some(s => s.ShowtimeSeatID === seat.ShowtimeSeatID)) {
            setSelectedSeats(selectedSeats.filter(s => s.ShowtimeSeatID !== seat.ShowtimeSeatID));
        } else {
            setSelectedSeats([...selectedSeats, seat]);
        }
    };

    const renderSeats = (row) => {
        const seatColumnMap = Array(seatingData.maxColumn).fill(null); // Tạo mảng trống cho mỗi cột
        row.seats.forEach((seat) => {
            seatColumnMap[seat.Column] = seat; // Gắn ghế vào đúng vị trí
        });

        return seatColumnMap.map((seat, columnIndex) => (
            <Button
                key={columnIndex}
                variant={
                    !seat
                        ? "outline-light"
                        : seat.Status === true
                            ? "dark"
                            : selectedSeats.some(s => s.ShowtimeSeatID === seat.ShowtimeSeatID)
                                ? "danger"
                                : "outline-danger"
                }
                disabled={!seat || seat.Status === true} // Không bấm được nếu không có ghế hoặc ghế đã chọn
                onClick={() => {
                    if (seat.Status !== true) { // Chỉ gọi toggle nếu ghế chưa được chọn
                        toggleSeatSelection(seat);
                    }
                }}
                style={{
                    width: "22px",
                    height: "22px",
                    fontSize: "14px",
                    margin: "0 3px",
                    padding: "0"
                }}
            >
                {seat ? seat.SeatNumber : ""}
            </Button>

        ));
    };

    const calculateTotalPrice = () => {
        return selectedSeats.reduce((total, seat) => total + seat.TicketPrice, 0);
    };


    const handleNext = () => {
        if (selectedSeats.length === 0) {
            toast.warning("Vui lòng chọn ghế!!!")
        } else {
            dispatch(addSeat(selectedSeats));
            dispatch(addShowtime(ShowtimeInfo))
            navigate(`/selectFood/${ShowtimeInfo.BranchID}`);
        }
    }

    if (!seatingData) {
        return <p>Đang tải dữ liệu ghế...</p>;
    }

    return (
        <>
            <Header />
            <Container className="my-4">
                <div style={{ margin: '30px auto 35px' }}>
                    <h4 className='text-center'>
                        <span style={{ borderTop: '5px double black', borderBottom: '5px double black', padding: '5px' }}>
                            Chọn ghế
                        </span>
                    </h4>
                </div>
                <Row>
                    <Col md={3}>
                        <div>
                            <div style={{ border: '2px dashed black' }} className='mb-3 p-2 text-center '>
                                <div><strong>{ShowtimeInfo?.BranchName} - {ShowtimeInfo?.TheaterName}</strong></div>
                                <div><strong>Suất: {ShowtimeInfo?.StartTime} - {formatBirthDate(ShowtimeInfo?.ShowDate)}</strong></div>
                            </div>
                            <div style={{ border: '2px dashed black' }} className='mb-3 p-2'>
                                <h5><strong>{ShowtimeInfo?.MovieName}</strong></h5>
                                <div>Thời lượng: {ShowtimeInfo?.Duration} phút</div>
                                <Card.Img
                                    variant="top"
                                    src={`${process.env.REACT_APP_API}/${ShowtimeInfo?.Poster}`}
                                    className="w-100 rounded mt-1"
                                />
                            </div>
                        </div>
                    </Col>
                    <Col md={9} style={{ borderLeft: '2px dashed black', paddingLeft: '20px' }}>
                        <div className="mb-2 d-flex justify-content-between align-items-center">
                            <h6>Vui lòng chọn ghế:</h6>
                        </div>
                        <div className='mb-4' style={{ background: '#eeeeee', borderRadius: '4px', padding: '30px' }}>
                            {seatingData.rows.map((row, rowIndex) => (
                                <div key={rowIndex} className='d-flex justify-content-between align-items-center mb-2'>
                                    <div key={rowIndex}> {row.name} </div>
                                    <div>
                                        {renderSeats(row)}
                                    </div>
                                    <div key={rowIndex}> {row.name} </div>
                                </div>
                            ))}
                            <p className='text-center text-secondary mb-2 mt-4'>Màn hình</p>
                            <div className='mb-4 border border-2 border-secondary'></div>
                            <div className='d-flex gap-4'>
                                <div className='d-flex gap-2'>
                                    <Button
                                        variant="danger"
                                        style={{
                                            width: "22px",
                                            height: "22px",
                                            fontSize: "14px",
                                            padding: '0'
                                        }}
                                    >
                                    </Button>
                                    <div>Ghế đang chọn</div>
                                </div>
                                <div className='d-flex gap-2'>
                                    <Button
                                        // variant="dark"
                                        style={{
                                            width: "22px",
                                            height: "22px",
                                            fontSize: "14px",
                                            padding: '0',
                                            background: "#696b6e"
                                        }}
                                    >
                                    </Button>
                                    <div>Ghế đã bán</div>
                                </div>
                                <div className='ms-auto'>
                                    <div>
                                        <strong>{selectedSeats.length}x</strong> Ghế
                                    </div>
                                    <div>
                                        Ghế: <strong>{selectedSeats.map(s => `${s.RowName}${s.SeatNumber}`).join(", ")}</strong>
                                    </div>
                                    <div>
                                        Tổng cộng: <strong>{calculateTotalPrice().toLocaleString()} đ</strong>
                                    </div>
                                    <Button
                                        variant='dark'
                                        style={{
                                            width: "100%",
                                            marginTop: "10px"
                                        }}
                                        onClick={() => handleNext()}
                                    >Tiếp tục</Button>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    );
};

export default SelectSeat;