import {ethers} from 'ethers';
import 'dotenv/config';

export const provider = new ethers.JsonRpcProvider(process.env.RPC!);

export const transferAbi = [
    "event Transfer(address indexed src, address indexed dst, uint val)"
];

export async function getContractTransfers(address: string, from: number, to: number, abi: string[]){
    const contract = new ethers.Contract(address, abi, provider);
    const filter = contract.filters.Transfer();
    const data = await contract.queryFilter(filter, from, to);
    return data;
}
