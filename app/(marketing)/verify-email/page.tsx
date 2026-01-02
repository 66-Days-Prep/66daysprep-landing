'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Spinner,
  Button,
  Icon,
} from '@chakra-ui/react'
import { FiCheckCircle, FiXCircle, FiSmartphone } from 'react-icons/fi'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://8pb22tdpkb.us-east-1.awsapprunner.com'

type VerificationState = 'loading' | 'success' | 'error'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [state, setState] = useState<VerificationState>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    if (!token) {
      setState('error')
      setErrorMessage('No verification token provided')
      return
    }

    verifyEmail(token)
  }, [token])

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (data.success) {
        setState('success')
      } else {
        setState('error')
        setErrorMessage(data.error || 'Verification failed')
      }
    } catch (error) {
      setState('error')
      setErrorMessage('Unable to connect to server. Please try again.')
    }
  }

  const openApp = () => {
    // Try to open the app, fall back to App Store
    window.location.href = '66daysprep://'

    // If app doesn't open, redirect to App Store after delay
    setTimeout(() => {
      window.location.href = 'https://apps.apple.com/app/66-days-prep/id6504857066'
    }, 1500)
  }

  return (
    <VStack spacing={8} textAlign="center" py={12}>
      {state === 'loading' && (
        <>
          <Spinner size="xl" color="gray.500" thickness="3px" />
          <Heading as="h1" size="lg">
            Verifying your email...
          </Heading>
          <Text color="gray.500">
            Please wait while we verify your email address.
          </Text>
        </>
      )}

      {state === 'success' && (
        <>
          <Box
            bg="green.100"
            borderRadius="full"
            p={4}
            _dark={{ bg: 'green.900' }}
          >
            <Icon as={FiCheckCircle} boxSize={12} color="green.500" />
          </Box>
          <Heading as="h1" size="lg" color="green.500">
            Email Verified!
          </Heading>
          <Text color="gray.600" _dark={{ color: 'gray.400' }}>
            Your email has been successfully verified. You can now access all features in the app.
          </Text>
          <Button
            size="lg"
            colorScheme="blackAlpha"
            bg="black"
            color="white"
            leftIcon={<FiSmartphone />}
            onClick={openApp}
            mt={4}
            _hover={{ bg: 'gray.800' }}
          >
            Open App
          </Button>
          <Text fontSize="sm" color="gray.500">
            If the app doesn&apos;t open, you&apos;ll be redirected to the App Store.
          </Text>
        </>
      )}

      {state === 'error' && (
        <>
          <Box
            bg="red.100"
            borderRadius="full"
            p={4}
            _dark={{ bg: 'red.900' }}
          >
            <Icon as={FiXCircle} boxSize={12} color="red.500" />
          </Box>
          <Heading as="h1" size="lg" color="red.500">
            Verification Failed
          </Heading>
          <Text color="gray.600" _dark={{ color: 'gray.400' }}>
            {errorMessage}
          </Text>
          <VStack spacing={2} mt={4}>
            <Text fontSize="sm" color="gray.500">
              The link may have expired or already been used.
            </Text>
            <Text fontSize="sm" color="gray.500">
              Please request a new verification email from the app.
            </Text>
          </VStack>
          <Button
            size="lg"
            colorScheme="blackAlpha"
            bg="black"
            color="white"
            leftIcon={<FiSmartphone />}
            onClick={openApp}
            mt={4}
            _hover={{ bg: 'gray.800' }}
          >
            Open App
          </Button>
        </>
      )}
    </VStack>
  )
}

export default function VerifyEmailPage() {
  return (
    <Container maxW="container.sm" py={16} mt={10}>
      <Suspense
        fallback={
          <VStack spacing={8} textAlign="center" py={12}>
            <Spinner size="xl" color="gray.500" thickness="3px" />
            <Heading as="h1" size="lg">
              Loading...
            </Heading>
          </VStack>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </Container>
  )
}
