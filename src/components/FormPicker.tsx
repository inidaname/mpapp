import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import MaterialIcons from "@react-native-vector-icons/material-icons";

interface PickerOption {
  label: string;
  value: string;
}

interface FormPickerProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder: string;
  control: Control<T>;
  options: PickerOption[];
  rules?: any;
}

function FormPicker<T extends FieldValues>({
  name,
  label,
  placeholder,
  control,
  options,
  rules,
}: FormPickerProps<T>) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const selectedOption = options.find((opt) => opt.value === value);

        return (
          <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>

            <TouchableOpacity
              style={[styles.picker, error && styles.pickerError]}
              onPress={() => setModalVisible(true)}
            >
              <Text
                style={[
                  styles.pickerText,
                  !selectedOption && styles.placeholderText,
                ]}
              >
                {selectedOption ? selectedOption.label : placeholder}
              </Text>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>

            {error && <Text style={styles.errorText}>{error.message}</Text>}

            <Modal
              visible={modalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setModalVisible(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setModalVisible(false)}
              >
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{label}</Text>
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={styles.closeButton}
                    >
                      <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                  </View>

                  <FlatList
                    data={options}
                    keyExtractor={(item) => item.value}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.option,
                          item.value === value && styles.selectedOption,
                        ]}
                        onPress={() => {
                          onChange(item.value);
                          setModalVisible(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            item.value === value && styles.selectedOptionText,
                          ]}
                        >
                          {item.label}
                        </Text>
                        {item.value === value && (
                          <Text style={styles.checkmark}>✓</Text>
                        )}
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </TouchableOpacity>
            </Modal>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  picker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },
  pickerError: {
    borderColor: "#EF4444",
  },
  pickerText: {
    fontSize: 16,
    color: "#111827",
    flex: 1,
  },
  placeholderText: {
    color: "#9CA3AF",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    color: "#6B7280",
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  selectedOption: {
    backgroundColor: "#EFF6FF",
  },
  optionText: {
    fontSize: 16,
    color: "#374151",
  },
  selectedOptionText: {
    color: "#2563EB",
    fontWeight: "600",
  },
  checkmark: {
    fontSize: 20,
    color: "#2563EB",
    fontWeight: "bold",
  },
});

export default FormPicker;
