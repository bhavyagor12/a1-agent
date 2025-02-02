import { Clock, Calendar, Hash, Activity } from "lucide-react";

const OnChainJourneyCard = ({ journeyData }: { journeyData: any }) => {
  const chain = journeyData.active_chains[0]; // Assuming single chain data
  const { first_transaction, last_transaction } = chain;

  return (
    <Card className="w-full max-w-[360px] rounded-xl p-4 shadow-lg border border-gray-200">
      {/* Card Header */}
      <CardHeader className="flex items-center space-x-3">
        <img
          src="https://cryptologos.cc/logos/base-base-logo.png" // Base Chain Logo
          alt="Base Logo"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h2 className="text-[14px] font-semibold">On-Chain Journey</h2>
          <p className="text-gray-500 text-[12px]">
            Chain: {chain.chain.toUpperCase()}
          </p>
        </div>
      </CardHeader>

      {/* Card Content */}
      <CardContent className="mt-2">
        <div className="space-y-3 text-[12px]">
          {/* First Transaction */}
          <div className="flex items-center gap-3">
            <Calendar size={16} className="text-gray-500" />
            <div>
              <p className="text-gray-500">First Transaction</p>
              <p className="font-bold">
                {new Date(first_transaction.block_timestamp).toDateString()}
              </p>
            </div>
          </div>

          {/* Last Transaction */}
          <div className="flex items-center gap-3">
            <Clock size={16} className="text-gray-500" />
            <div>
              <p className="text-gray-500">Last Transaction</p>
              <p className="font-bold">
                {new Date(last_transaction.block_timestamp).toDateString()}
              </p>
            </div>
          </div>

          {/* First Transaction Hash */}
          <div className="flex items-center gap-3">
            <Hash size={16} className="text-gray-500" />
            <div>
              <p className="text-gray-500">First Txn</p>
              <a
                href={`https://basescan.org/tx/${first_transaction.transaction_hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-blue-500 truncate w-40 block"
              >
                {first_transaction.transaction_hash.slice(0, 6)}...
                {first_transaction.transaction_hash.slice(-6)}
              </a>
            </div>
          </div>

          {/* Last Transaction Hash */}
          <div className="flex items-center gap-3">
            <Activity size={16} className="text-gray-500" />
            <div>
              <p className="text-gray-500">Last Txn</p>
              <a
                href={`https://basescan.org/tx/${last_transaction.transaction_hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-blue-500 truncate w-40 block"
              >
                {last_transaction.transaction_hash.slice(0, 6)}...
                {last_transaction.transaction_hash.slice(-6)}
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OnChainJourneyCard;
