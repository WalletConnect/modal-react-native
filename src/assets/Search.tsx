import Svg, { Path, SvgProps } from 'react-native-svg';
const SvgSearch = (props: SvgProps) => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none" {...props}>
    <Path
      fill="#949E9E"
      fillRule="evenodd"
      d="M10.432 11.492c-.354-.353-.91-.382-1.35-.146a5.5 5.5 0 1 1 2.265-2.265c-.237.441-.208.997.145 1.35l3.296 3.296a.75.75 0 1 1-1.06 1.061l-3.296-3.296Zm.06-5a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default SvgSearch;
