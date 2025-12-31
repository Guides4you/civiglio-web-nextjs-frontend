import React, { useState, useEffect } from 'react';

const LikeMediaIcon = ({ liked, onLike, onDisLike, customClass }) => {
  const [isLiked, setIsLiked] = useState(liked);

  useEffect(() => {
    setIsLiked(liked);
  }, [liked]);

  const handleClick = (e) => {
    e.stopPropagation();

    if (!isLiked) {
      setIsLiked(true);
      if (onLike) {
        onLike();
      }
    } else {
      setIsLiked(false);
      if (onDisLike) {
        onDisLike();
      }
    }
  };

  return (
    <span
      className={`${customClass} ${isLiked ? "media-icon like like-icon liked" : "media-icon like like-icon"}`}
      onClick={handleClick}
    />
  );
};

export default LikeMediaIcon;
