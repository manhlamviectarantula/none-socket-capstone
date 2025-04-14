import React from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import Sidebar from "../../components/Sidebar";
import SidebarBranchAdmin from "./sidebarBranchAdmin";

const seatingData = {
    maxRow: 4, //tự nhập trong thông tin rạp chứ ko đếm trong code
    maxColumn: 6, //tự nhập trong thông tin rạp chứ ko đếm trong code
    rows: [
        {
            name: "A",
            index: 0,
            seats: [
                { id: "1", column: 0, row: 0 },
                { id: "2", column: 1, row: 0 },
                { id: "3", column: 2, row: 0 },
                { id: "4", column: 3, row: 0 },
            ],
        },
        {
            name: "B",
            index: 1,
            seats: [
                { id: "1", column: 0, row: 1 },
                { id: "2", column: 1, row: 1 },
                { id: "3", column: 2, row: 1 },
                { id: "4", column: 3, row: 1 },
            ],
        },
        {
            name: "C",
            index: 2,
            seats: [
                { id: "1", column: 0, row: 2 },
                { id: "2", column: 1, row: 2 },
                { id: "3", column: 2, row: 2 },
                { id: "4", column: 3, row: 2 },
            ],
        },
        {
            name: "D",
            index: 3,
            seats: [
                { id: "1", column: 0, row: 3 },
                { id: "2", column: 1, row: 3 },
                { id: "3", column: 4, row: 3 },
                { id: "4", column: 5, row: 3 },
            ],
        },
    ],
};

const TestSeat = () => {

    const renderSeats = (row) => {
        const seatColumnMap = Array(seatingData.maxColumn).fill(null); // Tạo mảng trống cho mỗi cột
        row.seats.forEach((seat) => {
            seatColumnMap[seat.column] = seat; // Gắn ghế vào đúng vị trí
        });
        // seatColumnMap = [null, null. null, null, null, null] = [6...]
        // seatColumnMap[0] = { id: "1", column: 0, row: 3 },
        // seatColumnMap[1] = { id: "2", column: 1, row: 3 },
        // seatColumnMap[2] = null 
        // seatColumnMap[3] = null 
        // seatColumnMap[4] = { id: "3", column: 4, row: 3 },
        // seatColumnMap[5] = { id: "4", column: 5, row: 3 },

        return seatColumnMap.map((seat, columnIndex) => (
            <Button
                key={columnIndex}
                variant={seat ? "outline-danger" : "outline-light"} // Ghế tồn tại hoặc không
                disabled={!seat} // Không bấm được nếu không có ghế
                style={{
                    width: "40px",
                    height: "40px",
                    textAlign: "center",
                }}
            >
                {seat ? seat.id : ""}
            </Button>
        ));
    };

    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <Container fluid style={{ flex: 1 }}>
                <Row style={{ height: "100%" }}>
                    <Sidebar links={SidebarBranchAdmin} />
                    <Col md={9} className="p-4">
                        <div className="cinema">
                            <div
                                className="seating-layout"
                                style={{
                                    display: "flex",
                                    flexDirection: "column-reverse", // Đảo ngược thứ tự các hàng
                                    gap: "10px",
                                    background: "#eeeeee"
                                }}
                            >
                                {seatingData.rows.map((row, rowIndex) => (
                                    <div
                                        key={rowIndex}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                        }}
                                    >
                                        {/* Tên hàng ghế */}
                                        <div
                                            style={{
                                                fontWeight: "bold",
                                                width: "30px",
                                                textAlign: "center",
                                            }}
                                        >
                                            {row.name}
                                        </div>

                                        {/* Ghế trong hàng */}
                                        {renderSeats(row)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default TestSeat;
