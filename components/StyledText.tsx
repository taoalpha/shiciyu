import React from 'react';
import { Text } from 'react-native';

export class MonoText extends React.Component {
  props: any;
  render() {
    return <Text {...this.props} style={[this.props.style, { fontFamily: 'space-mono' }]} />;
  }
}
