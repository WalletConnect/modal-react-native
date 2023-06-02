import Svg, { Path, SvgProps } from 'react-native-svg';

const SvgDisconnect = (props: SvgProps) => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none" {...props}>
    <Path
      fill={props.fill || '#fff'}
      d="M9.25 2.5H6.64c-1.26 0-2.107.002-2.757.06-.629.057-.926.157-1.122.269a2.5 2.5 0 0 0-.933.933c-.111.196-.212.493-.268 1.122-.059.65-.06 1.496-.06 2.756v.72c0 1.261.001 2.108.06 2.757.056.629.157.926.268 1.122a2.5 2.5 0 0 0 .933.933c.196.112.493.212 1.122.269.65.058 1.496.06 2.757.06h2.61a.75.75 0 0 1 0 1.5H6.64c-2.467 0-3.7 0-4.622-.526a4 4 0 0 1-1.493-1.493C0 12.062 0 10.828 0 8.36v-.72c0-2.467 0-3.7.525-4.621a4 4 0 0 1 1.493-1.493C2.94 1 4.173 1 6.64 1h2.61a.75.75 0 1 1 0 1.5Z"
    />
    <Path
      fill={props.fill || '#fff'}
      d="M10.47 12.03a.75.75 0 0 1 0-1.06l1.793-1.793a.25.25 0 0 0-.177-.427H7.75a.75.75 0 1 1 0-1.5h4.336a.25.25 0 0 0 .177-.426L10.47 5.03a.75.75 0 1 1 1.06-1.06l3.324 3.322a1 1 0 0 1 0 1.415L11.53 12.03a.75.75 0 0 1-1.06 0Z"
    />
  </Svg>
);

export default SvgDisconnect;
