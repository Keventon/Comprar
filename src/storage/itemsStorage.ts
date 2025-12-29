import AsyncStorage from "@react-native-async-storage/async-storage";
import { FilterStatus } from "@/types/FilterStatus";

const ITEMS_STORAGE_KEY = "@comprar:items";

export type ItemStorage = {
  id: string;
  description: string;
  quantity: number;
  status: FilterStatus;
};

async function get(): Promise<ItemStorage[]> {
  try {
    const response = await AsyncStorage.getItem(ITEMS_STORAGE_KEY);
    const data: Array<ItemStorage & { quantity?: number }> = response
      ? JSON.parse(response)
      : [];

    return data.map<ItemStorage>((item) => ({
      ...item,
      quantity: item.quantity ?? 1,
    }));
  } catch (error) {
    throw new Error("GET_ITEMS " + error);
  }
}

async function getByStatus(status: FilterStatus): Promise<ItemStorage[]> {
  try {
    const items = await get();
    return items.filter((item) => item.status === status);
  } catch (error) {
    throw new Error("GET_ITEMS_BY_STATUS " + error);
  }
}

async function save(items: ItemStorage[]): Promise<void> {
  try {
    await AsyncStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    throw new Error("SAVE_ITEMS " + error);
  }
}

async function add(newItem: ItemStorage): Promise<ItemStorage[]> {
  const items = await get();
  const updatedItems = [...items, newItem];
  await save(updatedItems);

  return updatedItems;
}

async function remove(id: string): Promise<void> {
  const items = await get();
  const updatedItems = items.filter((item) => item.id !== id);

  await save(updatedItems);
}

async function clear(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ITEMS_STORAGE_KEY);
  } catch (error) {
    throw new Error("CLEAR_ITEMS " + error);
  }
}

async function toogleStatus(id: string): Promise<ItemStorage[]> {
  const items = await get();
  const updatedItems = items.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        status:
          item.status === FilterStatus.PENDING
            ? FilterStatus.DONE
            : FilterStatus.PENDING,
      };
    }
    return item;
  });
  await save(updatedItems);
  return updatedItems;
}

export const itemsStorage = {
  get,
  getByStatus,
  add,
  remove,
  clear,
  toogleStatus,
};
