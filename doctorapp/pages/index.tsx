import { Inter } from '@next/font/google'
import { Box, Button, Group, PasswordInput, TextInput, Text, Title, Loader } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useState } from 'react'
import { useLazyQuery, useQuery } from '@apollo/client'
import { GET_VISITORS } from '@/queries'
import Appointments from './appointments'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [user, setUsername] = useState('')
  const [token, setToken] = useState('')
  const [realtimeCount, setCount] = useState(0)

  const [updateCounterQL, {data, error, loading}] = useLazyQuery(GET_VISITORS, {
    variables: {
      doctorUser: user
    },
  })
  
  const form = useForm({
    initialValues: {
      username: '',
      password: ''
    }
  })

  async function login(username: string, password: string) {
    const access_token = await fetch('http://192.168.1.145:3000/auth/loginDoctor', {
      method: 'POST', 
      body: JSON.stringify({username , password}),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    const dejson = await access_token.json()
    console.log(dejson.access_token)
    if (dejson.access_token !== undefined && dejson.access_token !== null) {
      setUsername(username)
      setToken(dejson.access_token)
      updateCounterQL({
        onCompleted: (data) => {
          setCount(data.getVisitors)
        }
      })
    }
  }

  async function logout() {
    setUsername('')
    setToken('')
    setCount(0)
  }

  if (loading) return <Loader size={'xl'}/>

  return (
    <main>
      <Box sx={{ maxWidth: 300 }} mx="auto">
      <Title>Doctor App</Title>
      {user === '' && 
        <form onSubmit={form.onSubmit((values) => login(values.username, values.password))}>
          <TextInput
            withAsterisk
            label="Username"
            placeholder="Your username"
            {...form.getInputProps('username')}
          />

          <PasswordInput
            placeholder="Password"
            label="Password"
            withAsterisk
            {...form.getInputProps('password')}
          />

          <Group position="right" mt="md">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      }
      {user !== '' && 
        <>
          <Text>Welcome: {user}</Text>
          <Button onClick={() => logout()}>Logout</Button>
          <Text>Realtime Capacity Counter: {realtimeCount}</Text>
          <Button onClick={() => {
            updateCounterQL({
              onCompleted: (data) => {
                setCount(data.getVisitors)
              }
            })
            
          }}>Update Counter</Button>
          <Appointments username={user}/>
        </>  
      }
      </Box>
    </main>
  )
}
