'use client'

import { Suspense, useState } from 'react'
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
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react'
import { FiCheckCircle, FiXCircle, FiSmartphone, FiLock } from 'react-icons/fi'

const API_BASE_URL = 'https://8pb22tdpkb.us-east-1.awsapprunner.com'

type ResetState = 'form' | 'loading' | 'success' | 'error'

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [state, setState] = useState<ResetState>(token ? 'form' : 'error')
  const [errorMessage, setErrorMessage] = useState<string>(
    token ? '' : 'No reset token provided'
  )
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formError, setFormError] = useState('')

  const resetPassword = async () => {
    setFormError('')

    // Validation
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters')
      return
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match')
      return
    }

    setState('loading')

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword: password }),
      })

      const data = await response.json()

      if (data.success) {
        setState('success')
      } else {
        setState('error')
        setErrorMessage(data.error || 'Failed to reset password')
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
      {state === 'form' && (
        <>
          <Box
            bg="gray.100"
            borderRadius="full"
            p={4}
            _dark={{ bg: 'gray.700' }}
          >
            <Icon as={FiLock} boxSize={12} color="gray.600" _dark={{ color: 'gray.300' }} />
          </Box>
          <Heading as="h1" size="lg">
            Reset Your Password
          </Heading>
          <Text color="gray.600" _dark={{ color: 'gray.400' }}>
            Enter your new password below.
          </Text>

          <VStack spacing={4} w="full" maxW="sm">
            <FormControl isInvalid={!!formError && password.length < 8}>
              <FormLabel>New Password</FormLabel>
              <Input
                type="password"
                placeholder="Min 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="lg"
              />
            </FormControl>

            <FormControl isInvalid={!!formError && password !== confirmPassword}>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                size="lg"
              />
            </FormControl>

            {formError && (
              <Text color="red.500" fontSize="sm">
                {formError}
              </Text>
            )}

            <Button
              size="lg"
              colorScheme="blackAlpha"
              bg="black"
              color="white"
              w="full"
              onClick={resetPassword}
              mt={2}
              _hover={{ bg: 'gray.800' }}
            >
              Reset Password
            </Button>
          </VStack>
        </>
      )}

      {state === 'loading' && (
        <>
          <Spinner size="xl" color="gray.500" thickness="3px" />
          <Heading as="h1" size="lg">
            Resetting password...
          </Heading>
          <Text color="gray.500">
            Please wait while we reset your password.
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
            Password Reset!
          </Heading>
          <Text color="gray.600" _dark={{ color: 'gray.400' }}>
            Your password has been successfully reset. You can now sign in with your new password.
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
            Reset Failed
          </Heading>
          <Text color="gray.600" _dark={{ color: 'gray.400' }}>
            {errorMessage}
          </Text>
          <VStack spacing={2} mt={4}>
            <Text fontSize="sm" color="gray.500">
              The link may have expired or already been used.
            </Text>
            <Text fontSize="sm" color="gray.500">
              Please request a new password reset from the app.
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

export default function ResetPasswordPage() {
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
        <ResetPasswordContent />
      </Suspense>
    </Container>
  )
}
