import { Box,Image,Stack,Heading,Avatar,Text,Center,useColorModeValue,Table,Link,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption } from "@chakra-ui/react"
    import {ETH_PRECISION} from "./../contracts/conf"     

function weiToEthFloat(wei)
{
    let weiTemp=wei.div(10 ** (18-ETH_PRECISION));
    let num = weiTemp.toNumber();
    num=num/(10 ** ETH_PRECISION);
    return num;
}    

const Appraisal = ({data}) => {
    var bHasNFTData=((data.nft_data!==undefined) && data.nft_data.response=="OK");


    return (
        <Center py={6}>
            <Box
                maxW={'645px'}
                w={'full'}
                bg={useColorModeValue('white', 'gray.900')}
                boxShadow={'2xl'}
                rounded={'md'}
                p={6}
                overflow={'hidden'}>
                <Box
                    h={'210px'}
                    bg={'gray.100'}
                    mt={-6}
                    mx={-6}
                    mb={6}
                    overflow={'hidden'}
                    pos={'relative'}>
                        
                    <Image
                        h={'210px'}
                        src={
                            bHasNFTData?data.nft_data.nft.file_url:''
                        }
                        
                        layout={'responsive'}
                        
                    />
                </Box>
                <Stack>
                    <Text
                        color={'blue.500'}
                        textTransform={'uppercase'}
                        fontWeight={600}
                        fontSize={'sm'}
                        letterSpacing={1.1}>
                        {bHasNFTData?data.nft_data.nft.metadata.name:'Unknown'}
                    </Text>
                    <Table size="sm" >
                        <Tbody>
                            <Tr>
                                <Td>
                                <Text
                                    color={'gray.700'}
                                    textTransform={'uppercase'}
                                    fontWeight={600}
                                    fontSize={'sm'}
                                    letterSpacing={1.1}>
                                    Contract Address:
                                </Text>
                                </Td>
                                <Td>
                                <Text
                                    color={'gray.500'}
                                    textTransform={'uppercase'}
                                    fontWeight={600}
                                    fontSize={'sm'}
                                    letterSpacing={1.1}>
                                    {data.nft_contract}
                                </Text>
                                </Td>
                            </Tr>
                            <Tr>
                                <Td>
                                <Text
                                    color={'gray.700'}
                                    textTransform={'uppercase'}
                                    fontWeight={600}
                                    fontSize={'sm'}
                                    letterSpacing={1.1}>
                                    NFT ID:
                                </Text>
                                </Td>
                                <Td>
                                <Text
                                    color={'gray.500'}
                                    textTransform={'uppercase'}
                                    fontWeight={600}
                                    fontSize={'sm'}
                                    letterSpacing={1.1}>
                                    {data.nft_id.toString()}
                                </Text>
                                </Td>
                            </Tr>

                            <Tr>
                                <Td>
                                <Text
                                    color={'gray.700'}
                                    textTransform={'uppercase'}
                                    fontWeight={600}
                                    fontSize={'sm'}
                                    letterSpacing={1.1}>
                                    Appraisal Status:
                                </Text>
                                </Td>
                                <Td>
                                <Text
                                    color={'gray.500'}
                                    textTransform={'uppercase'}
                                    fontWeight={600}
                                    fontSize={'sm'}
                                    letterSpacing={1.1}>
                                    {data.status==0?'Open for Voting':data.status==1?'Resolved':'failed'}
                                </Text>
                                </Td>
                            </Tr>

                            <Tr>
                                <Td>
                                <Text
                                    color={'gray.700'}
                                    textTransform={'uppercase'}
                                    fontWeight={600}
                                    fontSize={'sm'}
                                    letterSpacing={1.1}>
                                    Minimum Voters to Resolve:
                                </Text>
                                </Td>
                                <Td>
                                <Text
                                    color={'gray.500'}
                                    textTransform={'uppercase'}
                                    fontWeight={600}
                                    fontSize={'sm'}
                                    letterSpacing={1.1}>
                                    {data.minVoters}
                                </Text>
                                </Td>
                            </Tr>

                            <Tr>
                                <Td>
                                <Text
                                    color={'gray.700'}
                                    textTransform={'uppercase'}
                                    fontWeight={600}
                                    fontSize={'sm'}
                                    letterSpacing={1.1}>
                                    Minimum Score to Vote:
                                </Text>
                                </Td>
                                <Td>
                                <Text
                                    color={'gray.500'}
                                    textTransform={'uppercase'}
                                    fontWeight={600}
                                    fontSize={'sm'}
                                    letterSpacing={1.1}>
                                    {data.minExpertiseLevel.toString()}
                                </Text>
                                </Td>
                            </Tr>

                            <Tr>
                                <Td>
                                <Text
                                    color={'gray.700'}
                                    textTransform={'uppercase'}
                                    fontWeight={600}
                                    fontSize={'sm'}
                                    letterSpacing={1.1}>
                                    Payout (Eth):
                                </Text>
                                </Td>
                                <Td>
                                <Text
                                    color={'gray.500'}
                                    textTransform={'uppercase'}
                                    fontWeight={600}
                                    fontSize={'sm'}
                                    letterSpacing={1.1}>
                                    {weiToEthFloat(data.paymentEth)}
                                </Text>
                                </Td>
                            </Tr>

                            <Tr>
                                <Td>
                                <Text
                                    color={'gray.700'}
                                    textTransform={'uppercase'}
                                    fontWeight={600}
                                    fontSize={'sm'}
                                    letterSpacing={1.1}>
                                    Submitted On:
                                </Text>
                                </Td>
                                <Td>
                                <Text
                                    color={'gray.500'}
                                    textTransform={'uppercase'}
                                    fontWeight={600}
                                    fontSize={'sm'}
                                    letterSpacing={1.1}>
                                    {new Date(data.request_time.toNumber() * 1000 ).toLocaleDateString("en-US")}
                                </Text>
                                </Td>
                            </Tr>

                            <Tr>
                                <Td>
                                <Text
                                    color={'gray.700'}
                                    textTransform={'uppercase'}
                                    fontWeight={600}
                                    fontSize={'sm'}
                                    letterSpacing={1.1}>
                                    Project URL:
                                </Text>
                                </Td>
                                <Td>
                                <Text
                                    color={'blue.500'}
                                    textTransform={'uppercase'}
                                    fontWeight={600}
                                    fontSize={'sm'}
                                    letterSpacing={1.1}>
                                    {bHasNFTData? <Link href={data.nft_data.nft.metadata.external_url}>{data.nft_data.nft.metadata.external_url}</Link>:'Unknown'}
                                </Text>
                                </Td>
                            </Tr>

                            {
                                data.nftMarketplace!==""?
                                <Tr>
                                <Td>
                                <Text
                                    color={'gray.700'}
                                    textTransform={'uppercase'}
                                    fontWeight={600}
                                    fontSize={'sm'}
                                    letterSpacing={1.1}>
                                    Marketplace URL:
                                </Text>
                                </Td>
                                <Td>
                                <Text
                                    color={'blue.500'}
                                    textTransform={'uppercase'}
                                    fontWeight={600}
                                    fontSize={'sm'}
                                    letterSpacing={1.1}>
                                    <Link href={data.nftMarketplace}>{data.nftMarketplace}</Link>
                                </Text>
                                </Td>
                            </Tr>
                                :''
                            }


                        </Tbody>
                    </Table>
                    
                </Stack>
                
            </Box>
        </Center>
    )
}

export default Appraisal
