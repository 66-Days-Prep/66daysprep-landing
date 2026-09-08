'use client'

import {
  Box,
  HStack,
  Icon,
  Portal,
  Stack,
  Text,
  VStack,
  useMediaQuery,
} from '@chakra-ui/react'
import Image from 'next/image'
import { PiSealCheckFill } from 'react-icons/pi'

import { useEffect, useState } from 'react'

import { ButtonLink } from '#components/button-link'
import { ASSETS, INTERNAL_ROUTES } from '#constants'
import { AUDIENCE_COUNT } from '#data/marketing'
import { useScrollReveal } from '#hooks/use-scroll-reveal'

export function AppStoreBanner() {
  const visible = useScrollReveal()
  const [prefersReducedMotion] = useMediaQuery(
    '(prefers-reduced-motion: reduce)',
    { ssr: true, fallback: false },
  )
  const [isMobileViewport] = useMediaQuery('(max-width: 47.99em)', {
    ssr: true,
    fallback: true,
  })
  const [showTrustProof, setShowTrustProof] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion || !isMobileViewport) {
      setShowTrustProof(false)
      return
    }
    const intervalId = window.setInterval(() => {
      setShowTrustProof((current) => !current)
    }, 3500)
    return () => window.clearInterval(intervalId)
  }, [isMobileViewport, prefersReducedMotion])

  return (
    <Portal>
      <Box
        position="fixed"
        bottom="0"
        left="0"
        right="0"
        bg="rgba(0, 0, 0, 0.85)"
        backdropFilter="blur(10px)"
        py={{ base: '2.5', sm: '3' }}
        px={{ base: '3', sm: '4' }}
        display={{ base: 'flex', md: 'none' }}
        alignItems="center"
        justifyContent="space-between"
        gap="2"
        borderTop="1px solid rgba(255, 255, 255, 0.1)"
        zIndex="toast"
        boxShadow="0 -4px 10px rgba(0, 0, 0, 0.1)"
        transform={visible ? 'translateY(0)' : 'translateY(100%)'}
        transition={
          prefersReducedMotion ? 'none' : 'transform 0.3s ease-in-out'
        }
      >
        <Stack
          direction="row"
          spacing={{ base: '2', sm: '3' }}
          align="center"
          flex="1"
          minW="0"
        >
          <Box boxSize="clamp(36px, 10vw, 40px)" flexShrink={0}>
            <Image
              src={ASSETS.images.logo}
              width={40}
              height={40}
              alt="66 Days Prep app icon"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '8px',
              }}
            />
          </Box>
          <VStack align="flex-start" spacing="0" minW="0">
            <HStack spacing="2" align="center" minW="0">
              <Text
                color="white"
                fontWeight="bold"
                fontSize="clamp(12px, 3.5vw, 14px)"
                whiteSpace="nowrap"
              >
                66 Days Prep
              </Text>
              <Text
                color="primary.400"
                fontSize="clamp(10px, 3vw, 12px)"
                fontWeight="medium"
                whiteSpace="nowrap"
              >
                4.9 / 5 ★
              </Text>
            </HStack>
            <Box
              position="relative"
              h="18px"
              w="100%"
              minW="0"
              overflow="hidden"
            >
              <Text
                position="absolute"
                inset="0 auto auto 0"
                color="gray.300"
                fontSize="clamp(10px, 3vw, 12px)"
                lineHeight="18px"
                whiteSpace="nowrap"
                opacity={showTrustProof ? 0 : 1}
                transform={
                  showTrustProof ? 'translateY(-5px)' : 'translateY(0)'
                }
                transition={
                  prefersReducedMotion
                    ? 'none'
                    : 'opacity 180ms ease, transform 220ms ease'
                }
              >
                Download on the App Store
              </Text>
              <HStack
                position="absolute"
                inset="0 auto auto 0"
                spacing="1"
                h="18px"
                opacity={showTrustProof ? 1 : 0}
                transform={showTrustProof ? 'translateY(0)' : 'translateY(5px)'}
                transition={
                  prefersReducedMotion
                    ? 'none'
                    : 'opacity 180ms ease, transform 220ms ease'
                }
              >
                <Icon
                  as={PiSealCheckFill}
                  boxSize="clamp(13px, 3.5vw, 15px)"
                  color="cyan.400"
                  flexShrink={0}
                />
                <Text
                  color="gray.300"
                  fontSize="clamp(10px, 3vw, 12px)"
                  lineHeight="18px"
                  whiteSpace="nowrap"
                >
                  Trusted by {AUDIENCE_COUNT} users
                </Text>
              </HStack>
            </Box>
          </VStack>
        </Stack>

        <ButtonLink
          href={INTERNAL_ROUTES.downloadMobile}
          variant="primary"
          size="sm"
          px={{ base: '3', sm: '4' }}
          fontSize="clamp(14px, 3.8vw, 16px)"
          color="black"
          fontWeight="bold"
          flexShrink={0}
        >
          Get it now
        </ButtonLink>
      </Box>
    </Portal>
  )
}
