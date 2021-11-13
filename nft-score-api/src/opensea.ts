import * as Web3 from 'web3'
import { OpenSeaPort, Network } from 'opensea-js'
import { Asset,OrderSide,Order, OpenSeaFungibleToken } from "opensea-js/lib/types"
import BigNumber from 'bignumber.js';
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