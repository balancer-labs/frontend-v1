import { ethers } from 'ethers';
import abi from '@/helpers/abi';

let provider;

// @ts-ignore
if (
  typeof window.ethereum !== 'undefined' ||
  typeof window.web3 !== 'undefined'
) {
  const ethereum = window['ethereum'] || window['web3'];
  provider = new ethers.providers.Web3Provider(ethereum);
  provider.getContract = (type: string, address: string): ethers.Contract => {
    return new ethers.Contract(address, abi[type], provider);
  };
}

export default provider;
