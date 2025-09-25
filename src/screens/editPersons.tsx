import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Input from "@components/input";
import Button from "@components/button";
import Loading from "@components/loading";
import ActionModal from "@components/actionModal";

import DebtService from "@services/debt";
import PersonService from "@services/person";

import { useDebtStore } from "@store/debt";
import { useUserStore } from "@store/user";
import { usePersonStore } from "@store/person";

import { Person } from "@interfaces/person";

import { FIREBASE_ERROR } from "@enums/firebase";
import { COLOR } from "@enums/colors";
import { ACTIONS } from "@enums/actions";

export default function EditPersons() {
  const { user } = useUserStore();
  const { getDebtsToPay, getDebtsToReceive } = useDebtStore();
  const {
    persons,
    loadingPersons,
    selectedPersonID,
    getPersonsByCreator,
    setSelectedPersonID,
  } = usePersonStore();

  const [index, setindex] = useState<number>();
  const [action, setaction] = useState<ACTIONS>();
  const [personName, setpersonName] = useState<string>("");
  const [personModalOpen, setpersonModalOpen] = useState<boolean>(false);

  const editPersonlist = async () => {
    if (action === ACTIONS.add) {
      await PersonService.CreatePerson({
        name: personName,
        creatorID: user.uid,
      })
        .then(() => {
          Alert.alert("Sucesso!", "Devedor/recebedor criado com sucesso", [
            {
              text: "OK",
              onPress: () => {
                getPersonsByCreator();
                setpersonModalOpen(false);
              },
            },
          ]);
        })
        .catch((err) => {
          Alert.alert(
            "Erro ao criar usuário!",
            FIREBASE_ERROR[err.code] || err.code
          );
        });
    }

    if (action === ACTIONS.edit) {
      await PersonService.EditPerson({
        ...persons[index],
        name: personName,
      })
        .then(() => {
          Alert.alert("Sucesso!", "Devedor/recebedor editado com sucesso", [
            {
              text: "OK",
              onPress: () => {
                setpersonModalOpen(false);
                getPersonsByCreator();
                if (persons[index].id === selectedPersonID) {
                  getDebtsToPay();
                  getDebtsToReceive();
                }
              },
            },
          ]);
        })
        .catch((err) => {
          Alert.alert(
            "Erro ao editar devedor/recebedor!",
            FIREBASE_ERROR[err.code] || err.code
          );
        });
    }

    if (action === ACTIONS.remove) {
      const deletePerson = await PersonService.DeletePerson({
        ...persons[index],
        name: personName,
      });
      const deletePersonDebts = await DebtService.DeleteAllDebtsByPersonID(
        persons[index].id
      );

      Promise.all([deletePerson, deletePersonDebts])
        .then(() => {
          Alert.alert(
            "Sucesso!",
            "Devedor/recebedor e todos débitos associados deletados com sucesso",
            [
              {
                text: "OK",
                onPress: () => {
                  setpersonModalOpen(false);
                  getPersonsByCreator();
                  if (persons[index].id === selectedPersonID) {
                    setSelectedPersonID(null);
                    getDebtsToPay();
                    getDebtsToReceive();
                  }
                },
              },
            ]
          );
        })
        .catch((err) => {
          Alert.alert(
            "Erro ao deletar devedor/recebedor e débitos associados",
            FIREBASE_ERROR[err.code] || err.code
          );
        });
    }

    setpersonName("");
  };

  const personItem = (person: Person, index: number) => {
    return (
      <View className="w-full bg-gray-200 rounded-3xl p-4 my-1 flex-row">
        <View className="w-[80%] items-center justify-center">
          <Text className="text-md font-semibold">Nome: {person.name}</Text>
        </View>
        <View className="w-[20%] items-center justify-evenly flex-row">
          <TouchableOpacity
            onPress={() => {
              setindex(index);
              setpersonName(person.name);
              setaction(ACTIONS.edit);
              setpersonModalOpen(true);
            }}
          >
            <Feather name="edit-3" size={24} color={COLOR.black} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setindex(index);
              setaction(ACTIONS.remove);
              setpersonModalOpen(true);
            }}
          >
            <Feather name="trash-2" size={24} color={COLOR.red} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  useEffect(() => {
    getPersonsByCreator();
  }, []);

  return (
    <View className="flex-1 w-screens justify-center items-center p-4">
      <View className="w-full items-center flex-1">
        <Text className="text-primary font-bold text-xl mb-1">
          Lista de Devedores/recebedores
        </Text>
        {persons.length > 0 ? (
          <View className="flex-1 w-full">
            <FlatList
              data={persons}
              renderItem={({ item, index }) => personItem(item, index)}
              keyExtractor={(item) => item.id}
              refreshControl={
                <RefreshControl
                  refreshing={loadingPersons}
                  onRefresh={() => {
                    getPersonsByCreator();
                  }}
                />
              }
            />
          </View>
        ) : (
          <View className="flex-1 justify-center">
            <Text className="text-gray-500">
              Não há devedor/recebedor cadastrado para esse usuário
            </Text>
          </View>
        )}
      </View>
      <View className="w-full items-center">
        <Button
          disabled={loadingPersons}
          text={"Adicionar devedor/recebedor"}
          onPress={() => {
            setaction(ACTIONS.add);
            setpersonModalOpen(true);
          }}
          icon={
            loadingPersons ? <Loading color={COLOR.white} size={20} /> : null
          }
        />
      </View>
      <ActionModal
        type={action === ACTIONS.remove ? "alert" : "default"}
        title={`${action === ACTIONS.remove ? "Excluir" : action === ACTIONS.edit ? "Editar" : "Adicionar"} devedor/recebedor`}
        actionText={
          action === ACTIONS.remove
            ? "Excluir"
            : action === ACTIONS.edit
              ? "Editar"
              : "Adicionar"
        }
        isVisible={personModalOpen}
        disableAction={
          action === ACTIONS.edit && personName === persons[index].name
        }
        closeModal={() => {
          setpersonModalOpen(false);
        }}
        startAction={async () => {
          await editPersonlist();
        }}
        content={
          <View className="w-full">
            <View className="w-full flex-row justify-evenly items-center ">
              {action === ACTIONS.remove ? (
                <Text className="text-center text-lg">
                  Excluir o devedor/recebedor deletará também todas as dívidas
                  relacionadas ao perfil selecionado! Continuar?
                </Text>
              ) : (
                <Input
                  title="Nome"
                  value={personName}
                  onChangeText={(txt) => {
                    setpersonName(txt);
                  }}
                />
              )}
            </View>
          </View>
        }
      />
    </View>
  );
}
