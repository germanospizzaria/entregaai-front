import type React from "react";
import { useState } from "react";
import { Card, Form, Input, Button, Typography, Alert } from "antd";
import {
  UserOutlined,
  LockOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/use-auth";
import type { AdminLoginCredentials } from "../types/auth";

const { Title, Text } = Typography;

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated } = useAuth();
  const [form] = Form.useForm();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    try {
      setError(null);
      const credentials: AdminLoginCredentials = {
        username: values.username,
        password: values.password,
      };

      await login("admin", credentials);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login");
    }
  };

  const handleBack = () => {
    navigate("/autenticacao");
  };

  if (isAuthenticated) {
    navigate("/admin");
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
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-italian-green flex items-center justify-center shadow-medium">
              <UserOutlined className="text-2xl text-white" />
            </div>
            <Title level={3} className="!text-neutral-800 !mb-2">
              Acesso Administrativo
            </Title>
            <Text className="text-neutral-500">
              Entre com suas credenciais de administrador
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
            name="admin-login"
            onFinish={handleSubmit}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="username"
              label={
                <span className="text-neutral-700 font-medium">
                  Nome de usuário
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Por favor, insira seu nome de usuário",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-neutral-400" />}
                placeholder="Digite seu nome de usuário"
                className="rounded-lg border-neutral-200 hover:border-neutral-300 focus:border-italian-green transition-smooth"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={
                <span className="text-neutral-700 font-medium">Senha</span>
              }
              rules={[
                { required: true, message: "Por favor, insira sua senha" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-neutral-400" />}
                placeholder="Digite sua senha"
                className="rounded-lg border-neutral-200 hover:border-neutral-300 focus:border-italian-green transition-smooth"
              />
            </Form.Item>

            <Form.Item className="!mb-0 !mt-8">
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                className="w-full h-12 bg-italian-green hover:bg-italian-green/90 border-italian-green hover:border-italian-green/90 rounded-lg text-base font-semibold shadow-soft transition-smooth"
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-6 pt-4 border-t border-neutral-100">
            <Text className="text-neutral-400">
              Acesso restrito a administradores autorizados
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};
