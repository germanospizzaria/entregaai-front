import type React from "react";
import { useState } from "react";
import {
  CarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  UserOutlined,
  DownOutlined,
  UpOutlined,
  CheckCircleOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import type { Run } from "../../driver/types/run";
import { StatusParada } from "../../driver/types/stop";

interface ActiveRunsProps {
  runs: Run[];
  loading: boolean;
}

export const ActiveRuns: React.FC<ActiveRunsProps> = ({ runs, loading }) => {
  const [expandedRun, setExpandedRun] = useState<number | null>(null);

  const toggleRunExpansion = (runId: number) => {
    setExpandedRun(expandedRun === runId ? null : runId);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-neutral-200 rounded-full animate-pulse" />
          <div className="h-4 sm:h-5 bg-neutral-200 rounded w-24 sm:w-32 animate-pulse" />
        </div>
        <div className="space-y-2 sm:space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="p-3 sm:p-4 bg-neutral-50 rounded-lg animate-pulse"
            >
              <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-neutral-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-4 sm:p-6 h-full">
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-italian-red/10 rounded-full flex items-center justify-center">
          <CarOutlined className="text-italian-red text-xs" />
        </div>
        <h2 className="text-base sm:text-lg font-semibold text-neutral-800">
          Corridas Ativas
        </h2>
        <span className="bg-italian-red/10 text-italian-red text-xs font-medium px-2 py-1 rounded-full">
          {runs.length}
        </span>
      </div>

      <div className="space-y-2 sm:space-y-3 max-h-[400px] overflow-hidden overflow-y-auto">
        {runs.length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CarOutlined className="text-neutral-400 text-xl sm:text-2xl" />
            </div>
            <p className="text-neutral-500">Nenhuma corrida ativa no momento</p>
          </div>
        ) : (
          runs.map((run) => (
            <div
              key={run.id}
              className="bg-neutral-50 rounded-lg border border-neutral-200 overflow-hidden"
            >
              <div
                className="p-3 sm:p-4 cursor-pointer hover:bg-neutral-100 transition-colors"
                onClick={() => toggleRunExpansion(run.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-neutral-800 text-sm">
                      Corrida #{run.id}
                    </span>
                    {expandedRun === run.id ? (
                      <UpOutlined className="text-neutral-400" />
                    ) : (
                      <DownOutlined className="text-neutral-400" />
                    )}
                  </div>
                  <span className="bg-italian-green/10 text-italian-green text-xs font-medium px-2 py-1 rounded">
                    {run.status.replace("_", " ")}
                  </span>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 text-neutral-600 mb-2 sm:mb-3">
                  <div className="flex items-center gap-1">
                    <EnvironmentOutlined />
                    <span>{run.paradas.length} paradas</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ClockCircleOutlined />
                    <span>
                      {new Date(run.createdAt).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {run.entregador && (
                    <div className="flex items-center gap-1">
                      <UserOutlined />
                      <span className="truncate">{run.entregador.nome}</span>
                    </div>
                  )}
                </div>

                <div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className="bg-italian-green h-2 rounded-full transition-all"
                      style={{
                        width: `${
                          (run.paradas.filter(
                            (p) => p.status === StatusParada.CONCLUIDA
                          ).length /
                            run.paradas.length) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <div className="text-neutral-500 mt-1">
                    {
                      run.paradas.filter(
                        (p) => p.status === StatusParada.CONCLUIDA
                      ).length
                    }{" "}
                    de {run.paradas.length} entregas concluídas
                  </div>
                </div>
              </div>

              {expandedRun === run.id && (
                <div className="border-t border-neutral-200 bg-white">
                  {run.entregador && (
                    <div className="p-4 border-b border-neutral-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-italian-red/10 rounded-full flex items-center justify-center">
                          <UserOutlined className="text-italian-red" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-neutral-800">
                            Entregador Responsável
                          </h4>
                          <p className="text-neutral-600">
                            {run.entregador.nome}
                          </p>
                          {run.entregador.telefone && (
                            <div className="flex items-center gap-1 mt-1">
                              <PhoneOutlined className="text-xs text-neutral-400" />
                              <span className="text-neutral-500">
                                {run.entregador.telefone}
                              </span>
                            </div>
                          )}
                        </div>
                        <div
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            run.entregador.status === "ATIVO"
                              ? "bg-green-100 text-green-700"
                              : "bg-neutral-100 text-neutral-600"
                          }`}
                        >
                          {run.entregador.status === "ATIVO"
                            ? "Ativo"
                            : "Inativo"}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-4">
                    <h4 className="font-medium text-neutral-800 mb-3 flex items-center gap-2">
                      <EnvironmentOutlined className="text-italian-green" />
                      Sequência de Entregas
                    </h4>

                    <div className="space-y-3">
                      {run.paradas
                        .sort((a, b) => a.ordem - b.ordem)
                        .map((stop) => {
                          const isCompleted =
                            stop.status === StatusParada.CONCLUIDA;
                          const isActive =
                            stop.status === StatusParada.PENDENTE;

                          return (
                            <div
                              key={stop.id}
                              className={`p-3 rounded-lg border transition-all ${
                                isCompleted
                                  ? "border-green-200 bg-green-50"
                                  : isActive
                                  ? "border-italian-green bg-italian-green/5"
                                  : "border-neutral-200 bg-neutral-50"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                                    isCompleted
                                      ? "bg-green-500 text-white"
                                      : isActive
                                      ? "bg-italian-green text-white"
                                      : "bg-neutral-300 text-neutral-600"
                                  }`}
                                >
                                  {isCompleted ? (
                                    <CheckCircleOutlined className="text-xs" />
                                  ) : (
                                    stop.ordem
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <h5 className="font-medium text-neutral-800 text-sm">
                                      Pedido #{stop.pedido.crmPedidoId}
                                    </h5>
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

                                  <div className="space-y-1">
                                    {stop.pedido.nomeCliente && (
                                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                                        <UserOutlined className="text-xs" />
                                        <span className="truncate">
                                          {stop.pedido.nomeCliente}
                                        </span>
                                      </div>
                                    )}

                                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                                      <EnvironmentOutlined className="text-xs" />
                                      <span className="truncate">
                                        {stop.pedido.enderecoCompleto}
                                      </span>
                                    </div>

                                    {stop.pedido.tempoMaximoEntrega && (
                                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                                        <ClockCircleOutlined className="text-xs" />
                                        <span>
                                          Entregar até:{" "}
                                          {new Date(
                                            stop.pedido.tempoMaximoEntrega
                                          ).toLocaleTimeString("pt-BR", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                        </span>
                                      </div>
                                    )}

                                    {stop.horarioConclusao && (
                                      <div className="flex items-center gap-2 text-sm text-green-600">
                                        <CheckCircleOutlined className="text-xs" />
                                        <span>
                                          Entregue às:{" "}
                                          {new Date(
                                            stop.horarioConclusao
                                          ).toLocaleTimeString("pt-BR", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
