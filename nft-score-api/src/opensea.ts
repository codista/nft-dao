import * as Web3 from 'web3'
import { OpenSeaPort, Network } from 'opensea-js'
import { Asset,OrderSide,Order, OpenSeaFungibleToken } from "opensea-js/lib/types"
import BigNumber from 'bignumber.js';
import * as OpenseaAPI from "./opensea_api";
var jp = require('jsonpath');
import { maxHeaderSize } from 'http';
const DEC_PRECISION = 4;
const WEIGHT_SALES = 0.2;
const WEIGHT_BIDS = 0.6;
const WEIGHT_TRANSFERS = 0.1;
const WEIGHT_PERIOD = 0.05;
const WEIGHT_RECENCY = 0.05;

var jp = require('jsonpath');

async function getOpensea(): Promise<any> {
  const provider = new Web3.default.providers.HttpProvider('https://mainnet.infura.io');

  const seaport = new OpenSeaPort(provider, {
      networkName: Network.Main
    });
  return seaport;  
};

async function getAsset(contractAdr: string, tokenID: string): Promise<any> {
  const seaport = await getOpensea();
  const asset: Asset = await seaport.api.getAsset({
      tokenAddress: contractAdr, // string
      tokenId: tokenID, // string | number | null
    })
  
  return asset;
};


async function getOrders(contractAdr: string, tokenID: string, oside: OrderSide): Promise<any> {
  const seaport = await getOpensea();
  const { orders, count } = await seaport.api.getOrders({
    asset_contract_address: contractAdr,
    token_id: tokenID,
    side: oside,
  });
  return orders;
};

function defined(val: any) : boolean {
  return (val===undefined || val===null || typeof(val)==='undefined') ? false:true;
};

function getOrdersAverage(ordersArr: Order[]) {
  var priceTotal=0;
  var count=0;  
  ordersArr.forEach((item: Order)=> {
    if (defined(item.currentPrice)) {
      let decimalsDiff = (item.paymentTokenContract as OpenSeaFungibleToken).decimals - DEC_PRECISION;
      let priceTokenDollar =Number((item.paymentTokenContract as OpenSeaFungibleToken).usdPrice);
      let priceCurr = (item.currentPrice as BigNumber).div(Math.pow(10,decimalsDiff)).toNumber()/(Math.pow(10,DEC_PRECISION));
      let priceCurrDollar = priceCurr*priceTokenDollar;
      count=count+1;
      priceTotal=priceTotal+priceCurrDollar;
      //console.log(`decimal dif is ${decimalsDiff} priceTokenDollar is ${priceTokenDollar} priceCurr is ${priceCurr} priceCurrDollar is ${priceCurrDollar} decimal dif is ${decimalsDiff}`);
  }});
  let avg= (count>0)?priceTotal/count:0
  return avg;
}

export async function getNFTValue(contractAdr: string, tokenID: string): Promise<any> {
    let ordersSellJson = await getOrders(contractAdr, tokenID,OrderSide.Sell);
    let ordersBuyJson = await getOrders(contractAdr, tokenID,OrderSide.Buy);
    let avgSell = getOrdersAverage(ordersSellJson);
    let avgBuy = getOrdersAverage(ordersBuyJson);
    /*let ordersArray: Order[] = jp.query(ordersBuyJson,"$.*");
    var priceTotal = 0;
    ordersArray.forEach((item: any)=> {
          priceTotal=priceTotal+item.currentPrice.toNumber();
          console.log(item.paymentTokenContract.decimals);
    });*/
    console.log(`average buy price  is ${avgBuy} average sell price is ${avgSell}`);
    return avgBuy;
};

export async function getExpertScore(expertAddress: string): Promise<any> {

  let data=null;
  let mainnetScore=0;
  let rinkebyScore=0;
  let dataMainnet = await OpenseaAPI.openseaApiGet('mainnet',"events",{account_address: expertAddress});
  let dataRinkeby = await OpenseaAPI.openseaApiGet('rinkeby',"events",{account_address: expertAddress});
  if (dataMainnet===false && dataRinkeby===false) {
    return false;
  }

  if (dataMainnet!==false) {
    mainnetScore=calcExpertScoreFromEvents(dataMainnet);
  }
  if (dataRinkeby!==false) {
    rinkebyScore=calcExpertScoreFromEvents(dataRinkeby);
  }

  console.log(`mainnet score: ${mainnetScore}, rinkeby score: ${rinkebyScore}`);
  return Math.max(mainnetScore,rinkebyScore);
  
}

function calcExpertScoreFromEvents(data: Object): number
{
  
  let score = 0,periodScore=0, recencyScore=0;
  let sales = jp.query(data,'$.asset_events[?(@.event_type=="successful")]');
  let canceledAuctions = jp.query(data,'$.asset_events[?(@.event_type=="cancelled")]');
  let bids = jp.query(data,'$.asset_events[?(@.event_type=="bid_entered")]');
  let bidWithrawls = jp.query(data,'$.asset_events[?(@.event_type=="bid_withdrawn")]');
  let transfers = jp.query(data,'$.asset_events[?(@.event_type=="transfer")]');
  let offers = jp.query(data,'$.asset_events[?(@.event_type=="offer_entered")]');
  let approvals = jp.query(data,'$.asset_events[?(@.event_type=="approve")]');
   
  
  //take into consideration how long the address is active trading NFTs and how recent is the experience
   let transactionDates =  jp.query(data,'$.asset_events[*].transaction.timestamp');
   let minDate=2147483647000,maxDate=0;
   transactionDates.forEach((dateString: any)=>{
        let timestamp=Date.parse(dateString);
        if (!isNaN(timestamp)) {
          if (timestamp<minDate) {
            minDate=timestamp;
          }
          if (timestamp>maxDate) {
            maxDate=timestamp;
          }
        }
   });

   var mindateObj = new Date(minDate);
   var maxdateObj = new Date(maxDate);
   console.log(` sales: ${sales.length} canceledAuctions: ${canceledAuctions.length} bids: ${bids.length} bidWithrawls: ${bidWithrawls.length} transfers: ${transfers.length} offers: ${offers.length} approvals: ${approvals.length} min date: ${mindateObj} max date: ${maxdateObj}`);

  if (minDate!=2147483647000 && maxDate!=0)
   {
      let period = Math.round((maxDate-minDate)/(1000*60*60*24));
      let recency=Math.round((Date.now()-maxDate)/(1000*60*60*24));
    
      periodScore = Math.round(sigmoid(period,50)*10000);
      recencyScore = Math.round((1-sigmoid(recency,50))*10000);

   }
  
  

  //"normalize" each factor using a sigmoid function (since we don't know the range), and then calculate a weighted average of factors)
  let scoreSales = Math.round(sigmoid(sales.length,2)*10000);
  let scoreBids = Math.round(sigmoid(bids.length,6)*10000);
  let scoreTransfers = Math.round(sigmoid(transfers.length,5)*10000);
  
  score = Math.round(WEIGHT_SALES*scoreSales + WEIGHT_BIDS*scoreBids + WEIGHT_TRANSFERS*scoreTransfers + WEIGHT_PERIOD*periodScore + WEIGHT_RECENCY*recencyScore);
   
  //score should never be zero 
  //so we start with 1 (1000 on a scale of 1 to 10000 which is the precision on the contract); 
  console.log(`score: ${score}`);
  if (score<1000) {score=1000}
  console.log(`score: ${score}, scoreSales: ${scoreSales},scoreBids: ${scoreBids},scoreTransfers: ${scoreTransfers},periodScore: ${periodScore}, recencyScore: ${recencyScore}`);

  return score;
}

//variant of sigmoid that spreads the results between 0 and 1 (instead of 0.5 to 1)
//k expands the active range so that we don't get all ones from relatively low values
function sigmoid(z: number, k: number) {
  return ((1 / (1 + Math.exp(-z/k)))-0.5)*2;
}