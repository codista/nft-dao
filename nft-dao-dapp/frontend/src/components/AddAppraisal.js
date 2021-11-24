import { Flex,
    Box,
    Center,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    Link,
    Button,
    Heading,
    Text,
    FormErrorMessage,
    useColorModeValue } from "@chakra-ui/react"
    import {useState} from "react";

    import { Formik,Form,Field } from 'formik';
    
    const AddAppraisal = ({AddAppraisalFunc}) => {



        const  onSubmit = (values) => {
            AddAppraisalFunc(values);
        }
        function validateContract(value) {
            let error
            if (!value) {
            error = "Contract address is required"
            } else if (!/^0x[A-Fa-f0-9]+$/i.test(value)) {
            error = "This needs to be a valid ethereum address"
            }
            return error
        }

        function validateID(value) {
            let error
            if (!value) {
            error = "NFT ID is required"
            } else if (!/^[0-9]+$/i.test(value)) {
            error = "NFT ID must be a number"
            }
            return error
        }

        function validateMarketplace(value) {
            let error
            
            if (value!=="" && !/^((https?):\/\/)?(www.)?[a-z0-9-]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#-]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/i.test(value)) {
            error = "Only a valid URL"
            }
            return error
        }

        function validateMinVoters(value) {
            let error
            if (!value) {
            error = "Minimum Voters is Required"
            } else { 
                let x=parseInt(value); 
                if (isNaN(x) || x<1 || x>200) {
                    error = "Must be a number between 1 and 200"
                }
            }
            return error
        }

        function validateExpertLevel(value) {
            let error
            if (!value) {
            error = "Minimum Expert Score is Required"
            } else { 
                let x=parseInt(value); 
                if (isNaN(x) || x<0 || x>10000) {
                    error = "Must be a number between 1 and 10000"
                }
            }
            return error
        }

        function validatePayout(value) {
            let error
            if (!value) {
            error = "Must specify payment"
            } else { 
                let x=Number(value); 
                if (isNaN(x) || x<0.001 || x>100) {
                    error = "Must be a number, minimum payment is 0.001 Eth, maximum is 100"
                }
            }
            return error
        }
        

        
        //bg={useColorModeValue('gray.50', 'gray.800')}
        //bg={useColorModeValue('white', 'gray.700')}
        return (
            
            <Flex
            
                p={5}
                pb={20}
                w="full"
                alignItems="center"
                justifyContent="center"
            >
                <Formik
                    initialValues={{ nftContract: "", NFTId: "",NFTMarketplace: "",minVoters: "",minExpertLevel:"",payout:"0.001"}}
                    onSubmit={(values, actions) => {
                    setTimeout(() => {
                        //alert(JSON.stringify(values, null, 2))
                        onSubmit(values)
                        actions.setSubmitting(false)
                    }, 1000)
                    }}
                >
                    {(props) => (
                        <Form >
                            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={2} px={6}>
                                <Stack align={'center'}>
                                <Text fontSize={'2xl'}>Submit a New NFT Appraisal Request</Text>
                                </Stack>
                            </Stack>   
                            <Box
                            rounded={'lg'}
                            bg={'gray.50'}
                            boxShadow={'lg'}
                            p={8}
                            mx={{ lg: 8 }}
                            > 
                                <Box
                                mx={{ lg: 8 }}
                                display={{ lg: "flex" }}
                                maxW={{ lg: "8xl" }}  
                                >
                                    <Box w={{ lg: "50%" }} p={10}>
                                        <Stack spacing={4}>

                                            <Field name="nftContract" validate={validateContract}>
                                                {({ field, form }) => (
                                                <FormControl isRequired isInvalid={form.errors.nftContract && form.touched.nftContract}>
                                                    <FormLabel htmlFor="nftContract">NFT Contract Address</FormLabel>
                                                    <Input {...field} id="nftContract" placeholder="nftContract" />
                                                    <FormErrorMessage>{form.errors.nftContract}</FormErrorMessage>
                                                </FormControl>
                                                )}
                                            </Field>

                                            <Field name="NFTId"  validate={validateID}>
                                                {({ field, form }) => (
                                                <FormControl isRequired isInvalid={form.errors.NFTId && form.touched.NFTId}>
                                                    <FormLabel htmlFor="NFTId">NFT ID</FormLabel>
                                                    <Input {...field} id="NFTId" placeholder="NFTId" />
                                                    <FormErrorMessage>{form.errors.NFTId}</FormErrorMessage>
                                                </FormControl>
                                                )}
                                            </Field>

                                            <Field name="NFTMarketplace" validate={validateMarketplace}>
                                                {({ field, form }) => (
                                                <FormControl isInvalid={form.errors.NFTMarketplace && form.touched.NFTMarketplace}>
                                                    <FormLabel htmlFor="NFTMarketplace">NFT Marketplace Link</FormLabel>
                                                    <Input {...field} id="NFTMarketplace" placeholder="NFTMarketplace" />
                                                    <FormErrorMessage>{form.errors.NFTMarketplace}</FormErrorMessage>
                                                </FormControl>
                                                )}
                                            </Field>
                                        </Stack>
                                    </Box>



                                    <Box w={{ lg: "50%" }} p={10}>
                                        <Stack spacing={4}>            
                                            <Field name="minVoters"  validate={validateMinVoters}>
                                                {({ field, form }) => (
                                                <FormControl isRequired isInvalid={form.errors.minVoters && form.touched.minVoters}>
                                                    <FormLabel htmlFor="minVoters">Minimum Required Voters</FormLabel>
                                                    <Input {...field} id="minVoters" placeholder="minVoters" />
                                                    <FormErrorMessage>{form.errors.minVoters}</FormErrorMessage>
                                                </FormControl>
                                                )}
                                            </Field>

                                            <Field name="minExpertLevel"  validate={validateExpertLevel}>
                                                {({ field, form }) => (
                                                <FormControl isRequired isInvalid={form.errors.minExpertLevel && form.touched.minExpertLevel}>
                                                    <FormLabel htmlFor="minExpertLevel">Minimum Expert Score to Vote</FormLabel>
                                                    <Input {...field} id="minExpertLevel" placeholder="minExpertLevel" />
                                                    <FormErrorMessage>{form.errors.minExpertLevel}</FormErrorMessage>
                                                </FormControl>
                                                )}
                                            </Field>

                                            <Field name="payout"  validate={validatePayout}>
                                                {({ field, form }) => (
                                                <FormControl isRequired isInvalid={form.errors.payout && form.touched.payout}>
                                                    <FormLabel htmlFor="payout">Payment in Eth</FormLabel>
                                                    <Input {...field} id="payout" placeholder="payout" />
                                                    <FormErrorMessage>{form.errors.payout}</FormErrorMessage>
                                                </FormControl>
                                                )}
                                            </Field>
                                        </Stack>
                                    </Box>
                                    
                                    
                                </Box>  
                                <Box w={{ lg: "100%" }}
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    
                                                
                                                    <Button type="submit"
                                                        isLoading={props.isSubmitting}
                                                        bg={'blue.400'}
                                                        color={'white'}
                                                        _hover={{
                                                        bg: 'blue.500',
                                                        }}>
                                                        Submit
                                                    </Button>
                                    
                                </Box>  
                            </Box>
                        </Form>
                    )}
                
                </Formik>
            </Flex>
            
        )
    }
    
    export default AddAppraisal
    