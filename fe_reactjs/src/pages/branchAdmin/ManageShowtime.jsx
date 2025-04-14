import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Image, Modal, Nav, Row, Table } from 'react-bootstrap';
import Sidebar from '../../components/Sidebar';
import SidebarBranchAdmin from './sidebarBranchAdmin';
import axios from 'axios';
import { store } from '../../redux/store';
import DatePicker from 'react-datepicker';
import { toast, ToastContainer } from 'react-toastify';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import { formatBirthDate, formatDatetime, formatShowtimeDate } from '../../lib/utils';

const ManageShowtime = () => {
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // Kết quả: "2025-03-15"
    });
    const [TheatersOfBranch, setTheatersOfBranch] = useState([])
    const [Showtimes, setShowtimes] = useState([])
    const [DetailsShowtime, setDetailsShowtime] = useState()

    const [MovieOptions, setMovieOptions] = useState([])

    const [showAddModal, setShowAddModal] = useState(false)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [TheaterID, setTheaterID] = useState("")
    const [TheaterName, setTheaterName] = useState("")
    const [MovieSelected, setMovieSelected] = useState()
    const [MovieID, setMovieID] = useState("")
    const [StartTime, setStartTime] = useState("");
    const handleTimeChange = (time) => {
        const hours = time.getHours().toString().padStart(2, "0");
        const minutes = time.getMinutes().toString().padStart(2, "0");
        setStartTime(`${hours}:${minutes}`);
    };
    const [EndTime, setEndTime] = useState("")

    const isBranchAdmin = store.getState().user.currentUser?.user;

    const addShowtimeClick = (theater) => {
        setTheaterName(theater.TheaterName)
        setTheaterID(theater.TheaterID)
        setShowAddModal(true)
    }

    useEffect(() => {
        setShowtimes([])

        const getAllTheaterOfBranch = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API}/theater/get-all-theater-of-branch/${isBranchAdmin.BranchID}`);
                if (res.data.data.length === 0) {
                    console.warn("Chưa có rạp chiếu nào.");
                }
                setTheatersOfBranch(res.data.data);
            } catch (error) {
                console.error("Lỗi khi lấy rạp chiếu:", error);
            }
        };

        const getShowtimesOfBranch = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API}/showtime/get-all-showtimes-of-branch/${isBranchAdmin.BranchID}?ShowDate=${selectedDate}`);
                if (res.data.data.length === 0) {
                    console.warn("Chưa có xuất chiếu nào.");
                }
                setShowtimes(res.data.data);
            } catch (error) {
                console.error("Lỗi khi lấy xuất chiếu:", error);
            }
        }

        const getMovieOptions = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API}/movie/get-all-movie`);
                if (res.data.movies.length === 0) {
                    console.warn("Chưa có phim nào.");
                }
                setMovieOptions(res.data.movies);
            } catch (error) {
                console.error("Lỗi khi lấy phim:", error);
            }
        }

        getMovieOptions()
        getShowtimesOfBranch()
        getAllTheaterOfBranch();

    }, [isBranchAdmin.BranchID, selectedDate]);

    useEffect(() => {
        if (!MovieSelected?.Duration) return; // Kiểm tra nếu không có thời lượng phim

        const [hours, minutes] = StartTime.split(":").map(Number);

        const startDate = new Date();
        startDate.setHours(hours, minutes, 0);

        // Cộng thêm thời lượng phim (đơn vị phút)
        const endDate = new Date(startDate.getTime() + MovieSelected.Duration * 60000);
        const endHours = endDate.getHours().toString().padStart(2, "0");
        const endMinutes = endDate.getMinutes().toString().padStart(2, "0");

        setEndTime(`${endHours}:${endMinutes}`);
    }, [StartTime, MovieSelected]);

    const handleAddShowtime = async (e) => {
        e.preventDefault();

        if (!TheaterID || !TheaterName || !MovieID || !StartTime || !EndTime) {
            toast.error("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        const formData = new FormData();
        formData.append("TheaterID", TheaterID);
        formData.append("MovieID", MovieID);
        formData.append("ShowDate", selectedDate);
        formData.append("StartTime", StartTime);
        formData.append("EndTime", EndTime);
        formData.append("CreatedBy", isBranchAdmin.Email);

        // for (let [key, value] of formData.entries()) {
        //     console.log(`${key}: ${value} (Type: ${typeof value})`);
        // }        

        try {
            const addShowtime = await axios.post(
                `${process.env.REACT_APP_API}/showtime/add-showtime`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );


            const addShowtimeSeat = await axios.post(
                `${process.env.REACT_APP_API}/showtime-seat/add-showtime-seats/${addShowtime.data.data.ShowtimeID}/${addShowtime.data.data.TheaterID}`
            )

            toast.success("Thêm suất chiếu thành công!");

            setTheaterID("")
            setTheaterName("")
            setMovieSelected("")
            setMovieID("")
            setStartTime("")
            setEndTime("")
            setShowAddModal(false)

            const response = await axios.get(`${process.env.REACT_APP_API}/showtime/get-all-showtimes-of-branch/${isBranchAdmin.BranchID}?ShowDate=${selectedDate}`);
            if (response.data.data.length === 0) {
                console.warn("Chưa có xuất chiếu nào.");
            }
            setShowtimes(response.data.data);

        } catch (error) {
            console.error("Error adding showtime:", error);
            toast.error("Có lỗi xảy ra khi suất chiếu.");
        }
    }

    const handleDetailsShowtime = async (ShowtimeID) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API}/showtime/get-details-showtime/${ShowtimeID}`)

            setDetailsShowtime(response.data.data)
            setShowDetailsModal(true)
        } catch (error) {
            console.error("Error details showtime:", error);
            toast.error("Có lỗi xảy ra lấy thông tin suất chiếu.");
        }
    }

    const handleDeleteShowtime = async () => {
        try {

            const deleteShowtimeSeats = await axios.delete(`${process.env.REACT_APP_API}/showtime-seat/delete-showtime-seats/${DetailsShowtime.ShowtimeID}`)

            const deleteShowtime = await axios.delete(
                `${process.env.REACT_APP_API}/showtime/delete-showtime/${DetailsShowtime.ShowtimeID}`
            );

            toast.success("Xóa suất chiếu thành công!");

            const response = await axios.get(`${process.env.REACT_APP_API}/showtime/get-all-showtimes-of-branch/${isBranchAdmin.BranchID}?ShowDate=${selectedDate}`);
            setShowtimes(response.data.data === null ? [] : response.data.data);

            setShowDeleteModal(false)
            setShowDetailsModal(false)
        } catch (error) {
            console.error("Error deleting showtime:", error);
            toast.error("Có lỗi xảy ra khi xóa suất chiếu.");
        }
    }

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Container fluid style={{ flex: 1 }}>
                <Row style={{ height: '100%' }}>
                    <Sidebar links={SidebarBranchAdmin} />

                    <Col md={9} className="p-4">
                        <div className="py-3 d-flex justify-content-between align-items-center">
                            <h4>Danh sách suất chiếu:</h4>
                            <div className='d-flex'>
                                <Form.Control
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <Table className="custom-table" striped bordered hover>
                            <colgroup>
                                <col style={{ width: "15%" }} />
                                <col style={{ width: "85%" }} />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>Rạp</th>
                                    <th>Suất chiếu</th>
                                </tr>
                            </thead>
                            <tbody>
                                {TheatersOfBranch.map((theater, index) => {
                                    const filteredShowtimes = Showtimes.filter(showtime => showtime.TheaterID === theater.TheaterID);
                                    return (
                                        <tr key={index}>
                                            <td style={{ whiteSpace: "nowrap", verticalAlign: "middle", textAlign: "center", fontWeight: "bold" }}>{theater.TheaterName}</td>
                                            <td className="px-4 py-3 d-flex flex-wrap">
                                                {filteredShowtimes.length > 0 ? (
                                                    filteredShowtimes.map((showtime, idx) => (
                                                        <div className='mb-3'>
                                                            <img
                                                                src={`${process.env.REACT_APP_API}/${showtime.Poster}`} // Ảnh poster của phim
                                                                style={{ width: '50px', height: '75px', objectFit: 'cover', borderRadius: "8px" }}
                                                                alt="poster"
                                                            />
                                                            <Button style={{ marginRight: "20px", height: "100%", width: "55px", padding: "0px" }} variant="secondary"
                                                                onClick={() => handleDetailsShowtime(showtime.ShowtimeID)}
                                                            >
                                                                <div>{formatShowtimeDate(showtime.StartTime)}</div>
                                                                <KeyboardDoubleArrowDownIcon></KeyboardDoubleArrowDownIcon>
                                                                <div>{formatShowtimeDate(showtime.EndTime)}</div>
                                                            </Button>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span></span>
                                                )}
                                                <Button variant="light" style={{ border: "1px solid #d1d1d1", width: "50px", height: '75px' }}
                                                    onClick={() => addShowtimeClick(theater)}
                                                >
                                                    <strong>+</strong>
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>

            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Nhập thông tin suất chiếu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddShowtime} encType="multipart/form-data">
                        <Form.Group>
                            <Form.Control
                                type="hidden"
                                name='TheaterID'
                                value={TheaterID}
                                readOnly
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Rạp chiếu:</strong></Form.Label>
                            <Form.Control
                                type="text"
                                name='TheaterName'
                                value={TheaterName}
                                readOnly
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Ngày chiếu:</strong></Form.Label>
                            <Form.Control
                                type="text"
                                name='ShowDate'
                                value={formatBirthDate(selectedDate)}
                                readOnly
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Chọn phim chiếu:</strong></Form.Label>
                            <Form.Select
                                name="MovieID"
                                value={MovieID}
                                onChange={(e) => {
                                    const selectedMovie = MovieOptions.find(movie => movie.MovieID === Number(e.target.value));
                                    setMovieID(e.target.value);
                                    setMovieSelected(selectedMovie);
                                }}
                            >
                                <option value="" disabled>Chọn phim...</option> {/* Option mặc định */}
                                {
                                    MovieOptions.map((movie, idx) => (
                                        <option key={idx} value={movie.MovieID}>
                                            {movie.MovieName} - {movie.Duration} phút
                                        </option>
                                    ))
                                }
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3 d-flex">
                            <Form.Label className='me-2'><strong>Bắt đầu chiếu - kết thúc:</strong></Form.Label>
                            <DatePicker
                                selected={(() => {
                                    if (!StartTime) return null; // Nếu chưa có EndTime, trả về null để tránh lỗi

                                    const now = new Date();
                                    const [hours, minutes] = StartTime.split(":").map(Number);

                                    if (isNaN(hours) || isNaN(minutes)) return null; // Kiểm tra tránh lỗi NaN

                                    now.setHours(hours, minutes, 0, 0);
                                    return now;
                                })()}
                                onChange={handleTimeChange}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={5}
                                timeFormat="HH:mm"
                                dateFormat="HH:mm"
                                minTime={new Date().setHours(9, 0, 0)}
                                maxTime={new Date().setHours(22, 0, 0)}
                                customInput={<input style={{ width: "40px" }} />}
                            />
                            <div className='mx-2'><strong>-</strong></div>
                            <DatePicker
                                selected={(() => {
                                    if (!EndTime) return null; // Nếu chưa có EndTime, trả về null để tránh lỗi

                                    const now = new Date();
                                    const [hours, minutes] = EndTime.split(":").map(Number);

                                    if (isNaN(hours) || isNaN(minutes)) return null; // Kiểm tra tránh lỗi NaN

                                    now.setHours(hours, minutes, 0, 0);
                                    return now;
                                })()}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={5}
                                timeFormat="HH:mm"
                                dateFormat="HH:mm"
                                disabled
                                customInput={<input style={{ width: "40px" }} />}
                            />
                        </Form.Group>

                        {/* Khi bấm nút này sẽ mở modal xác nhận */}
                        <Button type="submit" variant="dark" className="w-100">
                            Thêm suất chiếu
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Chi Tiết Suất Chiếu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {DetailsShowtime && (
                        <div>
                            <p><strong>ID:</strong> {DetailsShowtime.ShowtimeID}</p>
                            <p><strong>Rạp chiếu:</strong> {DetailsShowtime.Theater.TheaterName}</p>
                            <p><strong>Mã rạp:</strong> {DetailsShowtime.Theater.Slug}</p>
                            <p><strong>Phim chiếu:</strong> {DetailsShowtime.Movie.MovieName}</p>
                            <p>
                                <Image
                                    src={`${process.env.REACT_APP_API}/${DetailsShowtime.Movie.Poster}`}
                                    width="30%"
                                    rounded
                                />
                            </p>
                            <p><strong>Ngày chiếu:</strong> {formatBirthDate(DetailsShowtime.ShowDate)}</p>
                            <p><strong>Bắt đầu:</strong> {DetailsShowtime.StartTime}</p>
                            <p><strong>Kết thúc:</strong> {DetailsShowtime.EndTime}</p>
                            <p className='mt-3'><strong>Thời gian tạo:</strong> {formatDatetime(DetailsShowtime.CreatedAt)}</p>
                            <p><strong>Người tạo:</strong> {DetailsShowtime.CreatedBy}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => {
                        setShowDetailsModal(false);
                        setShowDeleteModal(true);
                    }}>
                        Xóa
                    </Button>
                    <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDeleteModal} onHide={() => { setShowDeleteModal(false); setShowDetailsModal(true); }} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Bạn có chắc chắn muốn xóa suất chiếu <strong>{DetailsShowtime?.StartTime} - {DetailsShowtime?.Theater.TheaterName}</strong> không?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShowDetailsModal(true);
                        setShowDeleteModal(false);
                    }}>Hủy</Button>
                    <Button variant="danger" onClick={handleDeleteShowtime}>Xóa</Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default ManageShowtime;
