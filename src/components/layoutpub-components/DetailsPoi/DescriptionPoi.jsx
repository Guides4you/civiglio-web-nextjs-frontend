import React from 'react';
import IntlMessage from '../../util-components/IntlMessage';
import ExpandableParagraph from './ExpandableParagraph';

const DescriptionPoi = ({ poi }) => {
  return (
    <div className="blog-info details mb-30">
      <h5 className="mb-4">
        <IntlMessage id="poidetail.description" />
      </h5>
      <p className="mb-3">
        <ExpandableParagraph text={poi?.audioMediaItems?.items[0]?.description || ""} />
      </p>
    </div>
  );
};

export default DescriptionPoi;
