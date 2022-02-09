import React, { useState } from "react";
import { chakra, Box, Image, Flex, useColorModeValue, Center, Button,
  AlertDialog, AlertDialogBody, AlertDialogFooter,
  AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, useToast
} from "@chakra-ui/react";
import nft_manager_abi from "abi/nft_manager_abi.json";
import { useAuth } from "contexts/AuthContext";
import { ethers } from "ethers";

const NFTCard = (props) => {

  const NFT_manager_contract_address = "0x0528E41841b8BEdD4293463FAa061DdFCC5E41bd";
  const [ isLoading, setIsLoading ] = useState(false);

  const toast = useToast()

  const { currentAccount } = useAuth()

  const { src, number, unboxed } = props;
  const bg = useColorModeValue("white", "gray.900")
  const buttonbg = useColorModeValue("gray.900", "white")

  const [isOpen, setIsOpen] = React.useState(false)
  const onClose = () => setIsOpen(false)
  const cancelRef = React.useRef()

  const unboxNFT = async() => {
    setIsLoading(true);
    if(!currentAccount) return;
    try {
      const { ethereum } = window; //injected by metamask
      //connect to an ethereum node
      const provider = new ethers.providers.Web3Provider(ethereum); 
      //gets the account
      const signer = provider.getSigner(); 
      //connects with the contract
      const NFTManagerConnectedContract = new ethers.Contract(NFT_manager_contract_address, nft_manager_abi, signer);
      const _type = await NFTManagerConnectedContract.boxStatus(number);
      if(_type===2) {
        toast({
          title: 'In Progress',
          description: "Refresh page after a few minutes",
          status: 'warning',
          duration: 2000,
          isClosable: true,
        })
      } else {
        await NFTManagerConnectedContract.unbox(number);
        toast({
          title: 'Transaction Succesful',
          description: "Unboxing in progress",
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
        setTimeout(()=>{
          setIsLoading(false);
          window.location.reload();
        }, 3000)
      }
    } catch(err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
  <Flex
    bg={useColorModeValue("#F9FAFB", "gray.600")}
    p={50}
    w="full"
    alignItems="center"
    justifyContent="center"
  >
    <Box
      maxW="xs"
      mx="auto"
      bg={useColorModeValue("white", "gray.800")}
      shadow="lg"
      rounded="lg"
    >
      <Box px={4} py={2}>
        <chakra.h1
          color={useColorModeValue("gray.800", "white")}
          fontWeight="bold"
          fontSize="3xl"
          textTransform="uppercase"
        >
          ID #{number}
        </chakra.h1>
        <chakra.p
          mt={1}
          fontSize="sm"
          color={useColorModeValue("gray.600", "gray.400")}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi quos
          quidem sequi illum facere recusandae voluptatibus
        </chakra.p>
      </Box>

      <Image
        h={48}
        w="full"
        fit="cover"
        mt={2}
        src={src}
        alt="TITLE"
        roundedBottom={unboxed ? "lg" : ""}
      />
      {unboxed ? 
      <></>
      :
      <Center my={2} bg={bg} roundedBottom="lg"
      >
        <Button size="md"  py={1} bg={buttonbg} color={bg}
          fontWeight="bold" rounded="lg" textTransform="uppercase"
          _hover={{
            bg: "gray.500",
          }}
          _focus={{
            bg: "gray.600",
          }}
          onClick={() => setIsOpen(true)}
        >
          Unbox
        </Button>
      </Center>
      }
    </Box>
    <AlertDialog
      isCentered={true}
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            Reveal Mystery Box
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure? You can't undo this action afterwards.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button isLoading={isLoading} ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button isLoading={isLoading} onClick={unboxNFT} colorScheme='blue' ml={3}>
              Unbox
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  </Flex>

    
  );
};

export default NFTCard;