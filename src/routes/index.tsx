import { useEffect } from "react";
import auth from "@react-native-firebase/auth";
import { NavigationContainer } from "@react-navigation/native";

import AuthStack from "@routes/authStack";
import NonAuthStack from "@routes/nonAuthStack";

import { useUserStore } from "@store/user";

export default function Routes() {
  const [user, setUser] = useUserStore((state) => [state.user, state.setUser]);

  useEffect(() => {
    const subscribe = auth().onUserChanged(setUser);
    return subscribe;
  }, []);

  return (
    <NavigationContainer>
      {user ? <AuthStack /> : <NonAuthStack />}
    </NavigationContainer>
  );
}
