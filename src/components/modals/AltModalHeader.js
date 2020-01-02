import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Platform
} from 'react-native';
import { H3, P } from '../Text';
import { colors } from '../Colors';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { scale } from '../../utils/scale';
import { requireFunctionIfPresent } from '../../utils/PropTypeUtils';
import PropTypes from 'prop-types';

/* An alternative modal header desgin with a centered title and 
   configurable action text on the left and right */
const AltModalHeader = props => (
    <View style={[ styles.menu, props.style ]}>

        <ConditionalSideText
            text={props.leftText}
            func={props.leftAction}
            textStyle={[styles.leftText, props.leftTextStyle]}
        />

        <H3 style={[styles.menuItem, styles.text, styles.title]}>{props.title}</H3>

        <ConditionalSideText
            text={props.rightText}
            func={props.rightAction}
            textStyle={props.rightTextStyle}
            containerStyle={styles.rightMenuItem}
        />
    </View>
);

/* A text componenent that acts like a button if a text property is supplied 
   or like an empty box otherwise */
const ConditionalSideText = props => (
    <View style={[styles.menuItem, props.containerStyle]}>
        {props.text &&
            <TouchableOpacity onPress={props.func} hitSlop={{top: 10, bottom: 10, left: 5, right: 5}}>
                <P style={[
                    styles.text, 
                    styles.link,
                    props.textStyle
                ]}>
                    {props.text}
                </P>
            </TouchableOpacity>
        }
    </View>
);

AltModalHeader.propTypes = {
    title: PropTypes.string.isRequired,
    leftText: PropTypes.string,
    leftAction: requireFunctionIfPresent('leftText'),
    leftTextStyle: PropTypes.object,
    rightText: PropTypes.string,
    rightTextStyle: PropTypes.object,
    rightAction: requireFunctionIfPresent('rightText'),
};

const headerPadding = scale(15);
const styles = StyleSheet.create({
    menu: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        backgroundColor: colors.backgroundColor.normal,
        borderBottomWidth: 0.5,
        borderColor: colors.borderColor.normal,
        padding: headerPadding,
        paddingTop: Platform.OS === "ios" ? headerPadding + getStatusBarHeight() : headerPadding,
    },
    text: {
        fontWeight: 'bold',
        flex: 0,
        paddingHorizontal: scale(15), // Add in larger click area
    },
    menuItem: {
        flexDirection: 'row',
        flex: 1,
    },
    rightMenuItem: {
        justifyContent: 'flex-end',
    },
    link: {
        color: colors.primaryColor,
    },
    leftText: {
        fontWeight: 'normal',
    },
    title: {
        textAlign: 'center',
    },
});

export default AltModalHeader;