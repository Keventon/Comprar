import { StatusBar } from "expo-status-bar";
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { styles } from "./styles";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Filter } from "@/components/Filter";
import { FilterStatus } from "@/types/FilterStatus";
import { Item } from "@/components/Item";
import { useEffect, useState } from "react";
import { ItemStorage, itemsStorage } from "@/storage/itemsStorage";

const FILTER_STATUS: FilterStatus[] = [FilterStatus.PENDING, FilterStatus.DONE];
export function Home() {
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.PENDING);
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [items, setItems] = useState<ItemStorage[]>([]);

  function updateFilter(status: FilterStatus) {
    setFilter(status);
  }

  async function handleAdd() {
    const descriptionFormatted = description.trim();
    const parsedQuantity = Number(quantity);

    if (descriptionFormatted === "") {
      return Alert.alert("Descrição vazia!", "Informe um item para adicionar.");
    }

    if (!quantity.trim() || Number.isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return Alert.alert(
        "Quantidade inválida!",
        "Informe uma quantidade maior que zero."
      );
    }

    const newItem = {
      id: Math.random().toString(32).substring(2),
      description: descriptionFormatted,
      quantity: parsedQuantity,
      status: FilterStatus.PENDING,
    };

    await itemsStorage.add(newItem);
    await itemsByStatus();

    setFilter(FilterStatus.PENDING);
    setDescription("");
    setQuantity("");
  }

  async function itemsByStatus() {
    try {
      const response = await itemsStorage.getByStatus(filter);
      setItems(response);
    } catch (error) {
      Alert.alert("Ops", "Não foi possível carregar os itens.");
    }
  }

  async function removeItem(id: string) {
    try {
      await itemsStorage.remove(id);
      await itemsByStatus();

      Alert.alert("Removido", "Item removido com sucesso!");
    } catch (error) {
      Alert.alert("Ops", "Não foi possível remover o item.");
    }
  }

  function handleClear() {
    Alert.alert("Limpar", "Deseja realmente limpar todos os itens?", [
      { text: "Não" },
      { text: "Sim", style: "destructive", onPress: () => onClear() },
    ]);
  }

  async function onClear() {
    try {
      await itemsStorage.clear();
      setItems([]);
    } catch (error) {
      Alert.alert("Ops", "Não foi possível limpar os itens.");
    }
  }

  async function handleToogleStatus(id: string) {
    try {
      await itemsStorage.toogleStatus(id);
      await itemsByStatus();
    } catch (error) {
      Alert.alert("Ops", "Não foi possível alterar o status do item.");
    }
  }

  useEffect(() => {
    itemsByStatus();
  }, [filter]);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Image style={styles.logo} source={require("@/assets/logo.png")} />

      <View style={styles.form}>
        <Input
          placeholder="O que você precisa comprar?"
          onChangeText={setDescription}
          value={description}
          returnKeyType="next"
        />
        <Input
          placeholder="Qual a quantidade?"
          onChangeText={setQuantity}
          keyboardType="number-pad"
          value={quantity}
          returnKeyType="send"
          onSubmitEditing={handleAdd}
        />
        <Button title="Adicionar" onPress={handleAdd} />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          {FILTER_STATUS.map((status) => (
            <Filter
              key={status}
              status={status}
              isActive={filter === status}
              onPress={() => updateFilter(status)}
            />
          ))}

          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearText}>Limpar</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Item
              data={item}
              onRemove={() => removeItem(item.id)}
              onStatus={() => handleToogleStatus(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <Text style={styles.emptyListText}>Nenhum item aqui.</Text>
          )}
        />
      </View>
    </View>
  );
}
