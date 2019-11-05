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

const SCREEN_WIDTH  = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;

const TILE_ANIMATION_TIME = 300;

const TILE_S_SIZE = 120;
const TILE_M_SIZE = TILE_S_SIZE + 24;
const TILE_L_SIZE = SCREEN_WIDTH - 16 * 3;

const ANIMATION = {
    to_s: TILE_S_SIZE,
    to_m: TILE_M_SIZE,
    to_l: TILE_L_SIZE,
}

const tilesContent = [
    {
        id: 'j35g9h34',
        title: 'X',
        whAnim: new Animated.Value(TILE_S_SIZE),
        transformAnim: new Animated.Value(0),
        expanded: false,
        bg: BG_BLACK,
        point: {x:0,y:0},
    }, {
        id: 'g04j5g0j',
        title: 'Y',
        whAnim: new Animated.Value(TILE_S_SIZE),
        transformAnim: new Animated.Value(0),
        expanded: false,
        bg: BG_BLACK,
        point: {x:0,y:0},
    }, {
        id: 'kdt29kf0',
        title: 'Z',
        whAnim: new Animated.Value(TILE_S_SIZE),
        transformAnim: new Animated.Value(0),
        expanded: false,
        bg: BG_BLACK,
        point: {x:0,y:0},
    },
    {
        id: 'j35g9h34-a',
        title: 'A',
        whAnim: new Animated.Value(TILE_S_SIZE),
        transformAnim: new Animated.Value(0),
        expanded: false,
        bg: BG_BLACK,
        point: {x:0,y:0},
    }, {
        id: 'g04j5g0j-b',
        title: 'B',
        whAnim: new Animated.Value(TILE_S_SIZE),
        transformAnim: new Animated.Value(0),
        expanded: false,
        bg: BG_BLACK,
        point: {x:0,y:0},
    }, {
        id: 'kdt29kf0-c',
        title: 'C',
        whAnim: new Animated.Value(TILE_S_SIZE),
        transformAnim: new Animated.Value(0),
        expanded: false,
        bg: BG_BLACK,
        point: {x:0,y:0},
    },
];

const Tile = ({ tile, onAnimate, onExpand, onToggle, onClose, onLayout, children }) => {
    const onPressAnimate = () => {
        onToggle(tile.id);
    };

    const onPressInAnimate = () => {
        onAnimate(tile.id, ANIMATION.to_m).start();
    };

    const onPressOutAnimate = () => {
        if (tile.expanded) return;

        onAnimate(tile.id, ANIMATION.to_s).start();
    };

    const onLongPressAnimate = () => {
        onExpand(tile.id); // onAnimate inside of onExpand
    };

    const newWH = { width: tile.whAnim, height: tile.whAnim };
    const newBG = { backgroundColor: tile.bg };
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

    return (
        <TouchableWithoutFeedback
            onLayout={e => onLayout(tile.id, e.nativeEvent.layout)}
            onPress={onPressAnimate}
            onPressIn={onPressInAnimate}
            onPressOut={onPressOutAnimate}
            onLongPress={onLongPressAnimate}
            delayPressIn={10}
            delayLongPress={300}
            disabled={tile.expanded}
        >
            <View style={styles.tileContainer}>
                <Animated.View style={[styles.tile, newWH, newBG, { transform }]}>
                    {children}
                    {tile.point && <Text style={{color:'white'}}>{`${tile.point.x} ${tile.point.y}`}</Text>}
                    <TouchableOpacity onPress={() => { onClose(tile.id); }}>
                        <Text style={{color:'white'}}>(close)</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </TouchableWithoutFeedback>
    )
}

const TilesView = ({ tiles, onAnimateTile, onExpandTile, onToggleTile, onCloseTile, onLayoutTile }) => {
    return (
        <React.Fragment>
            {tiles.map(t =>
                <Tile 
                    key={t.id} 
                    tile={t} 
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

    // useEffect(() => { console.log(state1, state2)}, [state1])

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

        return Animated.timing(tiles[tIndex].whAnim, {
            toValue: type,
            duration: TILE_ANIMATION_TIME,
        });
    }

    const onExpandTile = (tId) => {
        const tIndex = tiles.findIndex(t => t.id === tId);
        const tile   = tiles[tIndex];

        setTiles(updatedTiles(tIndex, {
            expanded: true,
            bg: BG_BLACK,
        }));

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

        setTiles(updatedTiles(tIndex, {
            bg: tiles[tIndex].bg === BG_BLACK ? BG_LIGHT : BG_BLACK,
        }));
    }

    const onCloseTile = (tId) => {
        const tIndex = tiles.findIndex(t => t.id === tId);

        setTiles(updatedTiles(tIndex, {
            expanded: false,
        }));

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

        setTiles(updatedTiles(tIndex, {
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
                onAnimateTile={onAnimateTile}
                onExpandTile={onExpandTile}
                onToggleTile={onToggleTile}
                onCloseTile={onCloseTile}
                onLayoutTile={onLayoutTile}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'row',
        flexWrap: 'wrap',
        // justifyContent: 'center',
        // alignItems: 'center',
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