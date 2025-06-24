import type React from "react";
import { DeliveryDriversManagement } from "../components/delivery-drivers-management";

interface DeliveryDriversPageProps {
  onBack: () => void;
}

export const DeliveryDriversPage: React.FC<DeliveryDriversPageProps> = ({
  onBack,
}) => {
  return <DeliveryDriversManagement onBack={onBack} />;
};
