import { type Stop, StatusParada } from "../types/stop";

import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";

export const StopCard: React.FC<{
  stop: Stop;
  index: number;
  onComplete: () => void;
}> = ({ stop, index, onComplete }) => {
  const isCompleted = stop.status === StatusParada.CONCLUIDA;
  const isActive =
    stop.status === StatusParada.PENDENTE ||
    stop.status === StatusParada.CONCLUIDA;

  return (
    <div
      className={`p-4 rounded-lg border transition-all ${
        isCompleted
          ? "border-green-200 bg-green-50"
          : isActive
          ? "border-italian-green bg-italian-green/5"
          : "border-neutral-200 bg-neutral-50"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            isCompleted
              ? "bg-green-500 text-white"
              : isActive
              ? "bg-italian-green text-white"
              : "bg-neutral-300 text-neutral-600"
          }`}
        >
          {isCompleted ? <CheckCircleOutlined /> : index + 1}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-neutral-800">
              Pedido #{stop.pedido.crmPedidoId}
            </h4>
            <span
              className={`text-xs font-medium px-2 py-1 rounded ${
                isCompleted
                  ? "bg-green-100 text-green-700"
                  : isActive
                  ? "bg-italian-green/10 text-italian-green"
                  : "bg-neutral-100 text-neutral-600"
              }`}
            >
              {isCompleted
                ? "Entregue"
                : isActive
                ? "Em andamento"
                : "Pendente"}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <UserOutlined className="text-xs" />
              <span className="font-medium">{stop.pedido.nomeCliente}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <EnvironmentOutlined className="text-xs" />
              <span className="truncate">{stop.pedido.enderecoCompleto}</span>
            </div>

            {stop.pedido.tempoMaximoEntrega && (
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <ClockCircleOutlined className="text-xs" />
                <span>
                  Entregar até:{" "}
                  {new Date(stop.pedido.tempoMaximoEntrega).toLocaleTimeString(
                    "pt-BR",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </span>
              </div>
            )}

            {stop.horarioConclusao && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircleOutlined className="text-xs" />
                <span>
                  Entregue às:{" "}
                  {new Date(stop.horarioConclusao).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            )}
          </div>

          {!isCompleted && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={onComplete}
                className="bg-italian-green hover:bg-italian-green/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Marcar como entregue
              </button>
              <button className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <PhoneOutlined className="mr-2" />
                Ligar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
