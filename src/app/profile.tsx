import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Modal, TouchableOpacity } from "react-native";
import { useTheme } from "./context/ThemeContext";
import Button from "@/components/button";
import { router } from "expo-router";
import { useAuth } from "./context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/types";
import Loader from "@/components/loader";
import Wrapper from "@/components/wrapper";
import { AntDesign } from "@expo/vector-icons";
import RadioButton from "@/components/radioButton";
import { styled } from "nativewind";
import { Appearance } from "react-native";

const StyledPressable = styled(Pressable);
type IconName = "mail" | "user" | "bulb1";

const themeDisplayNames: { [key in "light" | "dark" | "system"]: string } = {
  light: "Light",
  dark: "Dark",
  system: "System (Default)",
};

function ProfileEntry({
  title,
  data,
  icon,
}: {
  title: string;
  data: string;
  icon: IconName;
}) {
  return (
    <View className="flex flex-row gap-x-5 items-center mb-7">
      <View className="dark:bg-gray-300 rounded-full p-2">
        <AntDesign name={icon} size={25} />
      </View>
      <View>
        <Text className="font-bold text-base text-black dark:text-gray-300">
          {title}
        </Text>
        <Text className="text-base text-black dark:text-gray-300">{data}</Text>
      </View>
    </View>
  );
}

export default function Profile() {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User>();
  const [modalVisible, setModalVisible] = useState(false);

  // i dont want to touch this shit
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { colorScheme, toggleColorScheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<
    "light" | "dark" | "system"
  >("system");

  const { isAuthenticated, validateAuth, userRole } = useAuth();

  async function handleLogout() {
    await AsyncStorage.removeItem("jwtToken");
    await validateAuth();
    router.replace("/");
  }

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated]);

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

  useEffect(() => {
    fetchProfileDetails();
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
  }, [selectedTheme, toggleColorScheme]);

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
          <Text className="font-bold text-base mb-7 text-black dark:text-gray-300">
            Account
          </Text>
          <View className="flex">
            <ProfileEntry title="Username" data={user!.name} icon="user" />
            <ProfileEntry title="Email" data={user!.email} icon="mail" />
          </View>
        </View>
        <View>
          <Text className="font-bold text-base mb-7 text-black dark:text-gray-300">
            App
          </Text>
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

        <View className="gap-y-4">
          {isAuthenticated && userRole === "admin" ? (
            <View>
              <Button
                title="Requests"
                onPress={() => router.push("/admin/requests")}
              />
            </View>
          ) : null}
          <View>
            <Button
              bgColor="bg-red-500"
              title="Sign out"
              onPress={handleLogout}
            />
          </View>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            // Alert.alert("Modal has been closed.");
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
                <Text className="font-bold text-xl mb-4 text-black">
                  Color Scheme
                </Text>
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
                      className="font-bold items-center justify-center text-black"
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
