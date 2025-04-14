import React, { useEffect, useState, useCallback } from 'react';
import { Button, Col, Container, Row, Modal } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import Sidebar from '../../components/Sidebar';
import SidebarAdmin from './sidebarAdmin';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { TextField } from '@mui/material';
import axios from 'axios';
import { ArrowDropDownCircle, Lock, LockOpen } from '@mui/icons-material';
import { formatBirthDate, formatDatetime } from '../../lib/utils';

const ManageAccount = () => {
    const [accounts, setAccounts] = useState([]);
    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [loading, setLoading] = useState(false);
    const [actionType, setActionType] = useState("");

    const getAccounts = useCallback(async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API}/account/get-all-accounts`);
            setAccounts(response.data.data);
            setFilteredAccounts(response.data.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách tài khoản:', error);
        }
    }, []);

    useEffect(() => {
        getAccounts();
    }, [getAccounts]);

    useEffect(() => {
        const filtered = accounts.filter(account =>
            account.Email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredAccounts(filtered);
    }, [searchTerm, accounts]);

    const handleShowDetails = (account) => {
        setSelectedAccount(account);
        setShowDetailsModal(true);
    };

    const handleOpenConfirmModal = (account) => {
        setSelectedAccount(account);
        setActionType(account.Status === 1 ? "lock" : "unlock");
        setShowConfirmModal(true);
    };

    const handleBlockAccount = async () => {
        if (!selectedAccount) return;
        setLoading(true);
        try {
            await axios.put(`${process.env.REACT_APP_API}/account/change-account-status/${selectedAccount.AccountID}`);
            await getAccounts();
            setShowConfirmModal(false);
            setShowDetailsModal(false);
        } catch (error) {
            console.error("Lỗi khi thay đổi trạng thái tài khoản:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Container fluid style={{ flex: 1 }}>
                <Row style={{ height: '100%' }}>
                    <Sidebar links={SidebarAdmin} />
                    <Col md={9} className="p-4">
                        <div className="py-3 d-flex justify-content-between align-items-center">
                            <h4>Danh sách tài khoản:</h4>
                            <TextField
                                id="standard-search"
                                label="Tìm kiếm..."
                                type="search"
                                variant="standard"
                                sx={{ width: '300px' }}
                                size="small"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Table className="custom-table" striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Email</th>
                                    <th>Trạng thái</th>
                                    <th>Loại tài khoản</th>
                                    <th>Xem chi tiết</th>
                                    <th>Khóa / Mở</th>
                                    <th>Phân quyền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAccounts.length > 0 ? (
                                    filteredAccounts.map((account) => (
                                        <tr key={account.AccountID}>
                                            <td>{account.AccountID}</td>
                                            <td>{account.Email}</td>
                                            <td style={{ color: account.Status === 1 ? "green" : "red" }}>
                                                {account.Status === 1 ? "Hoạt động" : "Đang khóa"}
                                            </td>
                                            <td>{account.AccountTypeName}</td>
                                            <td>
                                                <Button className='w-100' variant="dark" onClick={() => handleShowDetails(account)}>
                                                    <KeyboardDoubleArrowRightIcon />
                                                </Button>
                                            </td>
                                            <td>
                                                <Button
                                                    className='w-100'
                                                    variant={account.Status === 1 ? "danger" : "success"}
                                                    onClick={() => handleOpenConfirmModal(account)}
                                                    disabled={loading}
                                                >
                                                    {account.Status === 1 ? <Lock></Lock> : <LockOpen></LockOpen>}
                                                </Button>
                                            </td>
                                            <td>
                                                <Button
                                                    className='w-100'
                                                >
                                                    <ArrowDropDownCircle></ArrowDropDownCircle>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center">Không có tài khoản nào được tìm thấy.</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>

            {/* Modal hiển thị chi tiết tài khoản */}
            <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết tài khoản</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedAccount && (
                        <div>
                            <p><strong>ID:</strong> {selectedAccount.AccountID}</p>
                            <p><strong>Email:</strong> {selectedAccount.Email}</p>
                            <p><strong>Số điện thoại:</strong> {selectedAccount.PhoneNumber}</p>
                            <p><strong>Họ tên:</strong> {selectedAccount.FullName}</p>
                            <p><strong>Ngày sinh:</strong> {formatBirthDate(selectedAccount.BirthDate)}</p>
                            {/* <p><strong>Ngày sinh:</strong> {selectedAccount.BirthDate}</p> */}

                            <p><strong>Loại tài khoản:</strong> {selectedAccount.AccountTypeName}</p>
                            <p><strong>Chi nhánh quản lí:</strong> {selectedAccount.BranchName}</p>
                            <p>
                                <strong>Trạng thái:</strong>
                                <span style={{ color: selectedAccount.Status === 1 ? "green" : "red" }}>
                                    {selectedAccount.Status === 1 ? " Hoạt động" : " Đang khóa"}
                                </span>
                            </p>
                            <p><strong>Lần sửa cuối:</strong> {formatDatetime(selectedAccount.LastUpdatedAt)}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>Đóng</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal xác nhận khóa/mở khóa tài khoản */}
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedAccount && (
                        <p>
                            {actionType === "lock" ? "Bạn có chắc chắn muốn khóa tài khoản này?" : "Bạn có chắc chắn muốn mở khóa tài khoản này?"}
                        </p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>Hủy</Button>
                    <Button
                        variant={actionType === "lock" ? "danger" : "success"}
                        onClick={handleBlockAccount}
                        disabled={loading}
                    >
                        {loading ? "Đang xử lý..." : actionType === "lock" ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ManageAccount;