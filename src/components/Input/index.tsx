import React, { forwardRef, LegacyRef } from "react";
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import { styles } from "./style";
import theme from "../../global/themes";
import { MaterialIcons, FontAwesome, AntDesign } from "@expo/vector-icons";

type IconComponent =
  | React.ComponentType<React.ComponentProps<typeof MaterialIcons>>
  | React.ComponentType<React.ComponentProps<typeof FontAwesome>>
  | React.ComponentType<React.ComponentProps<typeof AntDesign>>;

type Props = TextInputProps & {
  IconLeft?: IconComponent;
  IconRigth?: IconComponent;
  iconLeftName?: string;
  iconRigthName?: string;
  title?: string;
  onIconLeftPress?: () => void;
  onIconRigthPress?: () => void;
};

export const Input = forwardRef(
  (props: Props, ref: LegacyRef<TextInput> | null) => {
    const {
      IconLeft,
      IconRigth,
      iconLeftName,
      iconRigthName,
      title,
      onIconLeftPress,
      onIconRigthPress,
      ...rest
    } = props;

    const width =
      IconLeft && IconRigth ? "80%" : IconLeft || IconRigth ? "90%" : "100%";
    const paddingLeft =
      IconLeft && IconRigth ? 0 : IconLeft || IconRigth ? 10 : 20;

    return (
      <>
        {title && <Text style={styles.titleInput}>{title}</Text>}
        <View style={[styles.boxInput, { paddingLeft }]}>
          {IconLeft && iconLeftName && (
            <TouchableOpacity onPress={onIconLeftPress} style={styles.Button}>
              <IconLeft
                // @ts-ignore RN icon types
                name={iconLeftName}
                size={20}
                color={theme.colors.gray}
                style={styles.Icon}
              />
            </TouchableOpacity>
          )}
          <TextInput ref={ref} style={[styles.input, { width }]} {...rest} />
          {IconRigth && iconRigthName && (
            <TouchableOpacity onPress={onIconRigthPress} style={styles.Button}>
              <IconRigth
                name={iconRigthName}
                size={20}
                color={theme.colors.gray}
                style={styles.Icon}
              />
            </TouchableOpacity>
          )}
        </View>
      </>
    );
  }
);
