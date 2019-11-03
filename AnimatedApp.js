import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    Easing,
    StyleSheet,
    Text,
    View,
    Animated,
    TouchableWithoutFeedback,
    TouchableOpacity
} from 'react-native';

const BG_BLACK = 'black';
const BG_LIGHT = 'grey';

const TILE_ANIMATION_TIME = 300;

const TILE_S_SIZE = 100;
const TILE_M_SIZE = 124; // 12 + 12
const TILE_L_SIZE = 250;

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
        props.onExpand(props.tile.id);

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
        >
            <View style={styles.tileContainer}>
                <Animated.View style={[styles.tile, newWH, newBG]}>
                    {props.children}
                    <TouchableOpacity onPress={() => { setShouldClose(true); onPressOutAnimate(); }}><Text style={{color:'white'}}>close (x)</Text></TouchableOpacity>
                </Animated.View>
            </View>
        </TouchableWithoutFeedback>
    )
}

const AnimatedApp = () => {
    const [expandedTileID, setExpandedTileID] = useState(undefined);

    const tilesContent = [{
            id: 'j35g9h34',
            title: 'X'
        }, {
            id: 'g04j5g0j',
            title: 'Y'
        }, {
            id: 'kdt29kf0',
            title: 'Z'
        },
    ];

    return (
        <SafeAreaView style={styles.body}>
            {tilesContent.map(t =>
                <View key={t.id} style={expandedTileID && t.id !== expandedTileID ? {opacity:0.7} : {opacity:0.7}}>
                    <Tile tile={t} onExpand={setExpandedTileID}>
                        <Text style={styles.text}>{t.title}</Text>
                    </Tile>
                </View>
            )}
        </SafeAreaView>
    )
}

// expandedTileID && t.id !== expandedTileID ? {opacity:0} : {opacity:0.7}
// expandedTileID && t.id !== expandedTileID ? {display:'none'} : {display:'flex'}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'white', 
        fontSize: 48,
    },

    tileContainer: {
        width: 116,
        height: 116,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tile: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        opacity: 0.7,
        borderRadius: 20,
    }
});

export default AnimatedApp;