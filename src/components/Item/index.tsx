import { Text, TouchableOpacity, View } from "react-native";
import { StatusIcon } from "../StatusIcon";
import { Trash2 } from "lucide-react-native";
import { styles } from "./styles";
import { ItemStorage } from "@/storage/itemsStorage";

type Props = {
  data: ItemStorage;
  onRemove?: () => void;
  onStatus?: () => void;
};

export function Item({ data, onRemove, onStatus }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onStatus}>
        <StatusIcon status={data.status} />
      </TouchableOpacity>

      <Text style={styles.description}>{data.description}</Text>
      <View style={styles.quantityContainer}>
        <Text style={styles.quantityText}>{data.quantity}</Text>
      </View>
      <TouchableOpacity onPress={onRemove}>
        <Trash2 size={18} color="#828282" />
      </TouchableOpacity>
    </View>
  );
}
