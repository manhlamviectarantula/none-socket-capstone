import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// const moviesrep = [
//   { id: 1, name: 'Tee Yod: Quỷ Ăn Tạng Phần 2', tag: 'T18', image: 'https://cdn.galaxycine.vn/media/2024/10/10/tee-yod-2-500_1728531355521.jpg' },
//   { id: 2, name: 'Cô Dâu Hào Môn', tag: 'T16', image: 'https://cdn.galaxycine.vn/media/2024/10/18/co-dau-hao-mon-500_1729221052856.jpg' },
//   { id: 3, name: 'Joker: Folie à Deux Điên Có Đôi', tag: 'T18', image: 'https://cdn.galaxycine.vn/media/2024/8/30/joker-folie-duex-500_1725002156768.jpg' },
//   { id: 4, name: 'Fubao: Bảo Bối Của Ông', tag: 'P', image: 'https://cdn.galaxycine.vn/media/2024/10/1/my-dearest-fubao-1_1727752829700.jpg' },
//   { id: 5, name: 'Robot Hoang Dã', tag: 'P', image: 'https://cdn.galaxycine.vn/media/2024/10/2/the-wild-robot-500_1727843731507.jpg' },
//   { id: 6, name: 'Làm Giàu Với Ma', tag: 'T18', image: 'https://cdn.galaxycine.vn/media/2024/8/26/lam-giau-voi-ma-2_1724686102964.jpg' },
// ];

const Showing = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  // Gọi API để lấy danh sách phim đang chiếu
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API}/movie/get-showing-movie`);
        setMovies(response.data.data); // Cập nhật state với dữ liệu từ API
      } catch (error) {
        console.error('Lỗi khi lấy danh sách phim:', error);
      }
    };

    fetchMovies();
  }, []);

  const handleCardClick = (MovieID) => {
    navigate(`/detailsMovie/${MovieID}`);
  };

  return (
    <>
      <Header />
      <Container className="mt-4 mb-4">
        <div style={{ margin: '30px auto 35px' }}>
          <h4 className='text-center'>
            <span style={{ borderTop: '5px double black', borderBottom: '5px double black', padding: '5px' }}>
              PHIM ĐANG CHIẾU
            </span>
          </h4>
        </div>
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {movies.map((movie) => (
            <Col key={movie.MovieID}>
              <Card className="h-100" style={{ cursor: 'pointer' }} onClick={() => handleCardClick(movie.MovieID)}>
                <Card.Img
                  variant="top"
                  src={`${process.env.REACT_APP_API}/${movie.Poster}`}
                  alt={movie.MovieName}
                  style={{  objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>{movie.MovieName}</Card.Title>
                </Card.Body>
                <Badge bg="danger" className="position-absolute">
                  {movie.AgeTag}
                </Badge>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default Showing;
