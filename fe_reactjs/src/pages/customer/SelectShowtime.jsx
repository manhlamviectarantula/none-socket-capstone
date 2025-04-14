import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import Footer from "../../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { DoubleArrow } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { formatShowtimeDate } from "../../lib/utils";

const SelectShowtime = () => {
  const userinfo = useSelector((state) => state.user.currentUser?.user);
  const [ShowtimeMovie, setShowtimeMovie] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [movieName, setMovieName] = useState(null)
  const [moviePoster, setMoviePoster] = useState([]);

  const location = useLocation();
  const MovieID = location.pathname.split("/")[2];
  const navigate = useNavigate();

  useEffect(() => {
    const getShowtimeMovie = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API}/showtime/get-all-showtimes-of-movie/${MovieID}`);
        if (res.data.data.length === 0) {
          console.warn("Không có suất chiếu nào.");
        }
        console.log(res.data.data)
        setShowtimeMovie(res.data.data);
        setMoviePoster(res.data.data[0].Poster)
        setMovieName(res.data.data[0].MovieName)
      } catch (error) {
        console.error("Lỗi khi lấy suất chiếu:", error);
      }
    };
    getShowtimeMovie();
  }, [MovieID]);

  // Tạo danh sách ngày chiếu duy nhất
  const uniqueDates = [...new Set(ShowtimeMovie.map((show) => show.ShowDate))].filter(Boolean).sort((a, b) => new Date(a) - new Date(b));

  // Đặt ngày đầu tiên làm ngày mặc định nếu có dữ liệu
  useEffect(() => {
    if (uniqueDates.length > 0) {
      setSelectedDate(uniqueDates[0]);
    }
  }, [ShowtimeMovie, uniqueDates]);

  // Nhóm dữ liệu theo ngày
  const groupedShowtimes = uniqueDates.map((date) => (
    {
      date: formatShowtimeDate(date),
      showtimes: ShowtimeMovie.filter((show) => show.ShowDate === date),
    }
  ));

  // Hàm xử lý khi chọn suất chiếu
  const handleSelectShowtime = (ShowtimeID) => {
    if (!userinfo) {
      toast.warning("Vui lòng đăng nhập để đặt vé")
    } else {
      navigate(`/selectSeat/${ShowtimeID}`);
    }
  };

  return (
    <>
      <Header />
      <Container className="my-4">
        <div style={{ margin: '30px auto 35px' }}>
          <h4 className='text-center'>
            <span style={{ borderTop: '5px double black', borderBottom: '5px double black', padding: '5px' }}>
              CHỌN SUẤT CHIẾU
            </span>
          </h4>
        </div>
        <Row>
          <Col md={3}>
            <div className="w-100 mt-2 mb-3 text-center">
              <h3>{movieName}</h3>
            </div>
            <Card.Img
              variant="top"
              src={`${process.env.REACT_APP_API}/${moviePoster}`}
              className="w-100 rounded"
            />
          </Col>
          <Col md={9} style={{ borderLeft: '2px dashed black', paddingLeft: '20px' }}>
            <div className="d-flex" style={{ margin: "10px auto 10px" }}>
              <DoubleArrow className="mt-1 mx-2"></DoubleArrow>
              <h4>
                Ngày chiếu
              </h4>
            </div>
            {uniqueDates.length === 0 ? (
              <p className="text-center">Không có suất chiếu nào.</p>
            ) : (
              groupedShowtimes.map((group, index) => (
                <Button
                  key={index}
                  variant={group.date === formatShowtimeDate(selectedDate) ? "dark" : "outline-dark"}
                  onClick={() => setSelectedDate(uniqueDates[index])}
                  style={{
                    width: "70px",
                    height: "45px",
                    fontSize: "18px",
                    padding: "0",
                    margin: "6px",
                  }}
                >
                  {group.date}
                </Button>
              ))
            )}

            <div className="d-flex" style={{ margin: "10px auto 0px", borderTop: "2px dashed black", paddingTop: "20px" }}>
              <DoubleArrow className="mt-1 mx-2"></DoubleArrow>
              <h4>
                Giờ chiếu
              </h4>
            </div>

            {groupedShowtimes
              .filter((group) => group.date === formatShowtimeDate(selectedDate))
              .flatMap((group) => {
                // Nhóm suất chiếu theo rạp
                const theaters = group.showtimes.reduce((acc, show) => {
                  if (!acc[show.BranchName]) {
                    acc[show.BranchName] = [];
                  }
                  acc[show.BranchName].push(show);
                  return acc;
                }, {});

                return Object.entries(theaters).map(([branch, showtimes], index) => (
                  <div key={index} style={{ marginBottom: "30px", borderBottom: "1px solid black", paddingBottom: "20px" }}>
                    <div className="d-flex">
                      <h6 className="my-3">| {branch}</h6>
                    </div>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      {showtimes.map((show, timeIndex) => (
                        <Button
                          key={timeIndex}
                          variant="secondary"
                          style={{ width: "70px", height: "45px", fontSize: "18px" }}
                          onClick={() => handleSelectShowtime(show.ShowtimeID)}
                        >
                          {show.StartTime}
                        </Button>
                      ))}
                    </div>
                  </div>
                ));
              })}
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default SelectShowtime;
