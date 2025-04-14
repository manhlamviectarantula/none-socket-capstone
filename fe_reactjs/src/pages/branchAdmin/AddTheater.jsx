import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import Sidebar from '../../components/Sidebar';
import SidebarBranchAdmin from './sidebarBranchAdmin';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddTheater = () => {
    const navigate = useNavigate();
    const isBranchAdmin = useSelector(state => state.user.currentUser?.user);
    const branchName = isBranchAdmin?.BranchName || ''; 

    const [theaterData, setTheaterData] = useState({
        BranchID: isBranchAdmin.BranchID || '',
        TheaterName: '',
        Slug: '',
        TheaterType: '',
        MaxRow: '',
        MaxColumn: '',
        CreatedBy: isBranchAdmin.Email || '',
        LastUpdatedBy: isBranchAdmin.Email || ''
    });

    // Hàm chuyển đổi tiếng Việt có dấu thành không dấu
    const removeVietnameseTones = (str) => {
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu
            .replace(/đ/g, 'd').replace(/Đ/g, 'D') // Chuyển đ -> d
            .replace(/[^a-zA-Z0-9\s]/g, '') // Xóa ký tự đặc biệt
            .trim()
            .replace(/\s+/g, '-'); // Thay khoảng trắng bằng '-'
    };

    // Chuyển BranchName thành slug
    const formatBranchSlug = (branch) => {
        return '-' + removeVietnameseTones(branch.toLowerCase()).replace(/\s+/g, '');
    };

    useEffect(() => {
        const savedData = localStorage.getItem("theaterData");
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            setTheaterData({
                ...parsedData,
                MaxRow: parsedData.MaxRow ? parseInt(parsedData.MaxRow, 10) : "",
                MaxColumn: parsedData.MaxColumn ? parseInt(parsedData.MaxColumn, 10) : ""
            });
        }
    }, []);

    // Cập nhật Slug khi thay đổi TheaterName
    useEffect(() => {
        if (theaterData.TheaterName) {
            const theaterSlug = removeVietnameseTones(theaterData.TheaterName.toLowerCase());
            const branchSlug = formatBranchSlug(branchName);
            setTheaterData(prevData => ({
                ...prevData,
                Slug: `${theaterSlug}${branchSlug}`
            }));
        }
    }, [theaterData.TheaterName, branchName]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        let newValue = value;
        if (name === "MaxRow" || name === "MaxColumn") {
            newValue = parseInt(value, 10);
            if (isNaN(newValue) || newValue < 1) newValue = "";
        }

        const updatedData = { ...theaterData, [name]: newValue };
        setTheaterData(updatedData);
        localStorage.setItem("theaterData", JSON.stringify(updatedData));
    };

    const NextTheaterInfo = () => {
        if (!theaterData.TheaterName || !theaterData.Slug || !theaterData.TheaterType || !theaterData.MaxRow || !theaterData.MaxColumn) {
            toast.error("Vui lòng điền đầy đủ thông tin!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            return;
        }

        console.log("Thông tin rạp chiếu:", theaterData);
        navigate(`/designSeats`, { state: { theaterData } });
    };

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Container fluid style={{ flex: 1 }}>
                <Row style={{ height: '100%' }}>
                    <Sidebar links={SidebarBranchAdmin} />
                    <Col md={9} className="p-4">
                        <div className="py-3 d-flex justify-content-between align-items-center">
                            <h4>Nhập thông tin rạp chiếu:</h4>
                        </div>

                        <Form.Group>
                            <Form.Label className='bold'>Tên rạp:</Form.Label>
                            <Form.Control className='mb-3' type="text" name="TheaterName" value={theaterData.TheaterName} onChange={handleChange} />

                            <Form.Label className='bold'>Loại rạp:</Form.Label>
                            <Form.Control className='mb-3' type="text" name="TheaterType" value={theaterData.TheaterType} onChange={handleChange} />

                            <Form.Label className='bold'>Mã định danh (Slug):</Form.Label>
                            <Form.Control className='mb-3' type="text" name="Slug" value={theaterData.Slug} readOnly />

                            <Form.Label className='bold'>Số hàng ghế:</Form.Label>
                            <Form.Control className='mb-3' type="number" name="MaxRow" value={theaterData.MaxRow} onChange={handleChange} />

                            <Form.Label className='bold'>Số cột ghế:</Form.Label>
                            <Form.Control className='mb-3' type="number" name="MaxColumn" value={theaterData.MaxColumn} onChange={handleChange} />
                        </Form.Group>

                        <div className='d-flex flex-row-reverse'>
                            <Button variant='dark' onClick={NextTheaterInfo}>Tiếp tục</Button>
                        </div>
                    </Col>
                </Row>
            </Container>
            <ToastContainer />
        </div>
    );
};

export default AddTheater;
