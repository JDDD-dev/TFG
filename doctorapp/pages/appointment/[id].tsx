import { FINISH_APPOINTMENT, GET_APPOINTMENT_DATA } from "@/queries"
import { useLazyQuery, useMutation } from "@apollo/client"
import { Button, FileInput, Loader, Text } from "@mantine/core"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function AppointmentData () {

    const router = useRouter()
    const { id } = router.query

    const [value, setValue] = useState<File | null>(null);
    const [valueJ, setValueJ] = useState<File | null>(null);
    
    const [pacient, setPacient] = useState("");

    const [finish, { loading: load, error: err, data: datam }] = useMutation(FINISH_APPOINTMENT)

    const uploadToServer = async (event: any) => {
        const body = new FormData();
        body.append("file", value);
        const response = await fetch("http://localhost:3000/upload", {
          method: "POST",
          body
        });

        const parsed = await response.json()

        const bodyJ = new FormData();
        bodyJ.append("file", valueJ);
        const responseJ = await fetch("http://localhost:3000/upload", {
          method: "POST",
          body: bodyJ
        });

        const parsedJ = await responseJ.json()

        await finish({ variables: { finishAppointmentId: Number.parseInt(id?.toString()), justificant: parsedJ, recipe: parsed }})
        await router.push('/')
      };

    const [getData, { loading, error, data }] = useLazyQuery(GET_APPOINTMENT_DATA)

    useEffect(() => {
      if(!loading && id !== undefined) {
        getData({
          variables: {
            medAppointmentOneId: Number.parseInt(id?.toString())
          },
          onCompleted: (data) => {
            setPacient(data.medAppointmentOne.pacient.username)
          }
        })
      }
    }, [loading, id])

    if (!router.isReady) return <Loader size={"xl"}/>

    //if (loading) return <Loader size={"xl"}/>

    return (
        <>
            <Text>Pacient username: {pacient}</Text>
            <FileInput withAsterisk label="Pacient Recipe" placeholder="Pick file" value={value} onChange={setValue} />
            <FileInput withAsterisk label="Pacient Justificant" placeholder="Pick file" value={valueJ} onChange={setValueJ} />
            <Button onClick={uploadToServer}>Finish</Button>
        </>
    )
}