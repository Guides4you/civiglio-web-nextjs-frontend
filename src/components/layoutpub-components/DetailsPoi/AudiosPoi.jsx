import { Button, Image } from "antd";
import { CLOUDFRONT_URL } from "../../../constants/ApiConstant";
import React, { useContext, useEffect, useState } from "react";
import { CiviglioConsumer, CiviglioContext } from "../../layouts/PubLayout";
import { FolderViewOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import LikeMediaIcon from "../LikeIconMedia";
import IntlMessage from "../../util-components/IntlMessage";
import ExpandableParagraph from "./ExpandableParagraph";
import { useRouter } from 'next/router';

const AudiosPoi = ({ poi }) => {
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [currentAudio, setCurrentAudio] = useState();
  const [poiAudios, setPoiAudios] = useState(poi.audioMediaItems);
  const { locale } = useSelector((state) => state.theme);
  const context = useContext(CiviglioContext);
  const router = useRouter();
  const isMobile = JSON.parse(router.query.mobile || 'false');

  const audios = poiAudios.items.filter((x) => x.lingua === locale);

  const isUserAuthenticated = () => {
    return context.getUser();
  };

  const reloadAudioItems = async () => {
    try {
      const { API, graphqlOperation } = await import('aws-amplify');
      const { GRAPHQL_AUTH_MODE } = await import('@aws-amplify/api-graphql');
      const { getGeoPoi } = await import('../../../graphql/publicQueries');

      const result = await API.graphql({
        query: getGeoPoi,
        authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
        variables: { rangeKey: poi.PK, SK: poi.SK },
      });

      setPoiAudios(result.data.getGeoPoi.audioMediaItems);
    } catch (e) {
      console.log(e);
    }
  };

  const recordPlayAudioEvent = async (audio, isPaid) => {
    try {
      const { Analytics } = await import('aws-amplify');

      if (isPaid) {
        Analytics.record({
          name: "playAudioAbstract",
          attributes: {
            lingua: audio.lingua,
            proprietario: poi.proprietario,
            mediaPK: poi.PK,
            mediaSK: poi.SK,
          },
        });
      } else {
        Analytics.record({
          name: "playAudio",
          attributes: {
            lingua: audio.lingua,
            proprietario: poi.proprietario,
            mediaPK: audio.PK,
            mediaSK: audio.SK,
          },
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleLike = async (audio) => {
    const auth = isUserAuthenticated();

    if (!auth.current) {
      context.showLogin();
    } else {
      try {
        const { API, graphqlOperation } = await import('aws-amplify');
        const { addLikeMedia } = await import('../../../graphql/publicMutations');

        await API.graphql(
          graphqlOperation(addLikeMedia, {
            PK: audio.PK,
            SK: audio.SK,
            user: auth.current.attributes.sub,
          })
        );

        reloadAudioItems();
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleDislike = async (audio) => {
    const auth = isUserAuthenticated();
    if (!auth.current) {
      context.showLogin();
    } else {
      try {
        const { API, graphqlOperation } = await import('aws-amplify');
        const { removeLikeMedia } = await import('../../../graphql/publicMutations');

        await API.graphql(
          graphqlOperation(removeLikeMedia, {
            PK: audio.PK,
            SK: audio.SK,
            user: auth.current.attributes.sub,
          })
        );

        reloadAudioItems();
      } catch (e) {
        console.log(e);
      }
    }
  };

  useEffect(() => {
    if (isUserAuthenticated().current) {
      reloadAudioItems();
    }
  }, [context]);

  return (
    <div className="floor-plan property wprt-image-video w50 pro">
      <h5>
        <IntlMessage id="poidetail.audio" />
      </h5>
      {audios.map((a) => (
        <div
          className="property-nearby"
          style={{
            marginTop: "20px",
            borderBottom: '1px solid rgba(128, 128, 128, 0.16)'
          }}
          key={a.SK}
        >
          <div className="row" style={{ display: "block" }}>
            <div className="col-lg-12">
              <div className="nearby-info mb-4">
                <div className="nearby-list">
                  <ul className="property-list list-unstyled mb-0">
                    <li className="" style={{ display: "ruby-text" }}>
                      <CiviglioConsumer>
                        {(value) => {
                          value.setAudioEndFn(() => setAudioPlayed(false));

                          return (
                            <>
                              {!audioPlayed && (
                                <button
                                  className="icon-wrap play-poi-btn play-poi"
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const p = value.setPlayedObject(a);

                                    recordPlayAudioEvent(a, a.price > 0);

                                    if (p) {
                                      setAudioPlayed(true);
                                      setCurrentAudio(a);
                                    }
                                  }}
                                >
                                  <i className="fa fa-play"></i>
                                </button>
                              )}

                              {audioPlayed && (
                                <button
                                  className="icon-wrap play-poi-btn play-poi"
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    value.pauseAudio();
                                    setAudioPlayed(false);
                                    if (
                                      a.audioFile !== currentAudio.audioFile
                                    ) {
                                      value.setPlayedObject(a);
                                    }
                                  }}
                                >
                                  <i className="fa fa-play"></i>
                                </button>
                              )}
                            </>
                          );
                        }}
                      </CiviglioConsumer>
                      <h6
                        className="mb-3 mr-2 title-poi"
                        style={{ verticalAlign: "text-bottom" }}
                      >
                        {a.audioTitle}
                      </h6>
                    </li>
                    <li className="d-flex">
                      <div className="recent-main">
                        <div className="recent-img">
                          <Image
                            preview={false}
                            width={100}
                            src={`${CLOUDFRONT_URL}/images/${a.immagine}`}
                            alt="poi audio"
                          />
                        </div>
                        <div className="info-img audio-description">
                          <h6
                            style={{ color: '#3e82f7', cursor: 'pointer' }}
                            onClick={() => {
                              router.push(
                                `/guide/pub/canale/${a.proprietario_uuid}?mobile=${isMobile}`
                              );
                            }}
                          >
                            {a.owner?.channelTitle || ""}
                          </h6>

                          <ExpandableParagraph text={a.description} />

                          <div
                            style={{ marginTop: "3px", fontStyle: "italic" }}
                          >
                            <div
                              className="row"
                              style={{ alignItems: "center" }}
                            >
                              <div className="col-3">
                                <IntlMessage id="poidetail.audio.price" />
                                <span
                                  style={{
                                    fontStyle: "italic",
                                    color: "#189005",
                                    paddingLeft: "5px",
                                  }}
                                >
                                  {a.price === 0 ? "For free" : a.price}
                                </span>
                              </div>

                              <div className="col-7">
                                <Button
                                  type="link"
                                  icon={
                                    <FolderViewOutlined
                                      style={{ verticalAlign: "text-top" }}
                                    />
                                  }
                                  onClick={() => {
                                    router.push(
                                      `/guide/pub/canale/${a.proprietario_uuid}?mobile=${isMobile}`
                                    );
                                  }}
                                >
                                  <span>
                                    <IntlMessage id="poidetail.channel" />
                                  </span>
                                </Button>
                              </div>
                              <div className="col-2">
                                <div style={{ float: "right" }}>
                                  <LikeMediaIcon
                                    customClass="like-custom"
                                    liked={a.liked}
                                    onLike={() => handleLike(a)}
                                    onDisLike={() => handleDislike(a)}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AudiosPoi;
