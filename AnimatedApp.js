import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';

const BG_BLACK = 'black';
const BG_LIGHT = 'grey';

const TILE_ANIMATION_TIME = 300;

const TILE_S_SIZE = 100;
const TILE_M_SIZE = 125;
const TILE_L_SIZE = 300;

const Tile = (props) => {
    const [bg, setBG] = useState(BG_BLACK); // цвет плитки
    const [shouldClose, setShouldClose] = useState(true); // нужно ли сворачивать плитку. если плитка развернута до L_SIZE, то false.
    const [whAnim] = useState(new Animated.Value(TILE_S_SIZE)); // width&height state

    useEffect(() => {
        
    });

    const onPressAnimate = () => {
        setBG(bg === BG_BLACK ? BG_LIGHT : BG_BLACK);
    };

    const onPressInAnimate = () => {
        Animated.timing(whAnim, {
            toValue: TILE_M_SIZE,
            duration: TILE_ANIMATION_TIME,
        }).start();
    };

    const onPressOutAnimate = () => {
        if (!shouldClose) return;

        Animated.timing(whAnim, {
            toValue: TILE_S_SIZE,
            duration: TILE_ANIMATION_TIME,
        }).start();
    };

    const onLongPressAnimate = () => {
        setShouldClose(false);
        setBG(BG_BLACK); // возвращать цвет плитки в темный

        Animated.timing(whAnim, {
            toValue: TILE_L_SIZE,
            duration: TILE_ANIMATION_TIME,
        }).start();
    };

    const newWH = { width: whAnim, height: whAnim };
    const newBG = { backgroundColor: bg };

    return (
        <TouchableWithoutFeedback
            onPress={onPressAnimate}
            onPressIn={onPressInAnimate}
            onPressOut={onPressOutAnimate}
            onLongPress={onLongPressAnimate}
            delayPressIn={10}
            delayLongPress={300}
            disabled={!shouldClose}
            style={[styles.tileContainer, !shouldClose ? { flex: 1 } : { flex: 0 }]}
        >
            <Animated.View style={[styles.tile, newWH, newBG]}>
                {props.children}
            </Animated.View>
        </TouchableWithoutFeedback>
    )
}

const AnimatedApp = () => {
    return (
        <View style={styles.body}>        
            <Tile style={styles.tile}>
                <Text style={{color: 'white', fontSize: 50, margin: 10}}>O</Text>
            </Tile>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },

    tileContainer: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tile: {
        width: 100,
        height: 100,
        backgroundColor: 'black',
        opacity: 0.7,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default AnimatedApp;