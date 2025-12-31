import React from 'react';
import { Image } from 'antd';
import IntlMessage from '../../util-components/IntlMessage';
import { APP_PUBLIC_PATH } from '../../../configs/AppConfig';
import { CLOUDFRONT_URL } from '../../../constants/ApiConstant';
import { replace } from 'lodash-es';
import { useRouter } from 'next/router';

const Popular = ({ pois }) => {
  const router = useRouter();

  if (!pois || pois.length === 0) return null;

  const goToPoi = (e, poi) => {
    e.preventDefault();
    const isMobile = router.query.mobile || false;
    const titolo = encodeURI(replace(poi.audioMediaItems.items[0].audioTitle, /\s/g, '-'));
    router.push({
      pathname: `${APP_PUBLIC_PATH}/detail/${poi.audioMediaItems.items[0].PK}/${titolo}`,
      query: { mobile: isMobile }
    });
  };

  return (
    <div className="widget-boxed mt-5">
      <div className="widget-boxed-header">
        <h4>
          <IntlMessage id="poidetail.popular" />
        </h4>
      </div>
      <div className="widget-boxed-body">
        <div className="recent-post">
          {pois.map((p, i) => (
            <div className={`recent-main ${(i % 2) === 0 ? '' : 'my-4'}`} key={i}>
              <div className="recent-img">
                <a href="#" onClick={(e) => goToPoi(e, p)}>
                  <Image preview={false} width={100} src={`${CLOUDFRONT_URL}/images/${p.immagine}`} alt={p.titolo} />
                </a>
              </div>
              <div className="info-img" style={{ padding: "0 5px 0 5px" }}>
                <a href="#" onClick={(e) => goToPoi(e, p)}>
                  <h6>{p.audioMediaItems.items[0].audioTitle}</h6>
                </a>
                <ul className="list-unstyled list-inline ml-auto">
                  <i className="fa-regular fa-thumbs-up" style={{ fontFamily: 'FontAwesome', fontStyle: "normal" }}></i> {p.likes}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Popular;
