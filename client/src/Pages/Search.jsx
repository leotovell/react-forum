import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Dropdown,
  DropdownButton,
  FloatingLabel,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import httpClient from "../httpClient";
import { useParams } from "react-router-dom";
import ForumBanner from "../components/ForumBanner";
import ProfileBanner from "../components/ProfileBanner";

function Search() {
  const urlSearchString = window.location.search;
  const params = new URLSearchParams(urlSearchString);
  console.log(params.get("v"));
  const initialSearchValue = params.get("v");
  const initialSearchType = params.get("t");
  const [searchValue, setSearchValue] = useState(initialSearchValue);
  const [searchType, setSearchType] = useState(
    ["forum", "user"].includes(initialSearchType) ? initialSearchType : "forum"
  );

  const [results, setResults] = useState([]);
  const [resultsLoading, setResultsLoading] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        setResultsLoading(true);
        const resp = await httpClient.post("//localhost:5000/api/search", {
          searchType,
          searchValue,
        });
        setResults(resp.data.results);
        console.log(resp.data.results);
      } catch (error) {
      } finally {
        setResultsLoading(false);
      }
    })();
  }, [searchType, searchValue]);

  const copySearch = () => {
    navigator.clipboard.writeText(
      window.location.origin + `/search?v=${searchValue}&t=${searchType}`
    );
  };

  return (
    <Container>
      {/* Search Bar */}
      <Row>
        <InputGroup className="mt-4">
          <Form.Floating>
            <Form.Control
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder=""
            />
            <label htmlFor="floatingInputCustom">Search</label>
          </Form.Floating>
          <DropdownButton
            variant="outline-secondary"
            title={searchType}
            id="input-group-dropdown-1"
          >
            <Dropdown.Item onClick={() => setSearchType("forum")}>
              Forum
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSearchType("user")}>
              User
            </Dropdown.Item>
          </DropdownButton>
        </InputGroup>
      </Row>
      <Row className="d-flex flex-row-reverse hover-underline">
        <Button style={{ all: "unset", color: "blue" }} onClick={copySearch}>
          <span>Share search</span>
        </Button>
      </Row>
      <Row className="search-results">
        {searchValue === "" ? (
          <div>Enter in the search bar above</div>
        ) : resultsLoading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : results.length === 0 ? (
          <div>No results</div>
        ) : (
          <Container fluid style={{ overflowY: "scroll", maxHeight: "80vh" }}>
            {searchType === "forum" ? (
              results.map((res, idx) => (
                <Row key={idx} className="my-2">
                  <ForumBanner
                    style={{ borderRadius: "20px" }}
                    forumName={res.name}
                    forumImage={res.image}
                    desc={res.desc}
                    url={res.url}
                  />
                </Row>
              ))
            ) : searchType === "user" ? (
              results.map((res, idx) => (
                <a
                  style={{ all: "unset" }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = "0.8";
                    e.target.style.border = "1px blue solid";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = "1";
                    e.target.style.border = "0px blue solid";
                  }}
                  href={`/profile/${res.id}`}
                >
                  <Row key={idx} className="my-2">
                    <ProfileBanner style={{ borderRadius: "20px" }} {...res} />
                  </Row>
                </a>
              ))
            ) : searchType === "post" ? (
              <div></div>
            ) : (
              <div>Search Type ERROR: {searchType}</div>
            )}
          </Container>
        )}
      </Row>
    </Container>
  );
}

export default Search;
