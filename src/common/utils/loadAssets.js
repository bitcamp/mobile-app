import * as Font from "expo-font";
import {
  FontAwesome,
  Ionicons,
  EvilIcons,
  SimpleLineIcons,
  MaterialCommunityIcons,
  AntDesign,
} from "@expo/vector-icons";

const aleoBold = require("../../../assets/fonts/Aleo-Bold.otf");

const fontList = [
  {
    "Aleo-Bold": aleoBold,
  },
  FontAwesome.font,
  Ionicons.font,
  EvilIcons.font,
  SimpleLineIcons.font,
  MaterialCommunityIcons.font,
  AntDesign.font,
];

export default async function loadAssets() {
  await Promise.all([...fontList.map(font => Font.loadAsync(font))]);
}
