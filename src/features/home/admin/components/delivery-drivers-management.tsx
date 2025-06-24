import type React from "react";
import { useState } from "react";
import {
  ArrowLeftOutlined,
  UserOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { Input, Select, Button, Modal, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeliveryDriverForm } from "./delivery-driver-form";
import { useDeliveryDrivers } from "../hooks/use-delivery-drivers";
import type { Driver } from "../../driver/types/driver";
import { StatusEntregador } from "../../driver/types/driver";
import germanosLogo from "../../../../assets/germanos.jpeg";
import { Image } from "antd";
import { useMediaQuery } from "../../../../shared/hooks/use-mobile";

const { Option } = Select;

interface DeliveryDriversManagementProps {
  onBack: () => void;
}

export const DeliveryDriversManagement: React.FC<
  DeliveryDriversManagementProps
> = ({ onBack }) => {
  const { drivers, loading, creating, createDriver } = useDeliveryDrivers();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      driver.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.telefone.includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" || driver.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const activeDrivers = drivers.filter(
    (d) => d.status === StatusEntregador.ATIVO
  );
  const inactiveDrivers = drivers.filter(
    (d) => d.status === StatusEntregador.INATIVO
  );

  const handleCreateDriver = async (data: {
    nome: string;
    telefone: string;
  }) => {
    const success = await createDriver(data);
    if (success) {
      setShowCreateModal(false);
    }
  };

  const columns: ColumnsType<Driver> = [
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
      fixed: isMobile ? undefined : "left",
      width: isMobile ? undefined : 200,
      render: (nome: string) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-italian-green/10 rounded-full flex items-center justify-center flex-shrink-0">
            <UserOutlined className="text-italian-green text-sm" />
          </div>
          <span className="font-medium text-neutral-800 truncate">{nome}</span>
        </div>
      ),
    },
    {
      title: "Telefone",
      dataIndex: "telefone",
      key: "telefone",
      responsive: isMobile ? ["md"] : undefined,
      render: (telefone: string) => (
        <div className="flex items-center gap-2">
          <PhoneOutlined className="text-neutral-400" />
          <span className="text-neutral-600">{telefone}</span>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: isMobile ? 80 : 120,
      render: (status: string) => (
        <Tag
          color={status === StatusEntregador.ATIVO ? "green" : "default"}
          icon={
            status === StatusEntregador.ATIVO ? (
              <CheckCircleOutlined />
            ) : (
              <CloseCircleOutlined />
            )
          }
          className={isMobile ? "text-xs" : ""}
        >
          {status === StatusEntregador.ATIVO ? "Ativo" : "Inativo"}
        </Tag>
      ),
    },
    /* {
      title: "Ações",
      key: "actions",
      render: (_, driver) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => setEditingDriver(driver)}
            className="text-italian-green hover:bg-italian-green/10"
          >
            Editar
          </Button>


          <Button
            type="text"
            onClick={() => handleToggleStatus(driver)}
            loading={updating}
            className={
              driver.status === StatusEntregador.ATIVO
                ? "text-orange-600 hover:bg-orange-50"
                : "text-green-600 hover:bg-green-50"
            }
          >
            {driver.status === StatusEntregador.ATIVO ? "Desativar" : "Ativar"}
          </Button>

          <Popconfirm
            title="Remover entregador"
            description="Tem certeza que deseja remover este entregador? Esta ação não pode ser desfeita."
            onConfirm={() => handleDeleteDriver(driver.id)}
            okText="Sim, remover"
            cancelText="Cancelar"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              loading={deleting === driver.id}
              className="text-red-600 hover:bg-red-50"
              danger
            >
              Remover
            </Button>

          </Popconfirm>
        </Space>
      ),
    }, */
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-3 sm:px-6 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-2 sm:gap-4 drivers-header-responsive">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <button
                onClick={onBack}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors flex-shrink-0"
              >
                <ArrowLeftOutlined className="text-neutral-600" />
              </button>
              <Image
                width={30}
                src={germanosLogo || "/placeholder.svg"}
                className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gradient-to-r from-italian-green to-italian-red rounded-full flex items-center justify-center flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-lg md:text-xl font-semibold text-neutral-800 truncate">
                  {isMobile ? "Entregadores" : "Gerenciamento de Entregadores"}
                </h1>
                {!isMobile && (
                  <p className="text-neutral-500 text-xs sm:text-sm hidden sm:block">
                    Adicione, edite e gerencie os entregadores da pizzaria
                  </p>
                )}
              </div>
            </div>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setShowCreateModal(true)}
              className="bg-italian-green border-italian-green hover:bg-italian-green/90 flex-shrink-0"
              size={isMobile ? "middle" : "large"}
            >
              {isMobile ? "" : "Novo Entregador"}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6">
        {/* Estatísticas */}
        <div className="drivers-grid-responsive mb-4 sm:mb-6">
          <div className="bg-white rounded-xl shadow-soft border border-neutral-200 drivers-stats-card-responsive p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-italian-green/10 rounded-full flex items-center justify-center flex-shrink-0">
                <UserOutlined className="text-italian-green text-lg sm:text-xl" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xl sm:text-2xl font-bold text-neutral-800 truncate">
                  {drivers.length}
                </div>
                <div className="text-xs sm:text-sm text-neutral-600">
                  {isMobile ? "Total" : "Total de Entregadores"}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft border border-neutral-200 drivers-stats-card-responsive p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircleOutlined className="text-green-600 text-lg sm:text-xl" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xl sm:text-2xl font-bold text-green-600 truncate">
                  {activeDrivers.length}
                </div>
                <div className="text-xs sm:text-sm text-neutral-600">
                  {isMobile ? "Ativos" : "Entregadores Ativos"}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft border border-neutral-200 drivers-stats-card-responsive p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CloseCircleOutlined className="text-neutral-500 text-lg sm:text-xl" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xl sm:text-2xl font-bold text-neutral-500 truncate">
                  {inactiveDrivers.length}
                </div>
                <div className="text-xs sm:text-sm text-neutral-600">
                  {isMobile ? "Inativos" : "Entregadores Inativos"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <FilterOutlined className="text-neutral-600" />
            <h2 className="font-semibold text-neutral-800 text-sm sm:text-base">
              Filtros
            </h2>
          </div>

          <div className="drivers-filters-responsive">
            <div className="flex-1">
              <label className="block text-xs sm:text-sm font-medium text-neutral-700 mb-2">
                Buscar
              </label>
              <Input
                placeholder={
                  isMobile
                    ? "Nome ou telefone"
                    : "Nome ou telefone do entregador"
                }
                prefix={<SearchOutlined className="text-neutral-400" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                size={isMobile ? "middle" : "large"}
              />
            </div>

            <div className="flex-1 md:flex-none md:w-48">
              <label className="block text-xs sm:text-sm font-medium text-neutral-700 mb-2">
                Status
              </label>
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                className="w-full"
                placeholder="Todos os status"
                size={isMobile ? "middle" : "large"}
              >
                <Option value="all">Todos os status</Option>
                <Option value={StatusEntregador.ATIVO}>Ativos</Option>
                <Option value={StatusEntregador.INATIVO}>Inativos</Option>
              </Select>
            </div>
          </div>
        </div>

        {/* Tabela de Entregadores */}
        <div className="bg-white rounded-xl shadow-soft border border-neutral-200 overflow-hidden drivers-table-responsive">
          <Table
            columns={columns}
            dataSource={filteredDrivers}
            rowKey="id"
            loading={loading}
            scroll={{ x: isMobile ? 400 : undefined }}
            size={isMobile ? "small" : "middle"}
            pagination={{
              pageSize: isMobile ? 5 : 10,
              showSizeChanger: !isMobile,
              showQuickJumper: !isMobile,
              showTotal: !isMobile
                ? (total, range) =>
                    `${range[0]}-${range[1]} de ${total} entregadores`
                : undefined,
              simple: isMobile,
            }}
            locale={{
              emptyText: (
                <div className="text-center py-6 sm:py-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <UserOutlined className="text-neutral-400 text-lg sm:text-2xl" />
                  </div>
                  <p className="text-neutral-500 text-sm sm:text-base px-4">
                    {searchTerm || statusFilter !== "all"
                      ? "Nenhum entregador encontrado com os filtros aplicados"
                      : "Nenhum entregador cadastrado"}
                  </p>
                  {!searchTerm && statusFilter === "all" && (
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => setShowCreateModal(true)}
                      className="mt-4 bg-italian-green border-italian-green"
                      size={isMobile ? "middle" : "large"}
                    >
                      {isMobile ? "Cadastrar" : "Cadastrar Primeiro Entregador"}
                    </Button>
                  )}
                </div>
              ),
            }}
          />
        </div>
      </div>

      {/* Modal de Criação */}
      <Modal
        title="Novo Entregador"
        open={showCreateModal}
        onCancel={() => setShowCreateModal(false)}
        footer={null}
        width={isMobile ? "90%" : isTablet ? 400 : 500}
        style={isMobile ? { top: 20 } : undefined}
        className="drivers-modal-responsive"
        destroyOnClose
      >
        <DeliveryDriverForm
          onSubmit={handleCreateDriver}
          onCancel={() => setShowCreateModal(false)}
          loading={creating}
        />
      </Modal>

      {/* Modal de Edição */}
      {/*       <Modal
        title="Editar Entregador"
        open={!!editingDriver}
        onCancel={() => setEditingDriver(null)}
        footer={null}
        width={500}
        destroyOnClose
      >
        {editingDriver && (
          <DeliveryDriverForm
            initialValues={{
              nome: editingDriver.nome,
              telefone: editingDriver.telefone,
            }}
            onSubmit={handleUpdateDriver}
            onCancel={() => setEditingDriver(null)}
            loading={updating}
            isEditing
          />
        )}
      </Modal> */}
    </div>
  );
};
