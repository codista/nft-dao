import { Box,Image,Stack,Text,Center,useColorModeValue,Table,Link,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    chakra,
Flex } from "@chakra-ui/react"
import {ETH_PRECISION} from "./../contracts/NFTConts"     
import AppraisalVoteForm from "./AppraisalVoteForm"
import ShowVotes from "./ShowVotes"

function weiToEthFloat(wei)
{
    let weiTemp=wei.div(10 ** (18-ETH_PRECISION));
    let num = weiTemp.toNumber();
    num=num/(10 ** ETH_PRECISION);
    return num;
}    

const Appraisal = ({data,type,cont,prov}) => {
    var bHasNFTData=((data.nft_data!==undefined) && data.nft_data.response=="OK");


    return (
       <Flex
            
            p={5}
            w="full"
            alignItems="center"
            justifyContent="center"
            >
            <Box
                bg={useColorModeValue("white", "gray.800")}
                mx={{ lg: 8 }}
                display={{ lg: "flex" }}
                maxW={{ lg: "6xl" }}
                shadow={{ lg: "lg" }}
                rounded={{ lg: "lg" }}
            >
                <Box w={{ lg: "35%" }}>
                <Image
                        h={'410px'}
                        src={
                            bHasNFTData?data.nft_data.nft.cached_file_url:''
                        }
                        
                        layout={'responsive'}
                />

            
                </Box>

                <Box py={12} px={6} overflow="hidden" maxW={{ base: "xl", lg: "5xl" }} w={{ lg: "65%" }}>
                <Stack overflow="hidden">
                <Text
                    color={'blue.500'}
                    textTransform={'uppercase'}
                    fontWeight={600}
                    fontSize={'sm'}
                    letterSpacing={1.1}>
                    {bHasNFTData?data.nft_data.nft.metadata.name:'Unknown'}
                </Text>
                <Table size="sm"overflow="hidden" >
                    <Tbody>
                        <Tr>
                            <Td minW={200}>
                            <Text
                                color={'gray.700'}
                                
                                fontWeight={600}
                                fontSize={'sm'}
                                letterSpacing={1.1}>
                                Contract Address:
                            </Text>
                            </Td>
                            <Td>
                            <Text
                                color={'gray.500'}
                                
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
                                
                                fontWeight={600}
                                fontSize={'sm'}
                                letterSpacing={1.1}>
                                NFT ID:
                            </Text>
                            </Td>
                            <Td>
                            <Text
                                color={'gray.500'}
                                
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
                                
                                fontWeight={600}
                                fontSize={'sm'}
                                letterSpacing={1.1}>
                                Appraisal Status:
                            </Text>
                            </Td>
                            <Td>
                            <Text
                                color={'gray.500'}
                                
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
                                
                                fontWeight={600}
                                fontSize={'sm'}
                                letterSpacing={1.1}>
                                Minimum Voters to Resolve:
                            </Text>
                            </Td>
                            <Td>
                            <Text
                                color={'gray.500'}
                                
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
                                
                                fontWeight={600}
                                fontSize={'sm'}
                                letterSpacing={1.1}>
                                Minimum Score to Vote:
                            </Text>
                            </Td>
                            <Td>
                            <Text
                                color={'gray.500'}
                                
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
                                
                                fontWeight={600}
                                fontSize={'sm'}
                                letterSpacing={1.1}>
                                Payout (Eth):
                            </Text>
                            </Td>
                            <Td>
                            <Text
                                color={'gray.500'}
                                
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
                                
                                fontWeight={600}
                                fontSize={'sm'}
                                letterSpacing={1.1}>
                                Submitted On:
                            </Text>
                            </Td>
                            <Td>
                            <Text
                                color={'gray.500'}
                                
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
                                
                                fontWeight={600}
                                fontSize={'sm'}
                                letterSpacing={1.1}>
                                Project URL:
                            </Text>
                            </Td>
                            <Td>
                            <Text
                                color={'blue.500'}
                                
                                fontWeight={600}
                                fontSize={'sm'}
                                letterSpacing={1.1}>
                                {bHasNFTData? <Link href={data.nft_data.nft.metadata.external_url}>{data.nft_data.nft.metadata.external_url}</Link>:'Unknown'}
                            </Text>
                            </Td>
                        </Tr>

                        {
                            data.nftMarketplace!=="" &&
                            <Tr>
                            <Td>
                            <Text
                                color={'gray.700'}
                                
                                fontWeight={600}
                                fontSize={'sm'}
                                letterSpacing={1.1}>
                                Marketplace URL:
                            </Text>
                            </Td>
                            <Td>
                            <Text
                                color={'blue.500'}
                                
                                fontWeight={600}
                                fontSize={'sm'}
                                letterSpacing={1.1}>
                                <Link href={data.nftMarketplace}>{data.nftMarketplace}</Link>
                            </Text>
                            </Td>
                        </Tr> 
                        }

                        


                    </Tbody>
                </Table>
                {
                            type=='Voter' &&
                            <AppraisalVoteForm apprID={data.appraisal_id} cont={cont} prov={prov}/>
                } 
                {
                    type=='User' && (data.status==1) &&
                    
                            <ShowVotes apprID={data.appraisal_id} cont={cont} prov={prov}>sdf</ShowVotes>
                    
                }
            </Stack>
                </Box>
            </Box>
            </Flex>

    )
}

export default Appraisal
