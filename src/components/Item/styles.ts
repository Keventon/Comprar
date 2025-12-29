import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  description: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },
  quantityContainer: {
    minWidth: 32,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E4E6EC",
    backgroundColor: "#F6F7FB",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2C46B1",
  },
});
