import { Image } from 'antd';
import React from 'react';

export const Thumb = (props) => {
  const { selected, imgUrl, onClick } = props;

  return (
    <div
      className={'embla-thumbs__slide'.concat(
        selected ? ' embla-thumbs__slide--selected' : ''
      )}
    >
      <span
        onClick={onClick}
        type="button"
        className="embla-thumbs__slide__number"
      >
        <Image preview={false} width={"auto"} src={imgUrl} alt="" className="img-fluid" />
      </span>
    </div>
  );
};
