import { useState } from "react";
import { Alert, Text, View, Image } from "react-native";

import Input from "@components/input";
import Button from "@components/button";
import Loading from "@components/loading";
import InvertedButton from "@components/invertedButton";

import UserService from "@services/user";

import { FIREBASE_ERROR } from "@enums/firebase";
import { COLOR } from "@enums/colors";

import { EMAIL_REGEX } from "@constants/index";

export default function SignUp({ navigation }) {
  const [email, setemail] = useState<string>();
  const [password, setpassword] = useState<string>();
  const [confirmPassword, setconfirmPassword] = useState<string>();
  const [loading, setloading] = useState<boolean>(false);

  return (
    <View className="flex-1 items-center justify-center w-full p-8 bg-primary">
      <Image
        className="m-4"
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        source={require("../../assets/images/transparent-icon.png")}
        style={{ width: 75, height: 75 }}
      />
      <View className="p-4 w-full items-center justify-center bg-white rounded-3xl">
        <Text className="text-3xl text-primary font-bold p-2">Cadastro</Text>

        <Input
          title="E-mail"
          value={email}
          onChangeText={(txt) => {
            setemail(txt);
          }}
        />
        <Input
          title="Senha"
          value={password}
          onChangeText={(txt) => {
            setpassword(txt);
          }}
          isPassword
        />
        <Input
          title="Confirmar senha"
          value={confirmPassword}
          onChangeText={(txt) => {
            setconfirmPassword(txt);
          }}
          isPassword
        />
        <View className="m-4 w-full">
          <Button
            disabled={
              !EMAIL_REGEX.test(email) ||
              !password ||
              password.length < 6 ||
              !confirmPassword ||
              confirmPassword.length < 6 ||
              loading
            }
            text="Criar conta"
            onPress={async () => {
              setloading(true);
              await UserService.SignUp(email, password, confirmPassword).catch(
                (err) => {
                  setloading(false);
                  Alert.alert(
                    "Erro ao logar!",
                    FIREBASE_ERROR[err.code] || err.code
                  );
                }
              );
            }}
            icon={loading ? <Loading color={COLOR.white} size={28} /> : null}
          />
        </View>
        <View className="w-full items-center justify-center">
          <Text className="mb-4">Já possui conta?</Text>
          <InvertedButton
            text={"Entrar"}
            onPress={() => {
              navigation.navigate("Login");
            }}
          />
        </View>
      </View>
    </View>
  );
}
