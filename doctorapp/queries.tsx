import { gql } from '@apollo/client'

export const REGISTER_TOKEN = gql`
    mutation RegisterToken($registerTokenInput: RegisterTokenInput!) {
        registerToken(registerTokenInput: $registerTokenInput) {
            username
        }
    }
`;

export const BEACON_DATA = gql`
    query Query($beaconUuid: String!) {
        beacon(beaconUUID: $beaconUuid) {
            hCenter {
                id
                isHospital
                mapUrl
                personCounter
            }
        }
    }
`;

export const APPOINTMENT_DATA = gql`
    query Query($beaconUuid: String!, $username: String!) {
        medAppointment(beaconUUID: $beaconUuid, username: $username) {
            hour
            id
            minute
            place
            date
        }
    }
`;

export const CALL_EMERGENCY = gql`
    query Query($username: String!) {
        callEmergency(username: $username) {
            emergencyContacts {
                username
            }
        }
    }
`;

export const ADD_VISITOR = gql`
    mutation Mutation($healthCenter: String!) {
        addOneVisitor(healthCenter: $healthCenter) {
            personCounter
        }
    }
`;

export const GET_PARTNER = gql`
    query Query($username: String!) {
        user(username: $username) {
            partner {
                inHospital
                username
                hospitalData
            }
        }
    }   
`

export const GET_QUEUE_NUMBER = gql`
    query Query($numberOfVisitorInQueueId: Int!) {
        numberOfVisitorInQueue(id: $numberOfVisitorInQueueId)
}
`

export const GET_VISITORS = gql`
    query Query($doctorUser: String!) {
        getVisitors(doctorUser: $doctorUser)
    }
`

export const GET_DOCTOR_APPOINTMENTS = gql`
    query GetNotFinishedAppointment($username: String!) {
        getNotFinishedAppointment(username: $username) {
            pacient {
            username
            }
            minute
            place
            hour
            date
            userRegistered
            id
        }
    }
`

export const GET_APPOINTMENT_DATA = gql`
    query MedAppointmentOne($medAppointmentOneId: Int!) {
    medAppointmentOne(id: $medAppointmentOneId) {
        date
        hour
        minute
        pacient {
        username
        city
        }
        place
    }
}
`

export const FINISH_APPOINTMENT = gql`
    mutation Mutation($finishAppointmentId: Int!, $justificant: String!, $recipe: String!) {
        finishAppointment(id: $finishAppointmentId, justificant: $justificant, recipe: $recipe) {
            id
        }
    }
`