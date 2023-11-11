import React from 'react';
import { Image } from 'antd';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import defaultImage from 'assets/bw_image/default_img.png';

const ImageStyled = styled(Image)`
  :where(.css-dev-only-do-not-override-12upa3x).ant-image .ant-image-mask:hover {
    opacity: 1 !important;
  }
`;

function BWImage({ src, fallbackSrc, className, alt, ...props }) {
  if (Array.isArray(src)) {
    return (
      <Image.PreviewGroup visible={true} {...props}>
        {src.map((item) => (
          <ImageStyled src={item} fallback={fallbackSrc} alt={alt} className={className} />
        ))}
      </Image.PreviewGroup>
    );
  }

  return <Image src={src} fallback={fallbackSrc} alt={alt} className={className} {...props} />;
}

BWImage.propTypes = {
  src: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  fallbackSrc: PropTypes.string,
  className: PropTypes.string,
  alt: PropTypes.string,
};

BWImage.defaultProps = {
  src: null,
  fallbackSrc: defaultImage,
  className: '',
  alt: '',
};
export default BWImage;
