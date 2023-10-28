import { GET_DOCTOR_APPOINTMENTS } from "@/queries";
import { useQuery } from "@apollo/client";
import { Card, Group, Text, Button, Loader } from "@mantine/core";
import Link from "next/link";
import { Key, ReactElement, JSXElementConstructor, ReactFragment, ReactPortal } from "react";

interface Props {
    username: String
}

export default function Appointments({ username }: Props) {
    const { loading, error, data } = useQuery(GET_DOCTOR_APPOINTMENTS, {
        variables: {
            username: username
        }
    })

    if (loading) return <Loader size="xl" />;

    const dataParse = data.getNotFinishedAppointment.map((appointment: { id: Key | null | undefined; pacient: { username: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; }; hour: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; minute: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined; userRegistered: any; }): any => 
        <Card key={appointment.id} shadow="sm" p="lg" radius="md" withBorder>
        <Card.Section>
            <Text>Username: {appointment.pacient.username}</Text>
        </Card.Section>

        <Group position="apart" mt="md" mb="xs">
            <Text weight={500}>{appointment.hour}:{appointment.minute}</Text>
            <Text weight={500}>Is registered?</Text>
            {appointment.userRegistered && <Text weight={500} color='green'>Yes</Text>}
            {!appointment.userRegistered && <Text weight={500} color='red'>No</Text>}
        </Group>

        {appointment.userRegistered && <Button variant="light" color="blue" fullWidth mt="md" radius="md" component={Link
        } href={`/appointment/` + appointment.id}>
            Start
        </Button>}
        {!appointment.userRegistered && <Button variant="light" color="blue" fullWidth mt="md" radius="md" disabled={true}>
            Start
        </Button>}
    </Card>
    
    )

    return (
        <>
            <div>
            {dataParse}
            </div>
        </>
    )
}