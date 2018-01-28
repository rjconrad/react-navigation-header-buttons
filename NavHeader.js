/*
* @flow
*/
import * as React from 'react';
import { NavButton } from './NavButton';
import { StyleSheet, Platform, View, Text } from 'react-native';
import { OverflowButton, textTransformer } from './OverflowButton';
const OS_IOS = Platform.OS === 'ios';

type ItemProps = {
  onPress: () => void,
  label: string,
  show: string,
  IconElement?: React.Node,
  iconName?: string,
  color?: string,
  size?: number,
  buttonStyle?: Object,
};

// TODO check RTL
class HeaderItem extends React.Component<ItemProps> {
  static SHOW_ALWAYS = 'always';
  static SHOW_NEVER = 'never';

  static defaultProps = {
    show: 'always',
  };
  render() {
    return null;
  }
}

type NavHeaderProps = {
  children: React.Node,
  left: boolean,
  IconComponent?: React.ComponentType<*>,
  size?: number,
  color?: string,
  OverflowIcon?: React.Node,
};

export class NavHeader extends React.Component<NavHeaderProps> {
  static Item = HeaderItem;
  static defaultProps = {
    left: false,
  };

  render() {
    const { visibleButtons, hiddenButtons } = getVisibleAndHiddenButtons(this.props);
    const { color, OverflowIcon } = this.props;

    return (
      <View style={[styles.row, this.getEdgeMargin()]}>
        {visibleButtons.length > 0 && this.renderVisibleButtons(visibleButtons)}
        {hiddenButtons.length > 0 && (
          <OverflowButton color={color} hiddenButtons={hiddenButtons} OverflowIcon={OverflowIcon} />
        )}
      </View>
    );
  }

  getEdgeMargin() {
    return this.props.left ? styles.extraEdgeMarginOnLeft : styles.extraEdgeMarginOnRight;
  }

  renderVisibleButtons(visibleButtons: Array<React.Element<*>>) {
    return visibleButtons.map(btn => {
      const { props: { label, IconElement } } = btn;

      const ButtonElement = IconElement ? IconElement : this.renderVisibleButton(btn.props);

      return <NavButton key={label} ButtonElement={ButtonElement} {...btn.props} />;
    });
  }

  renderVisibleButton(itemProps: ItemProps) {
    const { IconComponent, size, color } = this.props;
    const { iconName, label, buttonStyle } = itemProps;

    return IconComponent && iconName ? (
      <IconComponent
        name={iconName}
        color={color}
        size={size}
        style={[styles.button, buttonStyle]}
      />
    ) : (
      <Text style={[styles.text, { color }, buttonStyle]}>{textTransformer(label)}</Text>
    );
  }
}

function getVisibleAndHiddenButtons(props) {
  let visibleButtons = [];
  let hiddenButtons = [];

  React.Children.forEach(props.children, child => {
    if (child && typeof child === 'object') {
      // TODO implement ifRoom, which will be tricky
      if (!child.props.show || child.props.show === HeaderItem.SHOW_ALWAYS) {
        visibleButtons.push(child);
      } else {
        hiddenButtons.push(child);
      }
    }
  });

  let edgeAdjacentBtnWillShowIcon = hiddenButtons.length > 0;
  if (visibleButtons.length > 0 && hiddenButtons.length === 0) {
    const edgeAdjacentBtnIndex = props.left ? 0 : visibleButtons.length - 1;
    const edgeAdjacentBtn = visibleButtons[edgeAdjacentBtnIndex];
    edgeAdjacentBtnWillShowIcon =
      edgeAdjacentBtn.props.iconName || edgeAdjacentBtn.props.IconElement;
  }

  return {
    edgeAdjacentBtnWillShowIcon,
    visibleButtons,
    hiddenButtons,
  };
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  extraEdgeMarginOnLeft: {
    ...Platform.select({
      android: {
        marginLeft: 5,
      },
      ios: {
        marginLeft: 4,
      },
    }),
  },
  extraEdgeMarginOnRight: {
    ...Platform.select({
      android: {
        marginRight: 4,
      },
      ios: {
        marginRight: 5,
      },
    }),
  },
  text: {
    ...Platform.select({
      android: {
        fontFamily: 'sans-serif-medium',
        fontSize: 14,
        marginHorizontal: 11,
      },
      ios: {
        fontSize: 17,
        marginHorizontal: 10,
      },
    }),
  },
  button: {
    ...Platform.select({
      android: {
        marginHorizontal: 11,
      },
      ios: {
        marginHorizontal: 11,
      },
    }),
  },
});
