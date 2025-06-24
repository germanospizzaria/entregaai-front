import type React from "react";
import { SendOutlined } from "@ant-design/icons";

interface CreateRunButtonProps {
  selectedOrders: number[];
  selectedDeliveryPerson: number | undefined;
  onCreateRun: () => void;
  loading: boolean;
}

export const CreateRunButton: React.FC<CreateRunButtonProps> = ({
  selectedOrders,
  selectedDeliveryPerson,
  onCreateRun,
  loading,
}) => {
  const isDisabled = selectedOrders.length === 0 || !selectedDeliveryPerson;

  return (
    <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-4 sm:p-6 mt-4">
      <button
        onClick={onCreateRun}
        disabled={isDisabled || loading}
        className={`w-full h-10 sm:h-12 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
          isDisabled
            ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
            : "bg-italian-green hover:bg-italian-green/90 text-white shadow-soft hover:shadow-medium active:scale-95"
        }`}
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <SendOutlined className="text-sm" />
        )}
        <span className="truncate">
          {loading ? "Criando..." : "Criar Corrida"}
          {selectedOrders.length > 0 && !loading && (
            <span className="ml-1 opacity-90 hidden sm:inline">
              ({selectedOrders.length} pedidos)
            </span>
          )}
        </span>
      </button>

      {isDisabled && !loading && (
        <p className="text-neutral-500 text-xs text-center mt-2">
          Selecione pelo menos um pedido e um entregador
        </p>
      )}
    </div>
  );
};
