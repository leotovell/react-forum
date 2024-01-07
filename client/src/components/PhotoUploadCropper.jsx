import React, { useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { Col, Form, Row } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

function PhotoUploadCropper({ imgUrl, show, setShow, saveImage }) {
  const [scale, setScale] = useState(1.2);
  const [sliderValue, setSliderValue] = useState(1);

  const calculateScale = (val) => {
    var newScale = 1 + val * 0.025;
    setScale(newScale);
  };

  const editor = useRef(AvatarEditor);

  const handleSave = () => {
    const editedImage = editor.current.getImage().toDataURL();
    saveImage(editedImage);
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
                ref={editor}
                image={imgUrl}
                width={250}
                height={250}
                borderRadius={250 / 2}
                color={[255, 255, 255, 0.6]}
                scale={scale}
                rotate={0}
                backgroundColor="white"
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
              <input type="button" onClick={handleSave} value="Submit" />
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default PhotoUploadCropper;
