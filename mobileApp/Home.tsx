import { Button, MD3Colors, ProgressBar, Text } from "react-native-paper";
import * as SecureStore from  'expo-secure-store';
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { ADD_VISITOR, APPOINTMENT_DATA, BEACON_DATA, CALL_EMERGENCY, GET_PARTNER, GET_QUEUE_NUMBER, REGISTER_TOKEN } from "./Queries";
import { DeviceEventEmitter, View } from "react-native";
// @ts-ignore
import beacons from "@hkpuits/react-native-beacons-manager";
import { useEffect, useState } from "react";
import * as Linking from "expo-linking";

const MY_SECURE_AUTH_STATE_KEY = 'MySecureAuthStateKey';
const MY_USERNAME_STATE_KEY = 'MyUsernameStateKey';

export default function Home({ navigation }){

    const [registerPushToken, { data, loading, error }] = useMutation(REGISTER_TOKEN)
    const [username, setUsername] = useState("")
    const [scanActive, setActive] = useState(true)
    const [checkAmbulance, setCheckAmbulance] = useState(false)
    const [addOneVisitor, { data: dataA, loading: loadingA, error: errorA }] = useMutation(ADD_VISITOR)
    const [renderingPage, setRender] = useState("")
    const [partnerData, setPartnerData] = useState(null)
    const [numberQueue, setNumberQueue] = useState(0)
    const [beaconUUIDHook, setBeaconUUIDHook] = useState("be8825a7-3556-4b5d-beba-1d34f78d0171")

    const [getBeaconData, { loading: loadingBeaconData, error: errorBeaconData, data: dataBeaconData }] = useLazyQuery(BEACON_DATA)
    const [getAppointmentData, { loading: loadingAppointmentData, error: errorAppointmentData, data: dataAppointmentData }] = useLazyQuery(APPOINTMENT_DATA)
    const [getPartnerData, { loading: loadingPartnerData, error: errorPartnerData, data: dataPartnerData }] = useLazyQuery(GET_PARTNER)
    const [getEmergencyData, { loading: loadingEmergencyData, error: errorEmergencyData, data: dataEmergencyData }] = useLazyQuery(CALL_EMERGENCY)
    const [getUpdateQueue, { data: dataQueueData, loading: loadingQueueData, error: errorQueueData }] = useLazyQuery(GET_QUEUE_NUMBER)

    useEffect(() => {

      async function startBeaconScan () {
        // Tells the library to detect iBeacons
        

        

        // Start detecting all iBeacons in the nearby
        try {
          beacons.init()
          beacons.detectIBeacons()

          

          const test = await beacons.startRangingBeaconsInRegion("")
          console.log(`Beacons ranging started succesfully!`)
        } catch (err) {
          console.log(`Beacons ranging not started, error: ${error}`)
        }

        // Print a log of the detected iBeacons (1 per second)
        DeviceEventEmitter.addListener('beaconsDidRange', (dataB) => {
          if (scanActive) {
            console.log('Found beacons!', dataB.beacons)
            if (dataB.beacons.length > 0) {
              // BEACON FOUND
              beacons.stopRangingBeaconsInRegion("")
              setActive(false)
              const beaconUUID = dataB.beacons[0].uuid
              setBeaconUUIDHook(beaconUUID)
            }
      }})
    }
      startBeaconScan()
    }, [])

    async function logout(){
        await SecureStore.deleteItemAsync(MY_SECURE_AUTH_STATE_KEY)
        await registerPushToken({ variables: { registerTokenInput: {
            username: await SecureStore.getItemAsync(MY_USERNAME_STATE_KEY),
            expoPushToken: null,
          }}})
          beacons.stopRangingBeaconsInRegion("")
        navigation.navigate('Loginpage')
    }

    function getMap() {
      Linking.openURL(partnerData)
    }

    function updateQueueNumber(appointmentData) {
      getUpdateQueue({
        onCompleted: (data) => {
          setNumberQueue(data.numberOfVisitorInQueue)
          return data.numberOfVisitorInQueue
        },
        variables: {
          numberOfVisitorInQueueId: appointmentData.medAppointment.id
        }
      })
      return 0
    }

    function analyze() {
      const result = getBeaconData({
        onCompleted: async (data) => {
          const beaconData = data
          console.log(data)
      if (beaconData !== null){
        // BEACON IS FROM OUR SYSTEM
        console.log("TEST" + beaconData)
        if (beaconData.beaconOne.hCenter !== null) {
          // HEALTH CENTER BEACON
          setCheckAmbulance(false)
          await addOneVisitor({ variables: { healthCenter: beaconData.beaconOne.uuid } })
          console.log("ESTA EN UN CENTRO DE SALUD")
          
          getAppointmentData({
            onCompleted: async (data) => {
              const appointmentData = data
              console.log(appointmentData)
          if (appointmentData.medAppointment === null){
            // USER WITHOUT APPOINTMENT
            console.log("VIENE SIN CITA")

            getPartnerData({
              onCompleted: (data) => {
                let okPartner = false
                console.log(data)
            const partnerData = data.user.partner
            for (const partner of partnerData) {
              if (partner.inHospital) {
                console.log("VIENE POR SU PARTNER")
                setPartnerData(partner.hospitalData)
                setRender("partner")
                okPartner = true
              }
            }
            if (!okPartner) {
              console.log("VIENE POR INFO")
              setPartnerData(beaconData.beaconOne.hCenter.mapUrl)
              setRender("info")
            }
              },
              variables: {
                username: await SecureStore.getItemAsync(MY_USERNAME_STATE_KEY)
              }
            })            
          }else{
            // USER WITH APPOINTMENT
            console.log("VIENE CON CITA")
            const number = updateQueueNumber(appointmentData)
            console.log(number)
            setPartnerData(appointmentData)
            setNumberQueue(number)
            setRender("queue")
          }
            },
            variables: {
              beaconUuid: beaconUUIDHook,
              username: await SecureStore.getItemAsync(MY_USERNAME_STATE_KEY)
            }
          })
        }else{
          // AMBULANCE BEACON
          if (checkAmbulance) {
            // EMERGENCY
            console.log("ENVIADA ALERTA")
            await getEmergencyData({
              variables: {
                username: username
              }
            })

          }else {
            // FIRST AMBULANCE DETECTION
            console.log("ESTA EN UNA AMBULANCIA")
            setTimeout(() => {
              setCheckAmbulance(true)
              setActive(true)
              console.log("REENTRADA")
            }, 8000)
          }
        }}
        },
        variables: {
          beaconUuid: beaconUUIDHook
        }
      })
    }

    return (
      <View>
        {renderingPage === "" && <><ProgressBar progress={0.5} color={MD3Colors.error50}>Hey</ProgressBar><Button onPress={async () => analyze()}>Analyze</Button></>}
        {renderingPage === "partner" && <Text>Datos referentes a su protegido: {partnerData}</Text>}
        {renderingPage === "info" && <Button onPress={() => getMap()}>Ver mapa</Button>}
        {renderingPage === "queue" && numberQueue !== 0 && <><Text>Su número actual en la cola es: {numberQueue}</Text><Button onPress={() => updateQueueNumber(partnerData)}>Refresh</Button></>}
        {renderingPage === "queue" && numberQueue === 0 && <><Text>Es su turno!! Puede acceder a la consulta correspondiente: {partnerData.medAppointment.place}</Text><Button onPress={() => updateQueueNumber(partnerData)}>Refresh</Button></>}
        <Button onPress={() => logout()}>Logout</Button>
      </View>

    )
}