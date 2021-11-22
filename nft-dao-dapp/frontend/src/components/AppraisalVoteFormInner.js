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

    import { Formik,Form,Field } from 'formik';    

const AppraisalVoteFormInner = ({onSubmitFunc}) => {


    function validateAppraisal(value) {
        let error
        if (!value) {
        error = "Must specify a value"
        } else { 
            let x=parseInt(value); 
            if (isNaN(x) || x<=0) {
                error = "Must be a number greater than 0"
            }
        }
        return error
    }

    return (
        <Formik
            initialValues={{ appraisalUSD: ""}}
            onSubmit={(values, actions) => {
                setTimeout(() => {
                    //alert(JSON.stringify(values, null, 2))
                    onSubmitFunc(values)
                    actions.setSubmitting(false)
                }, 1000)
                }}
        >
        {(props) => (
                        <Box>
                        <Text>Voting Form</Text>
                        <Form>
                            <Stack spacing={4}>
                            <Field name="appraisalUSD" validate={validateAppraisal}>
                                {({ field, form }) => (
                                <FormControl isRequired isInvalid={form.errors.appraisalUSD && form.touched.appraisalUSD}>
                                    <FormLabel htmlFor="appraisalUSD">Your Appraisal for this NFT (in USD)</FormLabel>
                                    <Input {...field} id="appraisalUSD" placeholder="appraisalUSD" />
                                    <FormErrorMessage>{form.errors.appraisalUSD}</FormErrorMessage>
                                </FormControl>
                                )}
                            </Field>

                            <Button type="submit"
                                isLoading={props.isSubmitting}
                                bg={'blue.400'}
                                color={'white'}
                                _hover={{
                                bg: 'blue.500',
                                }}>
                                Submit
                            </Button>

                            </Stack>    
                        </Form>
                        </Box>
        )}                                
        </Formik>
    )
}

export default AppraisalVoteFormInner
