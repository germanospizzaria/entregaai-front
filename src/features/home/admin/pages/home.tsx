import { useState } from "react";
import {
  MenuOutlined,
  CloseOutlined,
  LogoutOutlined,
  CalendarOutlined,
  CalendarFilled,
  BarChartOutlined,
  UserAddOutlined, // Adicione esta linha
} from "@ant-design/icons";
import { PendingOrdersList } from "../components/pending-order-list";
import { DeliveryPersonSelector } from "../components/delivery-person-selector";
import { CreateRunButton } from "../components/create-run-button";
import { DeliveryMap } from "../components/delivery-map";
import { ActiveRuns } from "../components/active-runs";
import { RunsDateFilter } from "../components/runs-date-filter";
import { OrdersManagementPage } from "./orders-management";
import { StatisticsPage } from "./statistics";
import { useDeliveryData } from "../hooks/use-delivery-data";
import type { Run } from "../../driver/types/run";
import { useAuth } from "../../../auth/hooks/use-auth";
import germanosLogo from "../../../../assets/germanos.jpeg";
import { Image, Button, Drawer } from "antd";
import { RunCreatedModal } from "../components/run-creation-modal";
import { message } from "antd";
import { apiClient } from "../../../../shared/services/api.service";
import {
  isCurrentDayFilter,
  formatDateForDisplay,
} from "../../../../shared/utils/date";
import { DeliveryDriversPage } from "./delivery-drivers";

const PIZZARIA_LOCATION = {
  lat: -23.265772537179835,
  lng: -51.05287288263555,
  address: "Av. Sen. Souza Naves, 685 - Centro, Ibiporã - PR",
};

const AdminPage = () => {
  const {
    pendingOrders,
    availableDeliveryPersons,
    activeRuns,
    loading,
    runFilters,
    updateRunFilters,
    clearFilters,
    resetToToday,
    refetch,
  } = useDeliveryData();

  const { logout } = useAuth();

  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState<
    number | undefined
  >();
  const [creatingRun, setCreatingRun] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showOrdersManagement, setShowOrdersManagement] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);
  const [showDeliveryDrivers, setShowDeliveryDrivers] = useState(false);

  const [showRunCreatedModal, setShowRunCreatedModal] = useState(false);
  const [createdRunData, setCreatedRunData] = useState<Run | null>(null);
  const [routeDetails, setRouteDetails] = useState<{
    totalDistance: number;
    totalDuration: string;
    optimizedSequence: number[];
  } | null>(null);

  if (showOrdersManagement) {
    return (
      <OrdersManagementPage onBack={() => setShowOrdersManagement(false)} />
    );
  }

  if (showStatistics) {
    return <StatisticsPage onBack={() => setShowStatistics(false)} />;
  }

  if (showDeliveryDrivers) {
    return <DeliveryDriversPage onBack={() => setShowDeliveryDrivers(false)} />;
  }

  const handleOrderSelect = (orderId: number, checked?: boolean) => {
    const shouldSelect =
      checked !== undefined ? checked : !selectedOrders.includes(orderId);

    if (shouldSelect) {
      setSelectedOrders((prev) => [...prev, orderId]);
    } else {
      setSelectedOrders((prev) => prev.filter((id) => id !== orderId));
    }
  };

  const handleDeliveryPersonSelect = (deliveryPersonId: number) => {
    setSelectedDeliveryPerson(deliveryPersonId);
  };

  const handleCreateRun = async () => {
    if (selectedOrders.length === 0 || !selectedDeliveryPerson) return;

    setCreatingRun(true);

    try {
      const body = {
        orderIds: selectedOrders,
        deliveryDriverId: selectedDeliveryPerson,
      };

      const runDispatchResponse = await apiClient.post<{
        run: Run;
        routeDetails: {
          totalDistance: number;
          totalDuration: string;
          optimizedSequence: number[];
        };
      }>("/run-dispatch", body);

      if (runDispatchResponse) {
        message.success("Corrida criada com sucesso!");

        setCreatedRunData(runDispatchResponse.run);
        setRouteDetails(runDispatchResponse.routeDetails);
        setShowRunCreatedModal(true);

        refetch();
        setSelectedOrders([]);
        setSelectedDeliveryPerson(undefined);
        setSidebarOpen(false);
      }
    } catch (error) {
      console.error("Erro ao criar corrida:", error);
      message.error("Erro ao criar corrida. Tente novamente mais tarde.");
    } finally {
      setCreatingRun(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const isShowingToday = isCurrentDayFilter(
    runFilters.startDate,
    runFilters.endDate
  );
  const hasCustomFilters = runFilters.startDate || runFilters.endDate;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="bg-white border-b border-neutral-200 px-4 sm:px-6 py-4 relative z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <Image
              width={30}
              src={germanosLogo || "/placeholder.svg"}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-italian-green to-italian-red rounded-full flex items-center justify-center"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-semibold text-neutral-800">
                  Dashboard de Entregas
                </h1>
                {isShowingToday && (
                  <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full hidden sm:inline-flex items-center gap-1">
                    <CalendarFilled className="text-xs" />
                    Hoje
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <p className="text-neutral-500 text-xs sm:text-sm">
                  {isShowingToday
                    ? "Exibindo dados de hoje"
                    : hasCustomFilters
                    ? `Período: ${formatDateForDisplay(
                        runFilters.startDate!
                      )} - ${formatDateForDisplay(runFilters.endDate!)}`
                    : "Gerencie pedidos e acompanhe entregas em tempo real"}
                </p>
                {isShowingToday && (
                  <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full sm:hidden">
                    Hoje
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              icon={<BarChartOutlined />}
              onClick={() => setShowStatistics(true)}
              className="hidden lg:flex items-center gap-2 bg-italian-green text-white border-italian-green hover:bg-italian-green/90 hover:border-italian-green/90"
            >
              Estatísticas
            </Button>

            <Button
              icon={<UserAddOutlined />}
              onClick={() => setShowDeliveryDrivers(true)}
              className="hidden lg:flex items-center gap-2 border-italian-red"
            >
              Entregadores
            </Button>

            <Button
              icon={<CalendarOutlined />}
              onClick={() => setShowFiltersDrawer(true)}
              className="hidden lg:flex items-center gap-2"
              type={hasCustomFilters && !isShowingToday ? "primary" : "default"}
            >
              {isShowingToday ? "Hoje" : "Filtros"}
            </Button>

            <button
              onClick={handleLogout}
              className="hidden lg:flex items-center gap-2 px-4 py-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <LogoutOutlined className="text-sm" />
              <span className="text-sm font-medium">Sair</span>
            </button>

            <button
              onClick={handleLogout}
              className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              title="Sair"
            >
              <LogoutOutlined className="text-neutral-600" />
            </button>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors relative z-50"
            >
              {sidebarOpen ? (
                <CloseOutlined className="text-neutral-600" />
              ) : (
                <MenuOutlined className="text-neutral-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)] sm:h-[calc(100vh-80px)] relative">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            style={{ top: "73px" }}
          />
        )}

        <div
          className={`
            fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
            w-80 sm:w-96 lg:w-80 xl:w-96
            bg-neutral-50 border-r border-neutral-200
            transform transition-transform duration-300 ease-in-out lg:transform-none
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
            overflow-y-auto
          `}
          style={{
            top: sidebarOpen ? "73px" : "0",
            height: sidebarOpen ? "calc(100vh - 73px)" : "100%",
          }}
        >
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between lg:hidden mb-4">
              <h2 className="text-lg font-semibold text-neutral-800">
                Controles
              </h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-neutral-200 transition-colors"
              >
                <CloseOutlined className="text-neutral-600" />
              </button>
            </div>

            <PendingOrdersList
              orders={pendingOrders}
              selectedOrders={selectedOrders}
              onOrderSelect={handleOrderSelect}
              onViewAllOrders={() => setShowOrdersManagement(true)}
              loading={loading}
            />

            <DeliveryPersonSelector
              deliveryPersons={availableDeliveryPersons}
              selectedDeliveryPerson={selectedDeliveryPerson}
              onDeliveryPersonSelect={handleDeliveryPersonSelect}
              loading={loading}
            />

            <CreateRunButton
              selectedOrders={selectedOrders}
              selectedDeliveryPerson={selectedDeliveryPerson}
              onCreateRun={handleCreateRun}
              loading={creatingRun}
            />

            <div className="lg:hidden pt-4 border-t border-neutral-200">
              <button
                onClick={() => {
                  setShowStatistics(true);
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-italian-green/10 hover:bg-italian-green/20 text-italian-green transition-colors"
              >
                <BarChartOutlined />
                <div className="text-left">
                  <div className="font-medium">Ver Estatísticas</div>
                  <div className="text-xs opacity-80">
                    Análise completa das entregas
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowDeliveryDrivers(true);
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg border transition-colors mt-2"
              >
                <UserAddOutlined />
                <div className="text-left">
                  <div className="font-medium">Gerenciar Entregadores</div>
                  <div className="text-xs opacity-80">
                    Adicionar e editar entregadores
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowFiltersDrawer(true);
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg border transition-colors mt-2"
              >
                <CalendarOutlined className="text-lg" />
                <div className="text-left">
                  <div className="font-medium">
                    {isShowingToday ? "Hoje" : "Filtros"}
                  </div>
                  <div className="text-xs opacity-80">
                    Gerenciar período de exibição
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            <div className="space-y-6">
              <div className="h-[450px] sm:h-[650px] lg:h-[calc(100vh-150px)]">
                <DeliveryMap
                  pizzariaLocation={PIZZARIA_LOCATION}
                  orders={pendingOrders}
                  selectedOrders={selectedOrders}
                  onOrderSelect={handleOrderSelect}
                />
              </div>

              <ActiveRuns runs={activeRuns} loading={loading} />
            </div>
          </div>
        </div>
      </div>

      <Drawer
        title="Filtros de Data"
        placement="right"
        onClose={() => setShowFiltersDrawer(false)}
        open={showFiltersDrawer}
        width={400}
        className="lg:w-96"
      >
        <RunsDateFilter
          filters={runFilters}
          onFiltersChange={updateRunFilters}
          onClearFilters={clearFilters}
          onResetToToday={resetToToday}
          loading={loading}
          totalRuns={activeRuns.length}
        />
      </Drawer>

      <RunCreatedModal
        visible={showRunCreatedModal}
        onClose={() => {
          setShowRunCreatedModal(false);
          setCreatedRunData(null);
          setRouteDetails(null);
        }}
        runData={createdRunData}
        routeDetails={routeDetails}
      />
    </div>
  );
};

export default AdminPage;
