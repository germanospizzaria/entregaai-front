import { useState, useEffect } from "react";
import {
  Card,
  Form,
  Select,
  Input,
  Button,
  Typography,
  Alert,
  Spin,
} from "antd";
import {
  PhoneOutlined,
  ArrowLeftOutlined,
  CarOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/use-auth";
import type { Driver, DriverLoginCredentials } from "../types/auth";
import { apiClient } from "../../../shared/services/api.service";

const { Title, Text } = Typography;
const { Option } = Select;

export const DriverLogin = () => {
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated } = useAuth();
  const [form] = Form.useForm();
  const [error, setError] = useState<string | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loadingDrivers, setLoadingDrivers] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  useEffect(() => {
    const loadDrivers = async () => {
      try {
        setLoadingDrivers(true);
        const driversData = await apiClient.get<Driver[]>("delivery-drivers");
        setDrivers(driversData);
      } catch (err) {
        console.error("Erro ao carregar entregadores:", err);
        setError("Erro ao carregar lista de entregadores");
      } finally {
        setLoadingDrivers(false);
      }
    };

    loadDrivers();
  }, []);

  const handleDriverSelect = (driverId: string) => {
    const driver = drivers.find((d) => d.id.toString() === driverId);
    setSelectedDriver(driver || null);
    setError(null);
  };

  const handleSubmit = async (values: {
    driverId: string;
    phoneLastDigits: string;
  }) => {
    try {
      setError(null);

      if (!selectedDriver) {
        setError("Por favor, selecione um entregador");
        return;
      }

      if (values.phoneLastDigits.length !== 4) {
        setError("O PIN deve ter exatamente 4 dígitos");
        return;
      }

      const credentials: DriverLoginCredentials = {
        driverId: Number(values.driverId),
        phoneLastDigits: values.phoneLastDigits,
      };

      await login("driver", credentials);
    } catch (err) {
      setError(err instanceof Error ? err.message : "PIN incorreto");
    }
  };

  const handleBack = () => {
    navigate("/autenticacao");
  };

  if (isAuthenticated) {
    navigate("/driver");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-italian-cream via-neutral-50 to-italian-cream flex items-center justify-center p-5">
      <div className="w-full max-w-xl">
        <Card className="shadow-strong border-0 rounded-2xl overflow-hidden animate-scale-in relative p-6">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            className="absolute top-4 left-4 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 rounded-lg transition-smooth"
          />

          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-italian-red flex items-center justify-center shadow-medium">
              <CarOutlined className="text-2xl text-white" />
            </div>
            <Title level={3} className="!text-neutral-800 !mb-2">
              Acesso Entregador
            </Title>
            <Text className="text-neutral-500">
              Selecione seu nome e digite seu PIN
            </Text>
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              className="mb-6 rounded-lg border-error/20 bg-error/5"
            />
          )}

          <Form
            form={form}
            name="driver-login"
            onFinish={handleSubmit}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="driverId"
              label={
                <span className="text-neutral-700 font-medium">
                  Selecione seu nome
                </span>
              }
              rules={[
                { required: true, message: "Por favor, selecione seu nome" },
              ]}
            >
              <Select
                placeholder="Escolha seu nome na lista"
                className="rounded-lg"
                loading={loadingDrivers}
                onChange={handleDriverSelect}
                optionLabelProp="label"
                size="large"
                notFoundContent={
                  loadingDrivers ? (
                    <Spin size="small" />
                  ) : (
                    "Nenhum entregador encontrado"
                  )
                }
              >
                {drivers.map((driver) => (
                  <Option
                    key={driver.id}
                    value={driver.id.toString()}
                    label={driver.nome}
                  >
                    <div className="py-2">
                      <div className="font-medium text-neutral-800 text-sm">
                        {driver.nome}
                      </div>
                      <div className="text-xs text-neutral-500 mt-1">
                        Tel: {driver.telefone}
                      </div>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {selectedDriver && (
              <div className="mb-4 p-3 bg-italian-cream/30 rounded-lg border border-italian-cream">
                <Text className="text-xs text-neutral-500 block mb-1">
                  Entregador selecionado:
                </Text>
                <div className="font-medium text-neutral-800">
                  {selectedDriver.nome}
                </div>
                <div className="text-xs text-neutral-600">
                  Telefone: {selectedDriver.telefone}
                </div>
              </div>
            )}

            <Form.Item
              name="phoneLastDigits"
              label={<span className="text-neutral-700 font-medium">PIN</span>}
              rules={[
                { required: true, message: "Por favor, insira seu PIN" },
                { len: 4, message: "O PIN deve ter exatamente 4 dígitos" },
                {
                  pattern: /^\d{4}$/,
                  message: "O PIN deve conter apenas números",
                },
              ]}
            >
              <Input
                prefix={<PhoneOutlined className="text-neutral-400" />}
                placeholder="••••"
                maxLength={4}
                className="text-center text-lg tracking-widest rounded-lg border-neutral-200 hover:border-neutral-300 focus:border-italian-red transition-smooth"
              />
            </Form.Item>

            <Form.Item className="!mb-0 !mt-8">
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                disabled={!selectedDriver}
                className={`w-full h-12 rounded-lg text-base font-semibold shadow-soft transition-smooth ${
                  selectedDriver
                    ? "bg-italian-red hover:bg-italian-red/90 border-italian-red hover:border-italian-red/90"
                    : "bg-neutral-200 border-neutral-200 text-neutral-400"
                }`}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-6 pt-4 border-t border-neutral-100">
            <Text className="text-neutral-400 text-xs">
              Seu PIN são os últimos 4 dígitos do seu telefone cadastrado
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};
