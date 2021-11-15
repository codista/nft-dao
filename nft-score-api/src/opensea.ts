import * as Web3 from 'web3'
import { OpenSeaPort, Network } from 'opensea-js'
import { Asset,OrderSide,Order, OpenSeaFungibleToken } from "opensea-js/lib/types"
import BigNumber from 'bignumber.js';
import * as OpenseaAPI from "./opensea_api";
var jp = require('jsonpath');
const DEC_PRECISION = 4;

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

  let data = await OpenseaAPI.openseaApiGet("events",{account_address: expertAddress});
  if (data===false)
  { return false;}
  return calcExpertScoreFromEvents(data);
  
}

function calcExpertScoreFromEvents(data: Object): number
{
  let sales = jp.query(data,'$.asset_events[?(@.event_type=="successful")]');
  let canceledAuctions = jp.query(data,'$.asset_events[?(@.event_type=="cancelled")]');
  let bids = jp.query(data,'$.asset_events[?(@.event_type=="bid_entered")]');
  let bidWithrawls = jp.query(data,'$.asset_events[?(@.event_type=="bid_withdrawn")]');
  let transfers = jp.query(data,'$.asset_events[?(@.event_type=="transfer")]');
  let offers = jp.query(data,'$.asset_events[?(@.event_type=="offer_entered")]');
  let approvals = jp.query(data,'$.asset_events[?(@.event_type=="approve")]');

  console.log(` sales: ${sales.length} canceledAuctions: ${canceledAuctions.length} bids: ${bids.length} bidWithrawls: ${bidWithrawls.length} transfers: ${transfers.length} offers: ${offers.length} approvals: ${approvals.length} `);

  //console.log(`1: ${sigmoid(1)}, 0: ${sigmoid(0)}, 10: ${sigmoid(10)}, 100: ${sigmoid(100)}, 20: ${sigmoid(20)}, 5: ${sigmoid(5)}, `);
  //console.log(` sales: ${JSON.stringify(sales)} `);
  let score = Math.round(sigmoid(5*sales.length+bids.length+transfers.length+offers.length+approvals.length)*10000);

  //score should never be zero to enable default solidity score (0) to represent uninitiated score
  if (score==0) {score=1}
  console.log(`score: ${score}`);

  return score;
}

const k = 20;
function sigmoid(z: number) {
  return ((1 / (1 + Math.exp(-z/k)))-0.5)*2;
}