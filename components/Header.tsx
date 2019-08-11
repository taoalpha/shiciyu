import React from 'react';
import { Text } from 'react-native';

enum Fonts {
  h6 = 14,
  h5 = 18,
  h4 = 24,
  h3 = 32,
  h2 = 36,
  h1 = 40
}

interface Props {
    style?: any,
    level?: keyof typeof Fonts 
}

const HeaderStyles = {
  fontFamily: "shi"
}

export class Header extends React.Component {
  props: Props | any;
  render() {
    return <Text {...this.props} style={[this.props.style, { fontSize: Fonts[this.props.level || "h2"]}, HeaderStyles]} />;
  }
}
