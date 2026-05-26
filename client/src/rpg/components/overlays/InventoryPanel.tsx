import { useRPGStore } from "../../stores/rpgStore";

interface InventoryPanelProps {
  onClose: () => void;
}

export function InventoryPanel({ onClose }: InventoryPanelProps) {
  const items = useRPGStore((s) => s.items);
  const beyblades = useRPGStore((s) => s.beyblades);
  const equippedBeybladeId = useRPGStore((s) => s.equippedBeybladeId);
  const money = useRPGStore((s) => s.money);
  const equipBeyblade = useRPGStore((s) => s.equipBeyblade);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-amber-400 font-bold text-lg">Inventory</h3>
        <div className="text-amber-300 text-sm">💰 {money} coins</div>
      </div>

      {/* Beyblades */}
      <div className="mb-4">
        <h4 className="text-gray-400 text-xs uppercase tracking-wider mb-2">Beyblades</h4>
        {beyblades.length === 0 ? (
          <p className="text-gray-500 text-sm">No beyblades yet</p>
        ) : (
          <div className="space-y-1">
            {beyblades.map((id) => (
              <div
                key={id}
                className={`flex items-center justify-between px-3 py-2 rounded text-sm ${
                  id === equippedBeybladeId
                    ? "bg-amber-500/20 border border-amber-400 text-amber-300"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <span>{id}</span>
                {id === equippedBeybladeId ? (
                  <span className="text-xs text-amber-400">EQUIPPED</span>
                ) : (
                  <button
                    onClick={() => equipBeyblade(id)}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    Equip
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto">
        <h4 className="text-gray-400 text-xs uppercase tracking-wider mb-2">Items</h4>
        {items.length === 0 ? (
          <p className="text-gray-500 text-sm">No items yet</p>
        ) : (
          <div className="space-y-1">
            {items.map((item) => (
              <div
                key={item.itemId}
                className="flex items-center justify-between px-3 py-2 rounded bg-gray-800 text-sm text-gray-300"
              >
                <span>{item.itemId}</span>
                <span className="text-gray-500">×{item.quantity}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
