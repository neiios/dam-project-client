import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  Pressable,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "./context/ThemeContext";
import Button from "@/components/button";
import { useRouter } from "expo-router";
import { useAuth } from "./context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/types";
import Loader from "@/components/loader";
import Wrapper from "@/components/wrapper";
import { AntDesign } from "@expo/vector-icons";
import RadioButton from "@/components/radiobutton";
import { styled } from "nativewind";
import { Appearance } from "react-native";

const StyledPressable = styled(Pressable);
type IconName = "mail" | "user" | "bulb1";

const themeDisplayNames: { [key in "light" | "dark" | "system"]: string } = {
  light: "Light",
  dark: "Dark",
  system: "System (Default)",
};

const ProfileEntry: React.FC<{
  title: string;
  data: string;
  icon: IconName;
}> = ({ title, data, icon }) => {
  return (
    <View className="flex flex-row gap-x-5 items-center mb-7">
      <AntDesign name={icon} size={25} />
      <View>
        <Text className="font-bold text-base">{title}</Text>
        <Text className="text-base">{data}</Text>
      </View>
    </View>
  );
};

export default function Profile() {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User>();
  const [modalVisible, setModalVisible] = useState(false);
  const { colorScheme, toggleColorScheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<
    "light" | "dark" | "system"
  >("system");
  const { logout } = useAuth();
  const router = useRouter();

  const fetchProfileDetails = async () => {
    try {
      const response = await fetch(
        `http://${process.env.EXPO_PUBLIC_API_BASE}/api/v1/users/profile`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await AsyncStorage.getItem("jwtToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }

      const data: User = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  async function handleLogout() {
    await logout();
    router.replace("/");
  }

  useEffect(() => {
    fetchProfileDetails();
  }, []);

  useEffect(() => {
    (async () => {
      const isAuthenticated = await AsyncStorage.getItem("jwtToken");
      if (!isAuthenticated) {
        router.replace("/");
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const storedTheme = await AsyncStorage.getItem("theme");
      if (storedTheme) {
        setSelectedTheme(storedTheme as "light" | "dark" | "system");
      } else {
        const systemTheme = Appearance.getColorScheme();
        setSelectedTheme(systemTheme as "light" | "dark" | "system");
      }
    })();
  }, []);

  useEffect(() => {
    if (selectedTheme === "system") {
      const systemTheme = Appearance.getColorScheme();
      toggleColorScheme(systemTheme as "light" | "dark");
    } else {
      toggleColorScheme(selectedTheme);
    }
    AsyncStorage.setItem("theme", selectedTheme);
  }, [selectedTheme]);

  const handleThemeChange = (theme: "light" | "dark" | "system") => {
    setSelectedTheme(theme);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Wrapper>
      <View className="p-5 flex">
        <View>
          <Text className="font-bold text-base mb-7">Account</Text>
          <View className="flex">
            <ProfileEntry title="Username" data={user!.name} icon="user" />
            <ProfileEntry title="Email" data={user!.email} icon="mail" />
          </View>
        </View>
        <View>
          <Text className="font-bold text-base mb-7">App</Text>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setModalVisible(true)}
          >
            <ProfileEntry
              title="Color Scheme"
              data={themeDisplayNames[selectedTheme]}
              icon="bulb1"
            />
          </TouchableOpacity>
        </View>
        <Button title="Sign out" onPress={handleLogout} />
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <Pressable
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
            }}
            className="flex-1 justify-center items-center bg-slate-800/20 p-10"
            onPress={() => setModalVisible(false)}
          >
            <Pressable
              style={{ width: "100%" }}
              onPress={(e) => e.stopPropagation()}
            >
              <View className="bg-slate-100 p-5 rounded-3xl shadow-md shadow-black w-full">
                <Text className="font-bold text-xl mb-4">Color Scheme</Text>
                <View>
                  <RadioButton
                    label="System (Default)"
                    value="system"
                    checked={selectedTheme === "system"}
                    onPress={() => handleThemeChange("system")}
                  />
                  <RadioButton
                    label="Light"
                    value="light"
                    checked={selectedTheme === "light"}
                    onPress={() => handleThemeChange("light")}
                  />
                  <RadioButton
                    label="Dark"
                    value="dark"
                    checked={selectedTheme === "dark"}
                    onPress={() => handleThemeChange("dark")}
                  />
                </View>
                <View className="items-end">
                  <StyledPressable
                    className="active:bg-slate-500/20 px-5 py-3 rounded-3xl transition-all"
                    onPress={() => setModalVisible(false)}
                  >
                    <Text
                      className="font-bold items-center justify-center"
                      style={{ textAlignVertical: "center" }}
                    >
                      OK
                    </Text>
                  </StyledPressable>
                </View>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </Wrapper>
  );
}
