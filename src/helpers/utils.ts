import { ethers } from 'ethers';
import { getAddress, bigNumberify, BigNumber as ethersBN } from 'ethers/utils';
import BigNumber from '@/helpers/bignumber';
import config from '@/helpers/config';

export const MAX_GAS = bigNumberify('0xffffffff');
export const MAX_UINT = bigNumberify(ethers.constants.MaxUint256);
export const POOL_TOKENS_DECIMALS = 18;

export const unknownColors = [
  '#6f6776',
  '#9a9a97',
  '#c5ccb8',
  '#c38890',
  '#a593a5',
  '#666092',
  '#9a4f50',
  '#c28d75'
];

export function shorten(str = '') {
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

export function bnum(val: string | number | ethersBN | BigNumber): BigNumber {
  return new BigNumber(val.toString());
}

export function scale(input: BigNumber, decimalPlaces: number): BigNumber {
  const scalePow = new BigNumber(decimalPlaces.toString());
  const scaleMul = new BigNumber(10).pow(scalePow);
  return input.times(scaleMul);
}

export function toWei(val: string | ethersBN | BigNumber): BigNumber {
  return scale(bnum(val.toString()), 18).integerValue();
}

export function denormalizeBalance(
  amount: BigNumber,
  tokenAddress: string
): BigNumber {
  const token = config.tokens[tokenAddress];
  return scale(bnum(amount), token.decimals);
}

export function formatPool(pool) {
  let colorIndex = 0;
  pool.tokens = pool.tokens.map(token => {
    token.checksum = getAddress(token.address);
    token.weightPercent = (100 / pool.totalWeight) * token.denormWeight;
    const configToken = config.tokens[token.checksum];
    if (configToken) {
      token.chartColor = configToken.chartColor;
    } else {
      token.chartColor = unknownColors[colorIndex];
      colorIndex++;
    }
    return token;
  });
  pool.holders = pool.shares.length;
  pool.tokensList = pool.tokensList.map(token => getAddress(token));
  pool.lastSwapVolume = 0;
  if (pool.swaps && pool.swaps[0] && pool.swaps[0].poolTotalSwapVolume) {
    pool.lastSwapVolume =
      parseFloat(pool.totalSwapVolume) -
      parseFloat(pool.swaps[0].poolTotalSwapVolume);
  }
  return pool;
}

export async function getMarketChartFromCoinGecko(address) {
  const ratePerDay = {};
  const uri = `https://api.coingecko.com/api/v3/coins/ethereum/contract/${address}/market_chart?vs_currency=usd&days=60`;
  try {
    const marketChart = await fetch(uri).then(res => res.json());
    marketChart.prices.forEach(p => {
      const date = new Date();
      date.setTime(p[0]);
      const day = date.toISOString();
      ratePerDay[day] = p[1];
    });
    return ratePerDay;
  } catch (e) {
    return Promise.reject();
  }
}

export function isValidAddress(str) {
  try {
    getAddress(str);
  } catch (e) {
    return false;
  }
  return true;
}

export function delay(ms) {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
}

export function clone(item) {
  return JSON.parse(JSON.stringify(item));
}

export function trunc(value: number, decimals = 0) {
  const mutiplier = 10 ** decimals;
  return Math.trunc(value * mutiplier) / mutiplier;
}

export function calcPoolTokensByRatio(ratio, totalShares) {
  const buffer = bnum(100);
  return bnum(ratio)
    .times(toWei(totalShares))
    .integerValue(BigNumber.ROUND_DOWN)
    .minus(buffer)
    .toString();
}
