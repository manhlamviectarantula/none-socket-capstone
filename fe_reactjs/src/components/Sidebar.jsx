import React from 'react';
import { Col, Nav } from 'react-bootstrap';
import { useLocation, NavLink, matchPath } from "react-router-dom";
import styled from 'styled-components';
import { store } from '../redux/store';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import BusinessIcon from '@mui/icons-material/Business';

const CustomNavLink = styled(Nav.Link)`
    font-weight: 600; 
    color: black;
    text-decoration: none;
    padding: 15px;

    &:hover, &:active {
        color: black;
        background-color: #d1d1d1;
    }

    &.active {
        color: black;
        background-color: #cccccc;
    }
`;

const Sidebar = ({ links }) => {
    const location = useLocation();

    const logo = store.getState().user.currentUser?.user.AccountTypeID;

    return (
        <Col md={3} className="bg-light px-0 py-3">
            <div className="d-flex justify-content-between px-3 mb-3">
                <img
                    src="https://seeklogo.com/images/C/cinema-logo-1816B261B0-seeklogo.com.png"
                    height="40"
                    alt="Cinema Logo"
                />
                {/* Conditional rendering based on AccountTypeID */}
                {logo === 3 ? (
                    <ManageAccountsIcon style={{ marginLeft: "10px", fontSize: "30px" }} />
                ) : logo === 2 ? (
                    <BusinessIcon style={{ marginLeft: "10px", fontSize: "30px" }} />
                ) : null}
            </div>

            <Nav className="flex-column">
                {links.map((link, index) => {
                    const isActive =
                        location.pathname === link.path ||
                        (link.path === "/manageTheater" &&
                            (location.pathname === "/addTheater" || location.pathname === "/designSeats" || matchPath("/detailsTheater/:TheaterID", location.pathname))); 
                    return (
                        <CustomNavLink
                            as={NavLink}
                            to={link.path}
                            key={index}
                            className={isActive ? "active" : ""}
                        >
                            {link.label}
                        </CustomNavLink>
                    );
                })}
            </Nav>
        </Col>
    );
};

export default Sidebar;
