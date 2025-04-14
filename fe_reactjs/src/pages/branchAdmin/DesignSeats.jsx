import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import Sidebar from '../../components/Sidebar'
import SidebarBranchAdmin from './sidebarBranchAdmin'
import { useLocation, useNavigate } from 'react-router-dom'
import seatingData1 from './filter'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import { CircularProgress, Skeleton } from '@mui/material'

const DesignSeats = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { theaterData } = location.state || [];
    const [LoadingNavigate, setLoadingNavigate] = useState(false)
    const [insertRowsData, setInsertRowsData] = useState([])
    const [insertSeatsData, setInsertSeatsData] = useState([]);
    const maxRow = parseInt(theaterData?.MaxRow || 0, 10);
    const rowNames = Array.from({ length: maxRow }, (_, i) => String.fromCharCode(65 + (maxRow - i - 1)));

    useEffect(() => {
        if (theaterData?.MaxRow && theaterData?.MaxColumn) {
            const maxRow = parseInt(theaterData.MaxRow, 10);
            const maxColumn = parseInt(theaterData.MaxColumn, 10);
            let seats = [];

            for (let row = 0; row < maxRow; row++) {
                let rowName = String.fromCharCode(65 + (maxRow - row - 1));

                for (let col = 0; col < maxColumn; col++) {
                    seats.push({
                        SeatNumber: maxColumn - col,
                        Row: row,  // Chỉ lưu chỉ số hàng, chưa có RowID
                        RowName: rowName,
                        Column: col,
                        Area: 1,
                        Description: "Standard"
                    });
                }
            }

            setInsertSeatsData(seats);
        }
    }, [theaterData]);

    const generateRows = async (theaterID) => {
        const maxRow = parseInt(theaterData.MaxRow, 10);
        const rows = Array.from({ length: maxRow }, (_, i) => ({
            TheaterID: theaterID,
            RowName: String.fromCharCode(65 + i)
        }));

        const rowsResponse = await axios.post(`${process.env.REACT_APP_API}/row/add-rows`, rows);
        setInsertRowsData(rowsResponse.data.data); // Lưu vào state
        return rowsResponse.data.data;
    };

    const handleSeatClick = (seat) => {
        setInsertSeatsData(prevSeats => {
            let updatedSeats;
            const existingSeat = prevSeats.find(s => s.Row === seat.Row && s.Column === seat.Column);

            if (existingSeat) {
                // ❌ Xóa ghế nếu đã tồn tại
                updatedSeats = prevSeats.filter(s => !(s.Row === seat.Row && s.Column === seat.Column));
            } else {
                // ✅ Thêm ghế mới vào danh sách nhưng không cần RowID
                updatedSeats = [...prevSeats, {
                    ...seat,
                    Description: seat.Description || "Standard"
                }];
            }

            // Lọc ghế của hàng hiện tại
            const currentRowSeats = updatedSeats.filter(s => s.Row === seat.Row);

            // Sắp xếp lại theo Column giảm dần
            const reindexedSeats = currentRowSeats
                .sort((a, b) => b.Column - a.Column)
                .map((s, index) => ({ ...s, SeatNumber: index + 1 }));

            // Gộp lại danh sách ghế mới
            const finalSeats = updatedSeats
                .filter(s => s.Row !== seat.Row) // Giữ nguyên các hàng khác
                .concat(reindexedSeats);

            return finalSeats;
        });
    };

    const ReturnAddTheater = () => {
        navigate(`/addTheater`)
    }

    const createTheaterAndSeats = async () => {
        try {
            const theaterResponse = await axios.post(`${process.env.REACT_APP_API}/theater/add-theater`, theaterData);
            const theaterID = theaterResponse.data.data.TheaterID;
            console.log("Theater Created:", theaterResponse.data);

            // Tạo hàng ghế và lấy danh sách RowID
            const rowsData = await generateRows(theaterID);

            // Cập nhật danh sách ghế với RowID từ rowsData
            const updatedSeats = insertSeatsData.map(seat => {
                const matchingRow = rowsData.find(row => row.RowName === seat.RowName);
                return matchingRow ? { ...seat, RowID: matchingRow.RowID } : seat;
            });

            setInsertSeatsData(updatedSeats); // Lưu danh sách ghế đã cập nhật RowID

            // Gửi request tạo ghế
            const seatsResponse = await axios.post(`${process.env.REACT_APP_API}/seat/add-seats`, updatedSeats);
            console.log("Seats Created:", seatsResponse.data);

            // alert("Rạp chiếu, hàng ghế và ghế đã được tạo thành công!");
            toast.success("Tạo rạp chiếu thành công!");

            setLoadingNavigate(true)

            // navigate(`/manageTheater`)
            setTimeout(() => {
                navigate(`/manageTheater`);
            }, 3500);
        } catch (error) {
            console.error("Lỗi khi tạo rạp chiếu:", error);
            alert("Đã xảy ra lỗi, vui lòng thử lại!");
        }
    };

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Container fluid style={{ flex: 1 }}>
                <Row style={{ height: '100%' }}>
                    <Sidebar links={SidebarBranchAdmin} />
                    <Col md={9} className="p-4">
                        {LoadingNavigate
                            ?
                            <div className="d-flex justify-content-center align-items-center" style={{ height: "100px" }}>
                                <div className='text-center'>
                                    <CircularProgress color="primary" />
                                    <h5>Chuyển đến danh sách rạp...</h5>
                                </div>
                            </div>
                            :
                            <>
                                <div className="py-3 d-flex justify-content-between align-items-center">
                                    <h4>Thiết kế vị trí ghế:</h4>
                                    <Button
                                        onClick={ReturnAddTheater}
                                        variant="dark"
                                    >
                                        Quay lại
                                    </Button>
                                </div>
                                <div style={{ background: '#eeeeee', borderRadius: '4px', padding: '30px' }}>
                                    {rowNames.map((rowName, rowIndex) => {
                                        // Tạo danh sách chỗ ngồi của hàng hiện tại
                                        const seatColumnMap = Array.from({ length: parseInt(theaterData.MaxColumn, 10) }).fill(null);

                                        insertSeatsData
                                            .filter(seat => seat.Row === rowIndex)
                                            .forEach(seat => {
                                                seatColumnMap[seat.Column] = seat;
                                            });

                                        return (
                                            <div key={rowIndex} className="d-flex justify-content-between align-items-center mb-2">
                                                {/* Tên hàng bên trái */}
                                                <div style={{ width: "30px", textAlign: "center" }}>{rowName}</div>

                                                {/* Dãy ghế */}
                                                <div className="d-flex">
                                                    {seatColumnMap.map((seat, columnIndex) => (
                                                        <Button
                                                            key={columnIndex}
                                                            variant={seat ? "outline-danger" : "outline-secondary"}
                                                            onClick={() => {
                                                                const seatData = seat || {
                                                                    Row: rowIndex,
                                                                    Column: columnIndex,
                                                                    RowName: rowName,
                                                                    Area: 1,
                                                                    SeatNumber: parseInt(theaterData.MaxColumn, 10) - columnIndex
                                                                };
                                                                handleSeatClick(seatData)
                                                            }}
                                                            style={{
                                                                width: "22px",
                                                                height: "22px",
                                                                fontSize: "14px",
                                                                margin: "0 3px",
                                                                padding: "0"
                                                            }}
                                                        >
                                                            {seat ? seat.SeatNumber : "+"}
                                                        </Button>
                                                    ))}
                                                </div>

                                                {/* Tên hàng bên phải */}
                                                <div style={{ width: "30px", textAlign: "center" }}>{rowName}</div>
                                            </div>
                                        );
                                    })}
                                    <p className="text-center text-secondary mb-2 mt-4">Màn hình</p>
                                    <div className="border border-2 border-secondary mb-2"></div>
                                    <div>Lưu ý: thiết kế vị trí ghế ngồi của rạp chiếu để đồng nhất với rạp chiếu đã được xây dựng ở chi nhánh</div>
                                </div>
                                <div className='d-flex flex-row-reverse pt-3'>
                                    <Button
                                        variant='secondary'
                                        onClick={() => createTheaterAndSeats()}
                                    >
                                        Tạo rạp chiếu
                                    </Button>
                                </div>
                            </>
                        }
                    </Col>
                </Row>
            </Container>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    )
}

export default DesignSeats
