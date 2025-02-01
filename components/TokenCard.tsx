import { CalendarDays, ClockIcon, DollarSign } from "lucide-react";
import { Card, CardHeader, CardContent } from "./ui/card";

interface TokenData {
  token_name: string;
  token_symbol: string;
  token_logo: string;
  token_decimals: string;
  contract_address: string;
  price_usd: string;
  price_24h_percent_change: string;
  price_7d_percent_change: string;
  gainer: boolean;
}

const truncatePrice = (price: string) => {
  const formattedPrice = parseFloat(price).toFixed(2);
  return formattedPrice;
};

const TokenCard = ({ tokenData }: { tokenData: TokenData }) => {
  return (
    <Card className="w-full max-w-[340px] flex items-center justify-between w-full rounded-xl space-y-2">
      <CardHeader className="flex flex-col items-center space-y-2">
        <img
          src={tokenData.token_logo}
          alt={tokenData.token_name}
          className="w-6 h-6 rounded-full"
        />
        <h1 className="text-[13px] font-semibold">{tokenData.token_name}</h1>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col space-y-4 w-full">
          <div className="flex justify-between items-center gap-4 text-[12px]">
            <DollarSign size={12} />
            <span className="font-bold text-[12px]">
              ${truncatePrice(tokenData.price_usd)}
            </span>
          </div>
          <div className="flex justify-between items-center gap-4 text-[12px]">
            <ClockIcon size={12} />
            <span className="font-bold text-[12px] ">
              {truncatePrice(tokenData.price_24h_percent_change)}%
            </span>
          </div>
          <div className="flex justify-between items-center gap-4 text-[12px]">
            <CalendarDays size={12} />
            <span className="font-bold text-[12px]">
              {truncatePrice(tokenData.price_7d_percent_change)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenCard;
