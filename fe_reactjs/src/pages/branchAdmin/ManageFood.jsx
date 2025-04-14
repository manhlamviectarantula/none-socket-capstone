import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row, Table, Modal, Form, Image } from 'react-bootstrap';
import Sidebar from '../../components/Sidebar';
import SidebarBranchAdmin from './sidebarBranchAdmin';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { store } from '../../redux/store';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageFood = () => {
    const [foods, setFoods] = useState([]);
    const [FoodName, setFoodName] = useState("");
    const [ImageFood, setImageFood] = useState(null);
    const [Price, setPrice] = useState("");
    const [Description, setDescription] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [selectedFood, setSelectedFood] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const isBranchAdmin = store.getState().user.currentUser?.user;

    useEffect(() => {
        if (!isBranchAdmin.BranchID) return;

        const getFoods = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API}/food/get-foods-of-branch/${isBranchAdmin.BranchID}`
                );
                setFoods(response.data || []);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách thức ăn:', error);
            }
        };

        getFoods();
    }, [isBranchAdmin.BranchID]);

    const handleEditClick = (food) => {
        setSelectedFood(food);
        setShowEditModal(true);
    };

    const addFoodClick = () => {
        setShowAddModal(true);
    }

    const handleDeleteClick = (food) => {
        setSelectedFood(food);
        setShowDeleteModal(true);
    };

    const handleAddFood = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("FoodName", FoodName);
        formData.append("Price", Price);
        formData.append("Description", Description);
        formData.append("Image", ImageFood);
        formData.append("CreatedBy", isBranchAdmin.Email);
        formData.append("LastUpdatedBy", isBranchAdmin.Email);


        try {
            await axios.post(
                `${process.env.REACT_APP_API}/food/add-food-of-branch/${isBranchAdmin.BranchID}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            toast.success("Thêm thức ăn thành công!");
            setShowAddModal(false);
            setFoodName("")
            setImageFood(null)
            setPrice("")
            setDescription("")
            setPreviewImage("")

            // Cập nhật lại danh sách món ăn
            const response = await axios.get(
                `${process.env.REACT_APP_API}/food/get-foods-of-branch/${isBranchAdmin.BranchID}`
            );
            setFoods(response.data || []);
        } catch (error) {
            console.error("Error adding food:", error);
            toast.error("Có lỗi xảy ra khi thêm thức ăn.");
        }
    };

    const handleUpdateFood = async (e) => {
        e.preventDefault();

        // Kiểm tra dữ liệu đầu vào trước khi gửi request
        if (!selectedFood.FoodName.trim() || !selectedFood.Price || !selectedFood.Description.trim()) {
            toast.error("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        const formData = new FormData();
        formData.append("FoodName", selectedFood.FoodName.trim());
        formData.append("Price", selectedFood.Price);
        formData.append("Description", selectedFood.Description.trim());
        formData.append("LastUpdatedBy", isBranchAdmin.Email);

        if (ImageFood) {
            formData.append("Image", ImageFood);
        }

        // Lấy LastUpdatedBy từ isBranchAdmin.Email
        if (!isBranchAdmin?.Email) {
            toast.error("Không thể xác định người cập nhật!");
            return;
        }
        formData.append("LastUpdatedBy", isBranchAdmin.Email);

        try {
            await axios.put(
                `${process.env.REACT_APP_API}/food/update-food-of-branch/${selectedFood.FoodID}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            toast.success("Cập nhật món ăn thành công!");
            setShowEditModal(false);

            // Cập nhật danh sách món ăn
            const response = await axios.get(
                `${process.env.REACT_APP_API}/food/get-foods-of-branch/${isBranchAdmin.BranchID}`
            );
            setFoods(response.data || []);
        } catch (error) {
            console.error("Error updating food:", error);
            toast.error(error.response?.data?.error || "Có lỗi xảy ra khi cập nhật thức ăn.");
        }
    };

    const handleDeleteFood = async () => {
        if (!selectedFood) return;

        try {
            await axios.delete(
                `${process.env.REACT_APP_API}/food/delete-food-of-branch/${selectedFood.FoodID}`
            );

            toast.success("Xóa thức ăn thành công!");

            // Cập nhật danh sách món ăn sau khi xóa
            const response = await axios.get(
                `${process.env.REACT_APP_API}/food/get-foods-of-branch/${isBranchAdmin.BranchID}`
            );
            setFoods(response.data || []);

            // Đóng modal
            setShowDeleteModal(false);
        } catch (error) {
            console.error("Error deleting food:", error);
            toast.error("Có lỗi xảy ra khi xóa thức ăn.");
        }
    };

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Container fluid style={{ flex: 1 }}>
                <Row style={{ height: '100%' }}>
                    <Sidebar links={SidebarBranchAdmin} />

                    <Col md={9} className="p-4">
                        <div className="py-3 d-flex justify-content-between align-items-center">
                            <h4>Danh sách thức ăn:</h4>
                            <Button variant="secondary" onClick={addFoodClick}>Thêm thức ăn</Button>
                        </div>

                        <Table className="custom-table" striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tên thức ăn</th>
                                    <th>Giá</th>
                                    <th>Hình ảnh</th>
                                    <th>Mô tả</th>
                                    <th>Sửa</th>
                                    <th>Xóa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {foods.map((food) => (
                                    <tr key={food.FoodID}>
                                        <td>{food.FoodID}</td>
                                        <td>{food.FoodName}</td>
                                        <td>{new Intl.NumberFormat('vi-VN').format(food.Price)}đ</td>
                                        <td className="text-center">
                                            <Image src={`${process.env.REACT_APP_API}/${food.Image}`} width={150} height={84.39} />
                                            {/* <Image src={`${process.env.REACT_APP_API}/${food.Image}`} style={{width : '20%'}} /> */}
                                        </td>
                                        <td>{food.Description}</td>
                                        <td>
                                            <Button
                                                className='w-100'
                                                variant="dark"
                                                onClick={() => handleEditClick(food)}
                                            >
                                                <EditIcon />
                                            </Button>
                                        </td>
                                        <td>
                                            <Button className='w-100' variant="danger" onClick={() => handleDeleteClick(food)}>
                                                <DeleteIcon />
                                            </Button>

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>

            {/* Modal Update Food */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Sửa thông tin món ăn</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdateFood} encType="multipart/form-data">
                        {/* Nhập tên thức ăn */}
                        <Form.Group className="mb-3">
                            <Form.Label><strong>Tên thức ăn:</strong></Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedFood?.FoodName || ''}
                                onChange={(e) => setSelectedFood(prev => ({ ...prev, FoodName: e.target.value }))}
                                required
                            />
                        </Form.Group>

                        {/* Nhập giá món ăn */}
                        <Form.Group className="mb-3">
                            <Form.Label><strong>Giá:</strong></Form.Label>
                            <Form.Control
                                type="number"
                                value={selectedFood?.Price || ''}
                                onChange={(e) => setSelectedFood(prev => ({ ...prev, Price: e.target.value }))}
                                required
                            />
                        </Form.Group>

                        {/* Chọn hình ảnh */}
                        <Form.Group className="mb-3">
                            <Form.Label><strong>Hình ảnh:</strong></Form.Label>
                            <div className="mb-2">
                                {previewImage || selectedFood?.Image ? (
                                    <Image
                                        src={previewImage || `${process.env.REACT_APP_API}/${selectedFood?.Image}`}
                                        width="50%"
                                        alt="Ảnh món ăn"
                                        rounded
                                    />
                                ) : (
                                    <p>Chưa có hình ảnh</p>
                                )}
                            </div>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setPreviewImage(URL.createObjectURL(file)); // Xem trước ảnh mới
                                        setImageFood(file); // Lưu file ảnh để gửi lên API
                                    }
                                }}
                            />
                        </Form.Group>

                        {/* Nhập mô tả món ăn */}
                        <Form.Group className="mb-3">
                            <Form.Label><strong>Mô tả:</strong></Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={selectedFood?.Description || ''}
                                onChange={(e) => setSelectedFood(prev => ({ ...prev, Description: e.target.value }))}
                                required
                            />
                        </Form.Group>

                        {/* Nút Lưu thay đổi */}
                        <Button type="submit" variant="dark" className="w-100">
                            Lưu thay đổi
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal Add Food */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Nhập thông tin thức ăn</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddFood} encType="multipart/form-data">
                        <Form.Group className="mb-3">
                            <Form.Label><strong>Tên thức ăn:</strong></Form.Label>
                            <Form.Control
                                type="text"
                                name='FoodName'
                                value={FoodName}
                                onChange={(e) => setFoodName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Giá:</strong></Form.Label>
                            <Form.Control
                                type="number"
                                name='Price'
                                value={Price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Hình ảnh:</strong></Form.Label>
                            <div className="mb-2">
                                {previewImage && (
                                    <Image
                                        src={previewImage}
                                        width="50%"
                                        alt="Ảnh xem trước"
                                        rounded
                                    />
                                )}
                            </div>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                name='Image'
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const imageUrl = URL.createObjectURL(file);
                                        setPreviewImage(imageUrl);
                                        setImageFood(file)
                                    }
                                }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Mô tả:</strong></Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name='Description'
                                value={Description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Form.Group>

                        {/* Khi bấm nút này sẽ mở modal xác nhận */}
                        <Button type="submit" variant="dark" className="w-100">
                            Thêm thức ăn
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Bạn có chắc chắn muốn xóa món <strong>{selectedFood?.FoodName}</strong> không?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Hủy</Button>
                    <Button variant="danger" onClick={handleDeleteFood}>Xóa</Button>
                </Modal.Footer>
            </Modal>


            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default ManageFood;
