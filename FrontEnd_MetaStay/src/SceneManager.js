//scenemanager.js
import React from "react";
import {
  View,
  Environment,
  asset,
  Text,
  VrButton,
  StyleSheet,
} from "react-360";
import {
  HotSpotScene,
  HotSpotInfo,
  HotSpotTitle,
  HotSpotVideo,
} from "./HotSpot";

const styles = StyleSheet.create({
  modelPanel: {
    position: "absolute",
    flex: 1,
    top: 950,
    left: 2150,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    width: 900,
    height: 650,
  },
  hotel: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  column: {
    flex: 1,
    justifyContent: "flex-start",
  },
  hotelButton: {
    margin: 10,
    padding: 10,
    backgroundColor: "#5dbea3",
    borderRadius: 15,
  },
  hotelButtonText: {
    fontSize: 20,
    color: "black",
  },
  keyboard: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 10,
  },
  hotelcontainer: {
    justifyContent: "center",
    width: '80%',
    height: '80%',
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 5,
  },
  button: {
    fontSize: 24,
    width: 40,
    height: 40,
    color: "black",
    backgroundColor: "lightgray",
    margin: 5,
    textAlign: "center",
    paddingTop: 15,
    borderRadius: 15,
  },
  submitButton: {
    fontSize: 24,
    width: 80,
    height: 40,
    color: "black",
    backgroundColor: "lightblue",
    margin: 5,
    textAlign: "center",
    paddingTop: 15,
  },
  backButton: {
    fontSize: 24,
    width: 80,
    height: 40,
    color: "black",
    backgroundColor: "lightblue",
    margin: 5,
    textAlign: "center",
    paddingTop: 15,
  },
  topic: {
    fontSize: 27,
    justifyContent: "center",
    alignItems: "center",
  }
});

export default class SceneManager extends React.Component {
  state = {
    name: "",
    email: "",
    checkIn: "",
    checkOut: "",
    activeField: "name",
    showKeyboard: false,
    uppercase: true,
    submittedValues: {},
    currentSceneId: this.props.firstSceneId,
    showModal: false,
    showProps: false,
    selectedOption: "None",
    hotelData: null,
  };

  componentDidMount() {
    this.updateScene({});
    fetch('http://localhost:5000/hotels')
      .then(response => response.json())
      .then(data => {
        // Filter the data to get the hotel you want (e.g., WH Hotel)
        console.log(data);
        const selectedHotel = data.find(hotel => hotel.name === 'WH Hotel');
        this.setState({ hotelData: data });
      })
      .catch(error => console.error('Error fetching data:', error));
  }

  componentDidUpdate(prevProps, prevState) {
    this.updateScene(prevState);
  }

  updateScene = (prevState) => {
    if (prevState.currentSceneId === this.state.currentSceneId) return;

    const currentScene = this.getCurrentScene();
    Environment.setBackgroundImage(asset(currentScene.panorama));
  };

  getCurrentScene = () => {
    return this.getSceneById(this.state.currentSceneId);
  };

  getSceneById = (sceneId) => {
    return this.props.scenes.find((scene) => scene.sceneId === sceneId);
  };

  handleHotSpotSceneClick = (sceneToGo) => {
    this.setState({ currentSceneId: sceneToGo.sceneId });
  };

  handleButtonClick = (input) => {
    const { activeField, uppercase } = this.state;
    const char = uppercase ? input : input.toLowerCase();
    this.setState((prevState) => ({
      [activeField]: prevState[activeField] + char,
    }));
  };

  toggleModal = () => {
    this.setState((prevState) => ({
      showModal: !prevState.showModal,
    }));
  };

  toggleProps = () => {
    this.setState((prevState) => ({
      showProps: !prevState.showProps,
    }));
  };

  handleBackspace = () => {
    const { activeField } = this.state;
    this.setState((prevState) => ({
      [activeField]: prevState[activeField].slice(0, -1),
    }));
  };

  handleSubmit = () => {
    const { name, email, checkIn, checkOut, selectedOption } = this.state;
    const [checkInDay, checkInMonth, checkInYear] = checkIn
      .split("/")
      .map(Number);
    const [checkOutDay, checkOutMonth, checkOutYear] = checkOut
      .split("/")
      .map(Number);
    const checkInDate = new Date(checkInYear, checkInMonth - 1, checkInDay);
    const checkOutDate = new Date(checkOutYear, checkOutMonth - 1, checkOutDay);
    const differenceInTime = checkOutDate.getTime() - checkInDate.getTime();
    const differenceInDays = Math.round(differenceInTime / (1000 * 3600 * 24));
    this.setState((prevState) => ({
      submittedValues: {
        name,
        email,
        checkIn,
        checkOut,
        selectedOption,
        numberOfDays: differenceInDays,
      },
      showKeyboard: false,
    }));
  };

  toggleKeyboard = () => {
    this.setState((prevState) => ({ showKeyboard: !prevState.showKeyboard }));
  };

  handleFieldChange = (field) => {
    this.setState({ activeField: field });
  };

  handleFieldSwitch = (field) => {
    this.setState({ activeField: field, [field]: "" });
  };

  toggleCase = () => {
    this.setState((prevState) => ({ uppercase: !prevState.uppercase }));
  };

  handleOptionChange = (option) => {
    this.setState({ selectedOption: option });
  };

  ModalInputs = () => {
    const {
      name,
      email,
      checkIn,
      checkOut,
      showKeyboard,
      submittedValues,
      activeField,
      uppercase,
    } = this.state;
    return (
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Input Fields */}
        <View style={{ marginBottom: 20 }}>
          <VrButton onClick={() => this.handleFieldSwitch("name")}>
            <Text
              style={activeField === "name" ? styles.activeField : styles.field}
            >
              Name :{activeField === "name" ? name + "|" : name}
            </Text>
          </VrButton>
          <VrButton onClick={() => this.handleFieldSwitch("email")}>
            <Text
              style={
                activeField === "email" ? styles.activeField : styles.field
              }
            >
              Email :{activeField === "email" ? email + "|" : email}
            </Text>
          </VrButton>
          <VrButton onClick={() => this.handleFieldSwitch("checkIn")}>
            <Text
              style={
                activeField === "checkIn" ? styles.activeField : styles.field
              }
            >
              Check-in: {activeField === "checkIn" ? checkIn + "|" : checkIn}
            </Text>
          </VrButton>
          <VrButton onClick={() => this.handleFieldSwitch("checkOut")}>
            <Text
              style={
                activeField === "checkOut" ? styles.activeField : styles.field
              }
            >
              Check-out:{" "}
              {activeField === "checkOut" ? checkOut + "|" : checkOut}
            </Text>
          </VrButton>
          <View style={{ flexDirection: "row" }}>
            <Text>Room Type:</Text>
            <VrButton
              onClick={() => this.handleOptionChange("Suite")}
              style={{
                marginLeft: 10,
                backgroundColor:
                  this.state.selectedOption === "Suite" ? "darkgray" : "gray",
              }}
            >
              <Text style={{ fontSize: 20, color: "black" }}>Suite</Text>
            </VrButton>
            <VrButton
              onClick={() => this.handleOptionChange("Deluxe")}
              style={{
                marginLeft: 10,
                backgroundColor:
                  this.state.selectedOption === "Deluxe" ? "darkgray" : "gray",
              }}
            >
              <Text style={{ fontSize: 20, color: "black" }}>Deluxe</Text>
            </VrButton>
          </View>
          <VrButton onClick={this.toggleKeyboard}>
            <Text style={styles.toggleKeyboard}>
              {showKeyboard ? "Hide Keyboard" : "Show Keyboard"}
            </Text>
          </VrButton>
        </View>

        {/* Virtual Keyboard */}
        {showKeyboard && (
          <View style={styles.keyboard}>
            <View style={styles.row}>
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "&"].map(
                (char, index) => (
                  <VrButton
                    key={index}
                    onClick={() => this.handleButtonClick(char)}
                  >
                    <Text style={styles.button}>{char}</Text>
                  </VrButton>
                )
              )}
            </View>
            <View style={styles.row}>
              {[
                "/",
                "Q",
                "W",
                "E",
                "R",
                "T",
                "Y",
                "U",
                "I",
                "O",
                "P",
                "<-",
              ].map((char, index) => (
                <VrButton
                  key={index}
                  onClick={() => {
                    if (char === "<-") {
                      this.handleBackspace();
                    } else {
                      this.handleButtonClick(char);
                    }
                  }}
                >
                  <Text style={styles.button}>{char}</Text>
                </VrButton>
              ))}
            </View>
            <View style={styles.row}>
              {["@", "A", "S", "D", "F", "G", "H", "J", "K", "L", "$"].map(
                (char, index) => (
                  <VrButton
                    key={index}
                    onClick={() => this.handleButtonClick(char)}
                  >
                    <Text style={styles.button}>{char}</Text>
                  </VrButton>
                )
              )}
            </View>
            <View style={styles.row}>
              {["Z", "X", "C", "V", "B", "N", "M", "-", " ", "."].map(
                (char, index) => (
                  <VrButton
                    key={index}
                    onClick={() => {
                      this.handleButtonClick(char);
                    }}
                  >
                    <Text style={styles.button}>{char}</Text>
                  </VrButton>
                )
              )}
            </View>
            <View style={styles.row}>
              <VrButton onClick={this.toggleCase}>
                <Text style={styles.button}>{uppercase ? "Lo" : "Up"}</Text>
              </VrButton>
              <VrButton onClick={this.handleSubmit}>
                <Text style={styles.submitButton}>Submit</Text>
              </VrButton>
            </View>
          </View>
        )}
        {/* Submitted Values */}
        {submittedValues.name && (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.submittedText}>Submitted Values:</Text>
            <Text style={styles.submittedField}>
              Name: {submittedValues.name}
            </Text>
            <Text style={styles.submittedField}>
              Email: {submittedValues.email}
            </Text>
            <Text style={styles.submittedField}>
              Check-in: {submittedValues.checkIn}
            </Text>
            <Text style={styles.submittedField}>
              Check-out: {submittedValues.checkOut}
            </Text>
            <Text style={styles.submittedField}>
              Room Type: {submittedValues.selectedOption}
            </Text>
            <Text style={styles.submittedField}>
              Number of Days: {submittedValues.numberOfDays}
            </Text>
            <Text style={styles.submittedField}>
              Total Amount:{" "}
              {submittedValues.selectedOption == "Suite"
                ? submittedValues.numberOfDays * 100
                : submittedValues.numberOfDays * 200}
            </Text>
          </View>
        )}
      </View>
    );
  };

  modalForm = () => {
    if (!this.state.showModal) {
      return null;
    }
    return (
      <View style={styles.modelPanel}>
        {this.ModalInputs()}
        <VrButton onClick={this.toggleModal} style={{ margin: 10 }}>
          <Text style={styles.submitButton}>Close</Text>
        </VrButton>
      </View>
    );
  };

  modalProps = () => {
    const { hotelData, selectedHotel } = this.state;
  
    if (!this.state.showProps) {
      return null;
    } else {
      if (!hotelData) {
        return <Text>Loading...</Text>; // Display loading message while data is being fetched
      }
  
      // Render hotel buttons or amenities based on selection
      return (
        <View style={styles.modelPanel}>
          {selectedHotel ? (
            // If a hotel is selected, display its amenities
            <View style={styles.hotelcontainer}>
              <Text>Amenities:</Text>
              <Text>{selectedHotel.amenities}</Text>
              <View style={{ flexDirection: "row" }}>
                <VrButton
                  onClick={() => this.setState({ selectedHotel: null })}
                  style={{ margin: 10 }}
                >
                  <Text style={styles.backButton}>Back</Text>
                </VrButton>
              </View>
            </View>
          ) : (
            // If no hotel is selected, render hotel buttons
            <View style={styles.hotelcontainer}>
              <Text style={styles.topic}>Select a hotel:</Text>
            
              <View style={styles.hotel}>
                <View style={styles.column}>
                  {hotelData.slice(0, Math.ceil(hotelData.length / 3)).map((hotel) => (
                    <VrButton
                      key={hotel.id}
                      onClick={() => this.setState({ selectedHotel: hotel })}
                      style={styles.hotelButton}
                    >
                      <Text style={styles.hotelButtonText}>{hotel.name}</Text>
                    </VrButton>
                  ))}
                </View>
                <View style={styles.column}>
                  {hotelData.slice(Math.ceil(hotelData.length / 3), Math.ceil((2 * hotelData.length) / 3)).map((hotel) => (
                    <VrButton
                      key={hotel.id}
                      onClick={() => this.setState({ selectedHotel: hotel })}
                      style={styles.hotelButton}
                    >
                      <Text style={styles.hotelButtonText}>{hotel.name}</Text>
                    </VrButton>
                  ))}
                </View>
                <View style={styles.column}>
                  {hotelData.slice(Math.ceil((2 * hotelData.length) / 3)).map((hotel) => (
                    <VrButton
                      key={hotel.id}
                      onClick={() => this.setState({ selectedHotel: hotel })}
                      style={styles.hotelButton}
                    >
                      <Text style={styles.hotelButtonText}>{hotel.name}</Text>
                    </VrButton>
                  ))}
                </View>
            </View>
            </View>
          )}
          <VrButton onClick={this.toggleProps}>
            <Text style={styles.submitButton}>Close</Text>
          </VrButton>
        </View>
      );
    }
  };

  
  
  

  renderHotSpots = (hotSpots = []) => {
    return hotSpots.map((hotSpot, i) => {
      switch (hotSpot.type) {
        case "scene": {
          const sceneToGo = this.getSceneById(hotSpot.sceneId);
          return (
            <HotSpotScene
              key={i.toString()}
              onClick={() => this.handleHotSpotSceneClick(sceneToGo)}
              text={hotSpot.text}
              left={hotSpot.left}
              top={hotSpot.top}
            />
          );
        }
        case "info": {
          return (
            <HotSpotInfo
              key={i.toString()}
              text={hotSpot.text}
              left={hotSpot.left}
              top={hotSpot.top}
            />
          );
        }
        case "title": {
          return (
            <HotSpotTitle
              key={i.toString()}
              text={hotSpot.text}
              left={hotSpot.left}
              top={hotSpot.top}
              toggleModal={this.toggleModal}
              toggleProps={this.toggleProps}
            />
          );
        }
        case "video": {
          return (
            <HotSpotVideo
              key={i.toString()}
              src={hotSpot.src}
              left={hotSpot.left}
              top={hotSpot.top}
              width={hotSpot.width}
              height={hotSpot.height}
              rotateY={hotSpot.rotateY}
            />
          );
        }
        default:
          return null;
      }
    });
  };

  render() {
    const currentScene = this.getCurrentScene();

    return (
      <View style={{ flex: 1 }}>
        {this.renderHotSpots(currentScene.hotSpots)}
        {this.modalForm()}
        {this.modalProps()}
      </View>
    );
  }
}
