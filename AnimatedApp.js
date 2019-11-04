import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    Dimensions,
    StyleSheet,
    Text,
    View,
    Animated,
    TouchableWithoutFeedback,
    TouchableOpacity
} from 'react-native';

const BG_BLACK = 'black';
const BG_LIGHT = 'grey';

const SCREEN_WIDTH = Dimensions.get('screen').width;

const TILE_ANIMATION_TIME = 300;

const TILE_S_SIZE = 120;
const TILE_M_SIZE = TILE_S_SIZE + 24;
const TILE_L_SIZE = SCREEN_WIDTH - 16 * 3;

const ANIMATION = {
    to_s: TILE_S_SIZE,
    to_m: TILE_M_SIZE,
    to_l: TILE_L_SIZE,
}

const tilesContent = [{
        id: 'j35g9h34',
        title: 'X',
        whAnim: new Animated.Value(TILE_S_SIZE),
        shouldClose: true,
        bg: BG_BLACK,
    }, {
        id: 'g04j5g0j',
        title: 'Y',
        whAnim: new Animated.Value(TILE_S_SIZE),
        shouldClose: true,
        bg: BG_BLACK,
    }, {
        id: 'kdt29kf0',
        title: 'Z',
        whAnim: new Animated.Value(TILE_S_SIZE),
        shouldClose: true,
        bg: BG_BLACK,
    },
];

const Tile = ({ tile, onAnimate, onExpand, onToggle, onClose, children }) => {
    const onPressAnimate = () => {
        onToggle(tile.id);
    };

    const onPressInAnimate = () => {
        onAnimate(tile.id, ANIMATION.to_m);
    };

    const onPressOutAnimate = () => {
        if (!tile.shouldClose) return;

        onAnimate(tile.id, ANIMATION.to_s);
    };

    const onLongPressAnimate = () => {
        onExpand(tile.id);

        onAnimate(tile.id, ANIMATION.to_l);
    };

    const newWH = { width: tile.whAnim, height: tile.whAnim };
    const newBG = { backgroundColor: tile.bg };

    return (
        <TouchableWithoutFeedback
            onPress={onPressAnimate}
            onPressIn={onPressInAnimate}
            onPressOut={onPressOutAnimate}
            onLongPress={onLongPressAnimate}
            delayPressIn={10}
            delayLongPress={300}
            disabled={!tile.shouldClose}
        >
            <View style={styles.tileContainer}>
                <Animated.View style={[styles.tile, newWH, newBG]}>
                    {children}
                    <TouchableOpacity onPress={() => { onClose(tile.id); }}>
                        <Text style={{color:'white'}}>(close)</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </TouchableWithoutFeedback>
    )
}

const TilesView = ({ tiles, onAnimateTile, onExpandTile, onToggleTile, onCloseTile }) => {
    return (
        <View>
            {tiles.map(t =>
                <Tile 
                    key={t.id} 
                    tile={t} 
                    onAnimate={onAnimateTile} 
                    onExpand={onExpandTile}
                    onToggle={onToggleTile}
                    onClose={onCloseTile}
                >
                    <Text style={styles.text}>{t.title}</Text>
                </Tile>
            )}
        </View>
    );
}

const AnimatedApp = () => {
    const [tiles, setTiles] = useState(tilesContent);

    const updatedTiles = (tIndex, withData) => [
        ...tiles.slice(0, tIndex),
        {
            ...tiles[tIndex], 
            ...withData,
        },
        ...tiles.slice(tIndex + 1)
    ];

    const onAnimateTile = (tId, type) => {
        const tIndex = tiles.findIndex(t => t.id === tId);

        Animated.timing(tiles[tIndex].whAnim, {
            toValue: type,
            duration: TILE_ANIMATION_TIME,
        }).start();
    }

    const onExpandTile = (tId) => {
        const tIndex = tiles.findIndex(t => t.id === tId);

        setTiles(updatedTiles(tIndex, {
            shouldClose: false,
            bg: BG_BLACK,
        }));
    }

    const onToggleTile = (tId) => {
        const tIndex = tiles.findIndex(t => t.id === tId);

        setTiles(updatedTiles(tIndex, {
            bg: tiles[tIndex].bg === BG_BLACK ? BG_LIGHT : BG_BLACK,
        }));
    }

    const onCloseTile = (tId) => {
        const tIndex = tiles.findIndex(t => t.id === tId);

        setTiles(updatedTiles(tIndex, {
            shouldClose: true,
        }));

        onAnimateTile(tId, ANIMATION.to_s);
    }

    return (
        <SafeAreaView style={styles.body}>
            <TilesView
                tiles={tiles}
                onAnimateTile={onAnimateTile}
                onExpandTile={onExpandTile}
                onToggleTile={onToggleTile}
                onCloseTile={onCloseTile}
            />
        </SafeAreaView>
    )
}

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
        width: TILE_S_SIZE + 16,
        height: TILE_S_SIZE + 16,
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