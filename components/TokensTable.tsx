import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Image } from "lucide-react";

interface Token {
  name: string;
  symbol: string;
  balance: string;
  decimals: number;
  usd_value: number | null;
}

export const TokensTable = ({ tokens }: { tokens: Token[] }) => {
  const formatTokenBalance = (balance: string, decimals: number) => {
    const balanceBigInt = BigInt(balance);
    const divisor = BigInt(Math.pow(10, decimals));
    const integerPart = balanceBigInt / divisor;
    const fractionalPart = balanceBigInt % divisor;
    const formattedFractionalPart = fractionalPart
      .toString()
      .padStart(decimals, "0")
      .slice(0, 2);

    const integerPartStr = integerPart.toString();

    if (integerPartStr.length > 10) {
      return `${integerPartStr.slice(0, 10)}...`;
    } else {
      return `${integerPartStr}.${formattedFractionalPart}`;
    }
  };

  if (tokens.length === 0) {
    return "No token data.";
  }

  return (
    <ScrollArea className="h-full w-full overflow-scroll">
      <Table className="table-auto text-xs">
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead>Token</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>USD Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="h-[30px] overflow-scroll">
          {tokens.map((token: any, index) => (
            <TableRow
              key={index}
              className={cn(index % 2 === 0 && "bg-muted/50")}
            >
              <TableCell className="flex items-center gap-2">
                {token.logo ? (
                  <img
                    src={token.logo}
                    alt={token.symbol}
                    className="w-5 h-5"
                  />
                ) : (
                  <Image className="w-5 h-5 text-gray-400" />
                )}
                {`${token.name} (${token.symbol})`}
              </TableCell>
              <TableCell>
                {formatTokenBalance(token.balance, token.decimals)}
              </TableCell>
              <TableCell>
                ≈$
                {token.usd_value !== null ? token.usd_value.toFixed(2) : "N/A"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};
