import React, { useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { Col, Form, Row } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

function PhotoUploadCropper({ imgUrl, show, setShow }) {
  const [src, setSrc] = useState();
  //   const [show, setShow] = useState(false);
  const [preview, setPreview] = useState();
  const [scale, setScale] = useState(1.2);
  const [sliderValue, setSliderValue] = useState(1);

  const calculateScale = (val) => {
    // scaleRange 1-2.5x
    // Val 0-100, map that from 1 to 2.5
    // 2.5/100 = 0.025
    var newScale = 1 + val * 0.025;
    console.log(newScale);
    setScale(newScale);
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Crop Forum Photo
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col>
              <AvatarEditor
                image={imgUrl}
                width={250}
                height={250}
                // border={50}
                color={[255, 255, 255, 0.6]}
                scale={scale}
                rotate={0}
              />
            </Col>
            <Col>
              <Form.Label>Image Scale</Form.Label>
              <Form.Range
                value={sliderValue}
                onChange={(e) => {
                  setSliderValue(e.target.value);
                  calculateScale(e.target.value);
                }}
              />
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default PhotoUploadCropper;
