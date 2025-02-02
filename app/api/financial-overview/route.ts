import { ChatOpenAI } from "@langchain/openai";
import { NextRequest, NextResponse } from "next/server";
import { moralisFetcher } from "@/utils/moralis/moralisFetcher";


export async function POST(req: NextRequest, res: NextResponse) {
    const { userAddress } = await req.json();
    if (!userAddress) {
        return NextResponse.json(
            { error: "userId is required" },
            { status: 400 },
          );
    }
    const llm = new ChatOpenAI({
        model: "gpt-4o-mini",
    }).bind({
        response_format: {
          type: "json_object",
        },
    });;

    const baseData = await moralisFetcher("https://deep-index.moralis.io/api/v2.2/wallets/"+userAddress+"/defi/summary?chain=base");
    if (baseData.error) {
        return NextResponse.json(
            { error: "Failed to get response from model" },
            { status: 500 },
        );
    }

    const someData = await moralisFetcher("https://deep-index.moralis.io/api/v2.2/wallets/"+userAddress+"/chains");
    if (someData.error) {
        return NextResponse.json(
            { error: "Failed to get response from model" },
            { status: 500 },
        );
    }
    console.log(someData);

    const defiJSON = {
        "DeFi_Protocols": {
          "Lending_Borrowing": [
            { "name": "Compound", "symbol": "COMP", "description": "Algorithmic money market protocol" },
            { "name": "MakerDAO", "symbol": "DAI", "description": "Collateralized debt positions (CDPs) and stablecoin issuance" },
            { "name": "Venus", "symbol": "XVS", "description": "Binance Smart Chain-based lending" }
          ],
          "Decentralized_Exchanges": [
            { "name": "Uniswap", "symbol": "UNI", "description": "Automated market maker (AMM) DEX" },
            { "name": "SushiSwap", "symbol": "SUSHI", "description": "Fork of Uniswap with added incentives" },
            { "name": "Curve Finance", "symbol": "CRV", "description": "Optimized for stablecoin swaps" },
            { "name": "PancakeSwap", "symbol": "CAKE", "description": "AMM DEX on Binance Smart Chain" }
          ],
          "Yield_Aggregators": [
            { "name": "Yearn Finance", "symbol": "YFI", "description": "Auto-optimizes DeFi yield farming" },
            { "name": "Beefy Finance", "symbol": "BIFI", "description": "Multi-chain yield optimizer" },
            { "name": "Autofarm", "symbol": "AUTO", "description": "Cross-chain yield optimizer" },
            { "name": "Convex Finance", "symbol": "CVX", "description": "Enhances Curve yield farming" }
          ],
          "Derivatives_Synthetics": [
            { "name": "Synthetix", "symbol": "SNX", "description": "Creates synthetic assets for crypto, stocks, and forex" },
            { "name": "dYdX", "symbol": "DYDX", "description": "Decentralized perpetual futures trading" },
            { "name": "Mirror Protocol", "symbol": "MIR", "description": "Tokenized synthetic stock assets" }
          ],
          "Stablecoins_Liquidity": [
            { "name": "Frax Finance", "symbol": "FRAX", "description": "Algorithmic stablecoin" },
            { "name": "Liquity", "symbol": "LUSD", "description": "Interest-free borrowing with ETH collateral" },
            { "name": "Balancer", "symbol": "BAL", "description": "Liquidity pools with custom weightings" },
            { "name": "Bancor", "symbol": "BNT", "description": "Impermanent loss protection for liquidity providers" }
          ],
          "Insurance": [
            { "name": "Nexus Mutual", "symbol": "NXM", "description": "Smart contract insurance" },
            { "name": "Cover Protocol", "symbol": "COVER", "description": "DeFi insurance for hacks and failures" }
          ]
        },
        "DeFi_Strategies": {
          "Yield_Farming": [
            { "strategy": "Liquidity Mining", "description": "Providing liquidity to AMM pools to earn LP tokens" },
            { "strategy": "Auto-Compounding", "description": "Using yield aggregators like Yearn or Beefy Finance" },
            { "strategy": "Stablecoin Farming", "description": "Earning yield with stablecoin pairs to minimize volatility" }
          ],
          "Lending_Borrowing": [
            { "strategy": "Looping", "description": "Borrowing against deposited assets and reinvesting" },
            { "strategy": "Leveraged Farming", "description": "Using borrowed funds to maximize farm yields" },
            { "strategy": "CDP Strategy", "description": "Minting stablecoins like DAI against ETH" }
          ],
          "Liquidity_Providing": [
            { "strategy": "Impermanent Loss Hedging", "description": "Using hedging techniques to reduce losses" },
            { "strategy": "Single-Sided Staking", "description": "Providing liquidity without exposure to another asset" },
            { "strategy": "Concentrated Liquidity", "description": "Adjusting liquidity ranges on Uniswap V3" }
          ],
          "Arbitrage_Trading": [
            { "strategy": "DEX Arbitrage", "description": "Exploiting price differences across Uniswap, SushiSwap, etc." },
            { "strategy": "Flash Loan Arbitrage", "description": "Using flash loans to capitalize on price inefficiencies" },
            { "strategy": "Perpetual Funding Rate Arbitrage", "description": "Capturing funding rate differences between exchanges" }
          ],
          "Passive_Earning_Staking": [
            { "strategy": "Liquid Staking", "description": "Staking ETH while maintaining liquidity (e.g., Lido, Rocket Pool)" },
            { "strategy": "Auto-Staking", "description": "High APY compounding protocols (e.g., OlympusDAO, Wonderland)" }
          ]
        }
      }
      


    const SYSTEM_PROMPT = `
        You are an AI crypto portfolio analyst. Based on the provided JSON data, generate a **detailed financial overview** from a crypto investment perspective.
        `+
            JSON.stringify(defiJSON)
        +`
        ### Your response must follow this structured JSON output format:
        \`\`\`json
        {
          "overall_portfolio_description": "", //paragraph describing the user's portfolio
          "defi-stategy-recommendations": [ // give different defi protocols and stuff to try out educate the user in this about the protocol
            {
                "title": "<string>",
                "short_description": "<string>", // a short description of the protocol
                "learn_more": "<string>", //bigger more clearer description of the protocol
            }
          ],
          "defi-protocol-recommendations": [ // give different defi protocols and stuff to try out educate the user in this about the protocol
            {
                "title": "<string>",
                "short_description": "<string>", // a short description of the protocol
                "learn_more": "<string>", //bigger more clearer description of the protocol
            }  
          ]
        }
        \`\`\`

        Analyze the given data and return an output following the specified JSON format. Be very educative during the process.
    `;

    try {
        const modelResponse = await llm.invoke([
            {"role": "system", "content": SYSTEM_PROMPT}, 
            {"role": "user", "content": "moralis data: " + JSON.stringify(baseData, someData)}
        ]);
        return NextResponse.json(JSON.parse(modelResponse.content),{
            status: 200,
        });
    } catch (error) {
      return NextResponse.json(
          { error: "Failed to get response from model" + error },
          { status: 500 },
      );
    }
  }
  