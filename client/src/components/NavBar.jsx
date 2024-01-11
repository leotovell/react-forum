import { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import httpClient from "../httpClient";
import { useAuth } from "./AuthProvider";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
function NavBar() {
  const { user } = useAuth();
  const searchInputRef = useRef(null);

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href="/">LHub</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Nav.Link href="/">Home</Nav.Link>
            {/* <Nav.Link href="#">Account</Nav.Link> */}
            {user ? (
              <NavDropdown title="My forums" id="navbarScrollingDropdown">
                <>
                  {user.forums.map((forum) => (
                    <NavDropdown.Item
                      href={`/forum/${forum.url}`}
                      key={forum.name}
                    >
                      {forum.name}
                    </NavDropdown.Item>
                  ))}
                  {user.forums.length > 10 ? (
                    <>
                      <NavDropdown.Divider />
                      <NavDropdown.Item href="profile/forums">
                        View all
                      </NavDropdown.Item>
                    </>
                  ) : (
                    <></>
                  )}
                </>
              </NavDropdown>
            ) : (
              <></>
            )}

            <NavDropdown title="Account" id="navbarScrollingDropdown">
              {!user ? (
                <>
                  <NavDropdown.Item href="/login">Log In</NavDropdown.Item>
                  <NavDropdown.Item href="/register">Register</NavDropdown.Item>
                </>
              ) : (
                <>
                  <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                  <NavDropdown.Item href="/account-settings">
                    Settings
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
                </>
              )}
            </NavDropdown>
            <Nav.Link href="#" disabled>
              Link
            </Nav.Link>
          </Nav>
          <Form className="d-flex">
            <Form.Control
              ref={searchInputRef}
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <DropdownButton
              variant="outline-success"
              title="Search"
              id="input-group-dropdown-1"
            >
              <Dropdown.Item
                onClick={() =>
                  (window.location.href = `${window.location.origin}/search?v=${searchInputRef.current.value}&t=forum`)
                }
              >
                Forum
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() =>
                  (window.location.href = `${window.location.origin}/search?v=${searchInputRef.current.value}&t=user`)
                }
              >
                User
              </Dropdown.Item>
            </DropdownButton>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
