import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    Dimensions,
    StyleSheet,
    Text,
    View,
    Animated,
    TouchableWithoutFeedback
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Tile = ({ tile, expandedId, onAnimate, onExpand, onToggle, onClose, onLayout, children }) => {
    const onPressAnimate = () => {
        onToggle(tile.id);
    };

    const onPressInAnimate = () => {
        onAnimate(tile.id, ANIMATION.to_m).start();
    };

    const onPressOutAnimate = () => {
        if (isExpanded(tile)) return;

        onAnimate(tile.id, ANIMATION.to_s).start();
    };

    const onLongPressAnimate = () => {
        onExpand(tile.id); // onAnimate inside of onExpand
    };

    const isExpanded = t => expandedId && t.id === expandedId;
    const noExpandedTile = () => typeof expandedId !== "undefined";

    const newWH = { width: tile.whAnim, height: tile.whAnim };
    const newBG = { backgroundColor: tile.bg };
    const newOP = { opacity: tile.opacity };
    const newZI = { zIndex: isExpanded(tile) ? 101 : 99 };
    const transform = [{
        translateY: tile.transformAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, SCREEN_HEIGHT/2 - tile.point.y - TILE_S_SIZE / 2 - 12],
        })
    }, {
        translateX: tile.transformAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, SCREEN_WIDTH/2 - tile.point.x - TILE_S_SIZE / 2 - 8],
        })
    }];

    // stupid logic --> pointerEvents={noExpandedTile() ? (isExpanded(tile) ? 'auto' : 'none') : 'auto'}
    // if all tiles are minimized, then 'auto'
    // if only one is expanded, then allow 'auto' only on it
    return (
        <View
            style={newZI}
            onLayout={e => onLayout(tile.id, e.nativeEvent.layout)}
            pointerEvents={noExpandedTile() ? (isExpanded(tile) ? 'auto' : 'none') : 'auto'}
        >
            <TouchableWithoutFeedback
                onPress={onPressAnimate}
                onPressIn={onPressInAnimate}
                onPressOut={onPressOutAnimate}
                onLongPress={onLongPressAnimate}
                delayPressIn={10}
                delayLongPress={TILE_ANIMATION_TIME}
                disabled={isExpanded(tile)}
            >
                <View style={styles.tileContainer}>
                    <Animated.View style={[styles.tile, newWH, newBG, newOP, { transform }]}>
                        {children}
                        <TouchableOpacity onPress={() => { onClose(tile.id); }}>
                            <Text style={{color:'white'}}>(close)</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

const TilesView = ({ tiles, expandedTileId, onAnimateTile, onExpandTile, onToggleTile, onCloseTile, onLayoutTile }) => {
    return (
        <React.Fragment>
            {tiles.map(t =>
                <Tile 
                    key={t.id} 
                    tile={t} 
                    expandedId={expandedTileId}
                    onAnimate={onAnimateTile} 
                    onExpand={onExpandTile}
                    onToggle={onToggleTile}
                    onClose={onCloseTile}
                    onLayout={onLayoutTile}
                >
                    <Text style={styles.text}>{t.title}</Text>
                </Tile>
            )}
        </React.Fragment>
    );
}

const AnimatedApp = () => {
    const [tiles, setTiles] = useState(tilesContent);
    const [expandedTileId, setExpandedTileId] = useState(undefined);

    // useEffect(() => { console.log(state1, state2)}, [state1])

    const updateTile = (tIndex, withData) => [
        ...tiles.slice(0, tIndex),
        {
            ...tiles[tIndex], 
            ...withData,
        },
        ...tiles.slice(tIndex + 1)
    ];

    const onAnimateTile = (tId, type) => {
        const tIndex = tiles.findIndex(t => t.id === tId);

        return Animated.timing(tiles[tIndex].whAnim, {
            toValue: type,
            duration: TILE_ANIMATION_TIME,
        });
    }

    const onExpandTile = (tId) => {
        const tIndex = tiles.findIndex(t => t.id === tId);
        const updatedTiles = updateTile(tIndex, {
            bg: BG_BLACK,
        });

        // обновляем opacity у плиток, которые остались маленькими
        for (let i = 0; i < updatedTiles.length; i++) {
            if (i !== tIndex) updatedTiles[i].opacity = 0;
        }

        setExpandedTileId(tId);
        setTiles(updatedTiles);

        Animated.parallel([
            onAnimateTile(tId, ANIMATION.to_l),
            Animated.timing(tiles[tIndex].transformAnim, {
                toValue: 1,
                duration: TILE_ANIMATION_TIME,
            })
        ]).start();
    }

    const onToggleTile = (tId) => {
        const tIndex = tiles.findIndex(t => t.id === tId);

        setTiles(updateTile(tIndex, {
            bg: tiles[tIndex].bg === BG_BLACK ? BG_LIGHT : BG_BLACK,
        }));
    }

    const onCloseTile = (tId) => {
        if (!tId) return;

        const tIndex = tiles.findIndex(t => t.id === tId);
        const updatedTiles = updateTile(tIndex, {});

        // возвращаем opacity у плиток, которые оставались маленькими
        for (let i = 0; i < updatedTiles.length; i++) {
            if (i !== tIndex) updatedTiles[i].opacity = TILE_OPACITY;
        }

        setExpandedTileId(undefined);
        setTiles(updatedTiles);

        Animated.parallel([
            onAnimateTile(tId, ANIMATION.to_s),
            Animated.timing(tiles[tIndex].transformAnim, {
                toValue: 0,
                duration: TILE_ANIMATION_TIME,
            })
        ]).start();
    }

    const onLayoutTile = (tId, layout) => {
        const tIndex = tiles.findIndex(t => t.id === tId);

        setTiles(updateTile(tIndex, {
            point: {
                x: layout.x,
                y: layout.y,
            },
        }));
    }

    return (
        <SafeAreaView style={styles.body}>
            <TilesView
                tiles={tiles}
                expandedTileId={expandedTileId}
                onAnimateTile={onAnimateTile}
                onExpandTile={onExpandTile}
                onToggleTile={onToggleTile}
                onCloseTile={onCloseTile}
                onLayoutTile={onLayoutTile}
            />
        </SafeAreaView>
    )
}

export default AnimatedApp;





// =================
// CONSTANTS
// =================
const BG_BLACK = 'black';
const BG_LIGHT = 'grey';

const SCREEN_WIDTH  = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;

const TILE_OPACITY = 0.7;
const TILE_ANIMATION_TIME = 250;

const TILE_S_SIZE = 100;
const TILE_M_SIZE = TILE_S_SIZE + 24;
const TILE_L_SIZE = SCREEN_WIDTH - 16 * 3;

const ANIMATION = {
    to_s: TILE_S_SIZE,
    to_m: TILE_M_SIZE,
    to_l: TILE_L_SIZE,
};


// =================
// STYLES
// =================
const styles = StyleSheet.create({
    body: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignContent: 'center',
        // alignItems: 'center',
    },
    text: {
        color: 'white', 
        fontSize: 30,
    },

    tileContainer: {
        width: TILE_S_SIZE + 16,
        height: TILE_S_SIZE + 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tile: {
        width: TILE_S_SIZE,
        height: TILE_S_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        opacity: TILE_OPACITY,
        borderRadius: 20,
    }
});


// =================
// DATA
// =================
const tilesContent = [
    {
        id: 'j35g9h34',
        title: 'X',
        whAnim: new Animated.Value(TILE_S_SIZE),
        transformAnim: new Animated.Value(0),
        bg: BG_BLACK,
        point: {x:0,y:0},
        opacity: TILE_OPACITY,
        activated: false,
    }, {
        id: 'g04j5g0j',
        title: 'Y',
        whAnim: new Animated.Value(TILE_S_SIZE),
        transformAnim: new Animated.Value(0),
        bg: BG_BLACK,
        point: {x:0,y:0},
        opacity: TILE_OPACITY,
        activated: false,
    }, {
        id: 'kdt29kf0',
        title: 'Z',
        whAnim: new Animated.Value(TILE_S_SIZE),
        transformAnim: new Animated.Value(0),
        bg: BG_BLACK,
        point: {x:0,y:0},
        opacity: TILE_OPACITY,
        activated: false,
    },
    {
        id: 'j35g9h34-a',
        title: 'A',
        whAnim: new Animated.Value(TILE_S_SIZE),
        transformAnim: new Animated.Value(0),
        bg: BG_BLACK,
        point: {x:0,y:0},
        opacity: TILE_OPACITY,
        activated: false,
    }, {
        id: 'g04j5g0j-b',
        title: 'B',
        whAnim: new Animated.Value(TILE_S_SIZE),
        transformAnim: new Animated.Value(0),
        bg: BG_BLACK,
        point: {x:0,y:0},
        opacity: TILE_OPACITY,
        activated: false,
    }, {
        id: 'kdt29kf0-c',
        title: 'C',
        whAnim: new Animated.Value(TILE_S_SIZE),
        transformAnim: new Animated.Value(0),
        bg: BG_BLACK,
        point: {x:0,y:0},
        opacity: TILE_OPACITY,
        activated: false,
    }, {
        id: 'g04j5g0j-1',
        title: '1',
        whAnim: new Animated.Value(TILE_S_SIZE),
        transformAnim: new Animated.Value(0),
        bg: BG_BLACK,
        point: {x:0,y:0},
        opacity: TILE_OPACITY,
        activated: false,
    }, {
        id: 'kdt29kf0-2',
        title: '2',
        whAnim: new Animated.Value(TILE_S_SIZE),
        transformAnim: new Animated.Value(0),
        bg: BG_BLACK,
        point: {x:0,y:0},
        opacity: TILE_OPACITY,
        activated: false,
    },
];