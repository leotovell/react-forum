import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import httpClient from "../httpClient";
import { useAuth } from "./AuthProvider";

function NavBar() {
  const { user } = useAuth();

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href="/">Leo's Forum</Navbar.Brand>
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
                    <NavDropdown.Item href={`/forum/${forum}`} key={forum}>
                      {forum}
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
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
