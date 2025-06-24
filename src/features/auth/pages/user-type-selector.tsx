import type React from "react";
import { Card, Button, Typography, Image } from "antd";
import { UserOutlined, CarOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";

const { Title, Text } = Typography;
import germanosLogo from "../../../assets/germanos.jpeg";

export const UserTypeSelector: React.FC = () => {
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    navigate("/autenticacao/admin/login");
  };

  const handleDriverLogin = () => {
    navigate("/autenticacao/driver/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-italian-cream via-neutral-50 to-italian-cream flex items-center justify-center p-5">
      <div className="w-full max-w-xl">
        <Card className="shadow-strong border-0 rounded-2xl overflow-hidden animate-scale-in p-4">
          <div className="text-center mb-10">
            <Image
              width={100}
              src={germanosLogo}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-italian-green to-italian-red flex items-center justify-center shadow-medium"
            />
            <Title level={2} className="!text-neutral-800 !mb-2 font-semibold">
              Germano's Pizzaria
            </Title>
            <Text className="text-neutral-500 text-base">
              Selecione como deseja acessar o sistema
            </Text>
          </div>

          <div className="space-y-4">
            <Button
              type="primary"
              size="large"
              icon={<UserOutlined className="text-lg" />}
              onClick={handleAdminLogin}
              className="w-full h-16 bg-italian-green hover:bg-italian-green/90 border-italian-green hover:border-italian-green/90 rounded-xl font-medium text-base shadow-soft transition-smooth"
            >
              <div className="flex flex-col items-center">
                <span className="font-semibold">Acesso Administrativo</span>
                <span className="text-sm opacity-90 font-normal">
                  Gerenciar pedidos e entregas
                </span>
              </div>
            </Button>

            <Button
              size="large"
              icon={<CarOutlined className="text-lg" />}
              onClick={handleDriverLogin}
              className="w-full h-16 bg-white border-neutral-200 hover:border-neutral-300 text-neutral-700 hover:text-neutral-800 rounded-xl font-medium text-base shadow-soft transition-smooth"
            >
              <div className="flex flex-col items-center">
                <span className="font-semibold">Acesso Entregador</span>
                <span className="text-sm opacity-70 font-normal">
                  Visualizar suas entregas
                </span>
              </div>
            </Button>
          </div>

          <div className="text-center mt-8 pt-6 border-t border-neutral-100">
            <Text className="text-neutral-400 text-base">
              Sistema de Gerenciamento de Entregas v1.0
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};
