import { useState } from "react";
import { Alert, Text, View, Image, TouchableOpacity } from "react-native";

import Input from "@components/input";
import Button from "@components/button";
import Loading from "@components/loading";
import InvertedButton from "@components/invertedButton";

import UserService from "@services/user";

import { FIREBASE_ERROR } from "@enums/firebase";
import { COLOR } from "@enums/colors";

import { EMAIL_REGEX } from "@constants/index";

export default function Login({ navigation }) {
  const [email, setemail] = useState<string>("");
  const [password, setpassword] = useState<string>("");
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
        <Text className="text-3xl text-primary font-bold p-2">Login</Text>
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
        <TouchableOpacity
          className="self-end"
          disabled={!EMAIL_REGEX.test(email)}
          onPress={async () => {
            setloading(true);
            await UserService.ForgotPassword(email)
              .then(() => {
                Alert.alert(
                  "Sucesso!",
                  `Foi enviado um e-mail para ${email} com instruções para criar uma nova senha`
                );
              })
              .catch((err) => {
                setloading(false);
                Alert.alert("Erro!", FIREBASE_ERROR[err.code] || err.code);
              })
              .finally(() => {
                setloading(false);
              });
          }}
        >
          {loading ? null : (
            <Text
              className={`${!EMAIL_REGEX.test(email) ? "text-gray-500" : "text-primary"}`}
            >
              Esqueceu a senha?
            </Text>
          )}
        </TouchableOpacity>
        <View className="m-4 w-full">
          <Button
            disabled={
              !EMAIL_REGEX.test(email) ||
              !password ||
              password.length < 6 ||
              loading
            }
            text="Entrar"
            onPress={async () => {
              setloading(true);
              await UserService.Login(email, password).catch((err) => {
                setloading(false);
                Alert.alert(
                  "Erro ao logar!",
                  FIREBASE_ERROR[err.code] || err.code
                );
              });
            }}
            icon={loading ? <Loading color={COLOR.white} size={28} /> : null}
          />
        </View>
        <View className="w-full items-center justify-center">
          <Text className="mb-2">Ainda não possui uma conta?</Text>
          <InvertedButton
            text={"Cadastre-se"}
            onPress={() => {
              navigation.navigate("SignUp");
            }}
          />
        </View>
      </View>
    </View>
  );
}
