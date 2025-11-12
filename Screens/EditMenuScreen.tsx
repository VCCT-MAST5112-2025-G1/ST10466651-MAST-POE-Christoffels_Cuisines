import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  Modal,
  ScrollView,
} from 'react-native';
import { AppDataContext } from '../DataContext';
import { styles } from '../global';

type MenuItem = {
  name: string;
  desc: string;
  price: string;
};

type FoodKeys = "starters" | "mains" | "desserts" | "specials";

export default function EditMenuScreen() {
  const { food, setFood } = useContext(AppDataContext);

  const [mealName, setMealName] = useState('');
  const [mealType, setMealType] = useState('');
  const [mealDesc, setMealDesc] = useState('');
  const [mealPrice, setMealPrice] = useState('');

  // Delete and Edit modal state
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteType, setDeleteType] = useState('');
  const [deleteMealName, setDeleteMealName] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editType, setEditType] = useState('');
  const [editMealName, setEditMealName] = useState('');
  const [editNewDesc, setEditNewDesc] = useState('');
  const [editNewPrice, setEditNewPrice] = useState('');
  const validMealTypes: FoodKeys[] = ["starters", "mains", "desserts", "specials"];

  const resetForm = () => {
    setMealName('');
    setMealType('');
    setMealDesc('');
    setMealPrice('');
  };

  const resetDeleteModal = () => {
    setDeleteModalVisible(false);
    setDeleteType('');
    setDeleteMealName('');
  };

  // Get meal name suggestions based on selected type
  const getMealSuggestions = (): string[] => {
    if (!deleteType) return [];
    const typeKey = deleteType.trim().toLowerCase() as FoodKeys;
    if (!validMealTypes.includes(typeKey)) return [];
    return food[typeKey]?.map((item) => item.name) || [];
  };

  const handleDeleteClick = () => {
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (!deleteMealName || !deleteType) {
      Alert.alert("Error", "Please provide both meal name and type.");
      return;
    }

    const typeKey = deleteType.trim().toLowerCase() as FoodKeys;
    if (!validMealTypes.includes(typeKey)) {
      Alert.alert(
        "Error",
        "Invalid meal type. Use: starters, mains, desserts, specials."
      );
      return;
    }

    const updatedArray = food[typeKey].filter(
      (item) => item.name !== deleteMealName
    );

    if (updatedArray.length === food[typeKey].length) {
      Alert.alert(
        "Error",
        `${deleteType.toUpperCase()} not found. Cannot delete non-existing item.`
      );
      return;
    }

    setFood({
      ...food,
      [typeKey]: updatedArray,
    });

    Alert.alert("Success", `${deleteMealName} deleted!`);
    resetDeleteModal();
  };

  const handleAddToMenu = () => {
    if (!mealName || !mealType || !mealDesc || !mealPrice) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    const typeKey = mealType.trim().toLowerCase() as FoodKeys;

    if (!validMealTypes.includes(typeKey)) {
      Alert.alert(
        "Error",
        "Invalid meal type. Use: starters, mains, desserts, specials."
      );
      return;
    }

    const newMeal: MenuItem = {
      name: mealName.trim(),
      desc: mealDesc.trim(),
      price: mealPrice.trim(),
    };

    setFood({
      ...food,
      [typeKey]: [...food[typeKey], newMeal],
    });

    Alert.alert("Success", `${typeKey.toUpperCase()} added!`);
    resetForm();
  };

  const resetEditModal = () => {
    setEditModalVisible(false);
    setEditType('');
    setEditMealName('');
    setEditNewDesc('');
    setEditNewPrice('');
  };

  // Get meal name suggestions for edit based on selected type
  const getEditMealSuggestions = (): string[] => {
    if (!editType) return [];
    const typeKey = editType.trim().toLowerCase() as FoodKeys;
    if (!validMealTypes.includes(typeKey)) return [];
    return food[typeKey]?.map((item) => item.name) || [];
  };

  const handleEditMenuClick = () => {
    setEditModalVisible(true);
  };

  const confirmEdit = () => {
    if (!editMealName || !editType || !editNewDesc || !editNewPrice) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    const typeKey = editType.trim().toLowerCase() as FoodKeys;
    if (!validMealTypes.includes(typeKey)) {
      Alert.alert(
        "Error",
        "Invalid meal type. Use: starters, mains, desserts, specials."
      );
      return;
    }

    const updatedArray = food[typeKey].map((item) =>
      item.name === editMealName
        ? { ...item, desc: editNewDesc.trim(), price: editNewPrice.trim() }
        : item
    );

    // Check if meal exists
    if (!updatedArray.find((item) => item.name === editMealName)) {
      Alert.alert(
        "Error",
        `${editType.toUpperCase()} not found. Cannot edit non-existing item.`
      );
      return;
    }

    setFood({
      ...food,
      [typeKey]: updatedArray,
    });

    Alert.alert("Success", `${editMealName} edited!`);
    resetEditModal();
  };

  const mealSuggestions = getMealSuggestions();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>EDIT MENU</Text>
        <View style={styles.editmenuBox}>
          <View style={styles.form}>
            <Text style={styles.label}>MEAL NAME:</Text>
            <TextInput
              style={styles.input}
              value={mealName}
              onChangeText={(text) => {
                const capitalized = text
                  .split(' ')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                  .join(' ');
                setMealName(capitalized);
              }}
            />

            <Text style={styles.label}>MEAL TYPE:</Text>
            <TextInput
              style={styles.input}
              value={mealType}
              onChangeText={setMealType}
              placeholder="starters / mains / desserts / specials"
            />

            <Text style={styles.label}>MEAL DESCRIPTION:</Text>
            <TextInput
              style={styles.input}
              value={mealDesc}
              onChangeText={setMealDesc}
            />

            <Text style={styles.label}>PRICE:</Text>
            <TextInput
              style={styles.input}
              value={mealPrice}
              onChangeText={(text) => {
                const numericValue = text.replace(/\D/g, '');
                setMealPrice(numericValue ? `R${numericValue}` : '');
              }}
              keyboardType="numeric"
              placeholder="R0.00"
            />
          </View>

<TouchableOpacity style={styles.button} onPress={handleEditMenuClick}>            <Text style={styles.buttonText}>EDIT MENU</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addButton} onPress={handleAddToMenu}>
            <Text style={styles.buttonText}>ADD TO MENU</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addButton} onPress={handleDeleteClick}>
            <Text style={styles.buttonText}>DELETE</Text>
          </TouchableOpacity>
        </View>

        {/* Edit Modal */}
        <Modal
          visible={editModalVisible}
          transparent
          animationType="slide"
          onRequestClose={resetEditModal}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={editModalStyles.overlay}>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={editModalStyles.modalContainer}>
                  <Text style={editModalStyles.modalTitle}>Edit Meal</Text>

                  <Text style={editModalStyles.label}>SELECT MEAL TYPE:</Text>
                  <View style={editModalStyles.typeButtonsContainer}>
                    {validMealTypes.map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          editModalStyles.typeButton,
                          editType === type && editModalStyles.typeButtonActive,
                        ]}
                        onPress={() => {
                          setEditType(type);
                          setEditMealName('');
                          setEditNewDesc('');
                          setEditNewPrice('');
                        }}
                      >
                        <Text
                          style={[
                            editModalStyles.typeButtonText,
                            editType === type && editModalStyles.typeButtonTextActive,
                          ]}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {editType && getEditMealSuggestions().length > 0 && (
                    <>
                      <Text style={editModalStyles.label}>SELECT MEAL:</Text>
                      <ScrollView style={editModalStyles.suggestionsContainer}>
                        {getEditMealSuggestions().map((suggestion) => (
                          <TouchableOpacity
                            key={suggestion}
                            style={[
                              editModalStyles.suggestionItem,
                              editMealName === suggestion && editModalStyles.suggestionItemActive,
                            ]}
                            onPress={() => setEditMealName(suggestion)}
                          >
                            <Text
                              style={[
                                editModalStyles.suggestionText,
                                editMealName === suggestion && editModalStyles.suggestionTextActive,
                              ]}
                            >
                              {suggestion}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </>
                  )}

                  {editType && getEditMealSuggestions().length === 0 && (
                    <Text style={editModalStyles.noSuggestionsText}>
                      No meals found in {editType}
                    </Text>
                  )}

                  {!editType && (
                    <Text style={editModalStyles.noSuggestionsText}>
                      Select a meal type to see available meals
                    </Text>
                  )}

                  {editMealName && (
                    <>
                      <Text style={editModalStyles.label}>NEW PRICE:</Text>
                      <TextInput
                        style={editModalStyles.input}
                        value={editNewPrice}
                        onChangeText={(text) => {
                          const numericValue = text.replace(/\D/g, '');
                          setEditNewPrice(numericValue ? `R${numericValue}` : '');
                        }}
                        keyboardType="numeric"
                        placeholder="R0.00"
                      />
                    </>
                  )}

                  <View style={editModalStyles.buttonRow}>
                    <TouchableOpacity
                      style={editModalStyles.cancelButton}
                      onPress={resetEditModal}
                    >
                      <Text style={editModalStyles.buttonText}>CANCEL</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        editModalStyles.confirmButton,
                        (!editMealName || !editType || !editNewPrice) && editModalStyles.confirmButtonDisabled,
                      ]}
                      onPress={confirmEdit}
                      disabled={!editMealName || !editType || !editNewPrice}
                    >
                      <Text style={editModalStyles.buttonText}>SAVE CHANGES</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Delete Modal */}
        <Modal
          visible={deleteModalVisible}
          transparent
          animationType="slide"
          onRequestClose={resetDeleteModal}
        >
          <TouchableWithoutFeedback onPress={resetDeleteModal}>
            <View style={deleteModalStyles.overlay}>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={deleteModalStyles.modalContainer}>
              <Text style={deleteModalStyles.modalTitle}>Delete Meal</Text>

              <Text style={deleteModalStyles.label}>SELECT MEAL TYPE:</Text>
              <View style={deleteModalStyles.typeButtonsContainer}>
                {validMealTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      deleteModalStyles.typeButton,
                      deleteType === type && deleteModalStyles.typeButtonActive,
                    ]}
                    onPress={() => {
                      setDeleteType(type);
                      setDeleteMealName(''); // Reset meal name when type changes
                    }}
                  >
                    <Text
                      style={[
                        deleteModalStyles.typeButtonText,
                        deleteType === type && deleteModalStyles.typeButtonTextActive,
                      ]}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Show suggestions when type is selected */}
              {deleteType && mealSuggestions.length > 0 && (
                <>
                  <Text style={deleteModalStyles.label}>SELECT MEAL:</Text>
                  <ScrollView style={deleteModalStyles.suggestionsContainer}>
                    {mealSuggestions.map((suggestion) => (
                      <TouchableOpacity
                        key={suggestion}
                        style={[
                          deleteModalStyles.suggestionItem,
                          deleteMealName === suggestion && deleteModalStyles.suggestionItemActive,
                        ]}
                        onPress={() => setDeleteMealName(suggestion)}
                      >
                        <Text
                          style={[
                            deleteModalStyles.suggestionText,
                            deleteMealName === suggestion && deleteModalStyles.suggestionTextActive,
                          ]}
                        >
                          {suggestion}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </>
              )}

              {deleteType && mealSuggestions.length === 0 && (
                <Text style={deleteModalStyles.noSuggestionsText}>
                  No meals found in {deleteType}
                </Text>
              )}

              {!deleteType && (
                <Text style={deleteModalStyles.noSuggestionsText}>
                  Select a meal type to see available meals
                </Text>
              )}

              <View style={deleteModalStyles.buttonRow}>
                <TouchableOpacity
                  style={deleteModalStyles.cancelButton}
                  onPress={resetDeleteModal}
                >
                  <Text style={deleteModalStyles.buttonText}>CANCEL</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    deleteModalStyles.confirmButton,
                    (!deleteMealName || !deleteType) && deleteModalStyles.confirmButtonDisabled,
                  ]}
                  onPress={confirmDelete}
                  disabled={!deleteMealName || !deleteType}
                >
                  <Text style={deleteModalStyles.buttonText}>DELETE</Text>
                </TouchableOpacity>
              </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const deleteModalStyles = {
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  } as const,
  modalContainer: {
    backgroundColor: '#b9b6b8ff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  } as const,
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  } as const,
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 10,
  } as const,
  typeButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    flexWrap: 'wrap',
    gap: 8,
  } as const,
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    flex: 1,
    minWidth: 80,
    alignItems: 'center',
  } as const,
  typeButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  } as const,
  typeButtonText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#333',
  } as const,
  typeButtonTextActive: {
    color: '#fff',
  } as const,
  suggestionsContainer: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    paddingVertical: 8,
  } as const,
  suggestionItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  } as const,
  suggestionItemActive: {
    backgroundColor: '#e3f2fd',
  } as const,
  suggestionText: {
    fontSize: 14,
    color: '#333',
  } as const,
  suggestionTextActive: {
    fontWeight: '700',
    color: '#007AFF',
  } as const,
  noSuggestionsText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginVertical: 20,
  } as const,
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    gap: 10,
  } as const,
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
  } as const,
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    alignItems: 'center',
  } as const,
  confirmButtonDisabled: {
    backgroundColor: '#bdc3c7',
    opacity: 0.6,
  } as const,
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  } as const,  
};

const editModalStyles = {
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  } as const,
  modalContainer: {
    backgroundColor: '#b9b6b8ff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  } as const,
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  } as const,
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  } as const,
  typeButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    flexWrap: 'wrap',
    gap: 8,
  } as const,
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    flex: 1,
    minWidth: 80,
    alignItems: 'center',
  } as const,
  typeButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  } as const,
  typeButtonText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#333',
  } as const,
  typeButtonTextActive: {
    color: '#fff',
  } as const,
  suggestionsContainer: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    paddingVertical: 8,
  } as const,
  suggestionItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  } as const,
  suggestionItemActive: {
    backgroundColor: '#e3f2fd',
  } as const,
  suggestionText: {
    fontSize: 14,
    color: '#333',
  } as const,
  suggestionTextActive: {
    fontWeight: '700',
    color: '#007AFF',
  } as const,
  noSuggestionsText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginVertical: 20,
  } as const,
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginBottom: 12,
    textcolor: '#000',
  } as const,
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    gap: 10,
  } as const,
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
  } as const,
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
  } as const,
  confirmButtonDisabled: {
    backgroundColor: '#bdc3c7',
    opacity: 0.6,
  } as const,
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  } as const,
};
