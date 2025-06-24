import type React from "react";
import { UserOutlined } from "@ant-design/icons";
import { StatusEntregador, type Driver } from "../../driver/types/driver";

interface DeliveryPersonSelectorProps {
  deliveryPersons: Driver[];
  selectedDeliveryPerson: number | undefined;
  onDeliveryPersonSelect: (deliveryPersonId: number) => void;
  loading: boolean;
}

export const DeliveryPersonSelector: React.FC<DeliveryPersonSelectorProps> = ({
  deliveryPersons,
  selectedDeliveryPerson,
  onDeliveryPersonSelect,
  loading,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-4 sm:p-6 mt-4">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-neutral-200 rounded-full animate-pulse" />
          <div className="h-4 sm:h-5 bg-neutral-200 rounded w-24 sm:w-32 animate-pulse" />
        </div>
        <div className="h-10 sm:h-12 bg-neutral-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-4 sm:p-6 mt-4">
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-italian-red/10 rounded-full flex items-center justify-center">
          <UserOutlined className="text-italian-red text-xs" />
        </div>
        <h3 className="font-medium text-neutral-800 text-sm sm:text-base">
          Entregador Disponível
        </h3>
      </div>

      <div className="space-y-2 max-h-[300px] sm:max-h-[400px] lg:max-h-[500px] overflow-y-auto">
        {deliveryPersons.length === 0 ? (
          <div className="text-center py-3 sm:py-4">
            <p className="text-neutral-500 text-sm">
              Nenhum entregador disponível
            </p>
          </div>
        ) : (
          deliveryPersons.map((person) => (
            <div
              key={person.id}
              className={`p-2 sm:p-3 rounded-lg border cursor-pointer transition-all ${
                selectedDeliveryPerson === person.id
                  ? "border-italian-red bg-italian-red/5"
                  : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
              }`}
              onClick={() => onDeliveryPersonSelect(person.id)}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div
                  className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 flex-shrink-0 ${
                    selectedDeliveryPerson === person.id
                      ? "border-italian-red bg-italian-red"
                      : "border-neutral-300"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-neutral-800 truncate">
                    {person.nome}
                  </div>
                  <div className="text-neutral-500 text-sm truncate">
                    {person.telefone}
                  </div>
                </div>
                <div
                  className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${
                    person.status === StatusEntregador.ATIVO
                      ? "bg-green-100 text-green-700"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {person.status === StatusEntregador.ATIVO
                    ? "Ativo"
                    : "Inativo"}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
