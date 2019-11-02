import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Colors,
} from 'react-native';

class AnimatedApp extends React.PureComponent {
    render() {
        return (
            <View style={styles.body}>
                <Text>SOME TEXT yopta</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: 'aliceblue',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AnimatedApp;