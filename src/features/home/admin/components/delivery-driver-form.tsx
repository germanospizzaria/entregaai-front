import type React from "react";
import { Form, Input, Button } from "antd";
import { UserOutlined, PhoneOutlined } from "@ant-design/icons";
import { useMediaQuery } from "../../../../shared/hooks/use-mobile";

interface DeliveryDriverFormProps {
  initialValues?: {
    nome: string;
    telefone: string;
  };
  onSubmit: (values: { nome: string; telefone: string }) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  isEditing?: boolean;
}

export const DeliveryDriverForm: React.FC<DeliveryDriverFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
  isEditing = false,
}) => {
  const [form] = Form.useForm();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleSubmit = async (values: { nome: string; telefone: string }) => {
    await onSubmit(values);
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");

    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }

    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    form.setFieldsValue({ telefone: formatted });
  };

  return (
    <div className="px-2 py-3 sm:px-4 sm:py-4">
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleSubmit}
        autoComplete="off"
        className="max-w-md mx-auto driver-form-mobile"
      >
        <Form.Item
          label={
            <span className="text-sm sm:text-base font-medium text-neutral-700">
              Nome do Entregador
            </span>
          }
          name="nome"
          rules={[
            { required: true, message: "Nome do entregador é obrigatório" },
            { min: 2, message: "Nome deve ter pelo menos 2 caracteres" },
            { max: 100, message: "Nome deve ter no máximo 100 caracteres" },
          ]}
          className="mb-4"
        >
          <Input
            prefix={<UserOutlined className="text-neutral-400" />}
            placeholder={
              isMobile
                ? "Nome completo"
                : "Digite o nome completo do entregador"
            }
            size={isMobile ? "middle" : "large"}
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item
          label={
            <span className="text-sm sm:text-base font-medium text-neutral-700">
              Telefone
            </span>
          }
          name="telefone"
          rules={[{ required: true, message: "Telefone é obrigatório" }]}
          className="mb-4"
        >
          <Input
            prefix={<PhoneOutlined className="text-neutral-400" />}
            placeholder="(XX) XXXXX-XXXX"
            size={isMobile ? "middle" : "large"}
            onChange={handlePhoneChange}
            maxLength={15}
            className="rounded-lg"
          />
        </Form.Item>

        <div className="bg-neutral-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-italian-green/10 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
              <span className="text-italian-green text-xs">ℹ</span>
            </div>
            <div className="text-xs sm:text-sm text-neutral-600">
              <p className="font-medium mb-1 text-xs sm:text-sm">
                Informações importantes:
              </p>
              <ul className="space-y-1 text-xs">
                <li>• O telefone deve ser único no sistema</li>
                <li>
                  • {isEditing ? "O entregador editado" : "Novos entregadores"}{" "}
                  {isEditing ? "manterá" : "começarão com"} status ativo
                </li>
                {!isMobile && (
                  <li>
                    • Certifique-se de que os dados estão corretos antes de
                    salvar
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <Form.Item className="mb-0">
          <div
            className={`w-full ${
              isMobile ? "space-y-2" : "flex justify-end gap-3"
            }`}
          >
            <Button
              onClick={onCancel}
              disabled={loading}
              size={isMobile ? "middle" : "large"}
              className={`${
                isMobile ? "w-full" : ""
              } rounded-lg border-neutral-300`}
            >
              Cancelar
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size={isMobile ? "middle" : "large"}
              className={`${
                isMobile ? "w-full" : ""
              } bg-italian-green border-italian-green hover:bg-italian-green/90 rounded-lg`}
            >
              {isEditing ? "Salvar Alterações" : "Criar Entregador"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};
