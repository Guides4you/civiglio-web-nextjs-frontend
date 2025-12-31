import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Upload, Modal } from 'antd';
import { DeleteFilled } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { v4 as uuidv4 } from 'uuid';
import { CLOUDFRONT_URL } from '../../constants/ApiConstant';

const POIImage = ({ imageSrc, imageAlt, onFileCreated }) => {
  const [currentImageSrc, setCurrentImageSrc] = useState(
    `${CLOUDFRONT_URL}/images/${imageSrc}`
  );
  const [deleteModal, setDeleteModal] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  useEffect(() => {
    const isBlankImage = imageSrc === 'image_upload.png';
    setShowDeleteButton(!isBlankImage);
    setCurrentImageSrc(`${CLOUDFRONT_URL}/images/${imageSrc}`);
  }, [imageSrc]);

  const storeImage = async (file) => {
    try {
      const { Storage } = await import('aws-amplify');
      const imageName = uuidv4();
      const ext = file.name.split('.').pop();
      const fname = `images/${imageName}.${ext}`;

      await Storage.put(fname, file, {
        contentType: file.type
      });

      if (onFileCreated) {
        onFileCreated(`${imageName}.${ext}`);
      }

      setCurrentImageSrc(`${CLOUDFRONT_URL}/images/${imageName}.${ext}`);
      setShowDeleteButton(true);
    } catch (error) {
      console.error('S3 upload error:', error);
      alert('Errore nel salvataggio del file');
    }

    return false;
  };

  const handleDelete = () => {
    if (onFileCreated) {
      onFileCreated('image_upload.png');
    }
    setCurrentImageSrc(`${CLOUDFRONT_URL}/images/image_upload.png`);
    setShowDeleteButton(false);
    setDeleteModal(false);
  };

  return (
    <>
      <div className="ant-card ant-card-bordered">
        <div className="ant-card-head">
          <div className="ant-card-head-title">Immagine POI</div>
        </div>

        <div className="ant-card-body">
          <Row gutter={[8, 8]}>
            <Col xs={24}>
              <div className="ant-upload ant-upload-drag" style={{ position: 'relative' }}>
                {showDeleteButton && (
                  <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1 }}>
                    <Button danger onClick={() => setDeleteModal(true)}>
                      <DeleteFilled />
                    </Button>
                  </div>
                )}
                <picture>
                  <source srcSet={currentImageSrc} style={{ width: '100%' }} />
                  <img
                    src={currentImageSrc}
                    style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }}
                    alt={imageAlt || 'POI'}
                  />
                </picture>
              </div>
            </Col>

            <Col xs={24}>
              <ImgCrop rotate aspect={1.40 / 1} modalWidth={618}>
                <Upload
                  name="file"
                  showUploadList={false}
                  beforeUpload={storeImage}
                >
                  <Button type="primary" block>
                    Seleziona Immagine
                  </Button>
                </Upload>
              </ImgCrop>
            </Col>
          </Row>
        </div>
      </div>

      <Modal
        title="Eliminazione Immagine"
        open={deleteModal}
        onOk={handleDelete}
        onCancel={() => setDeleteModal(false)}
      >
        <p>Vuoi eliminare l'immagine del POI?</p>
      </Modal>
    </>
  );
};

export default POIImage;
