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
        beaconOne(beaconUUID: $beaconUuid) {
            hCenter {
                id
                isHospital
                mapUrl
                personCounter
            }
            uuid
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