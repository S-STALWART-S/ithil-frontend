import { useEffect } from "react";

import { useTokenModal } from "@/contexts/TokenModal";
import { getServiceByName } from "@/utils";

const GMXPage = () => {
  const tokenModal = useTokenModal({
    isClosable: false,
    returnPath: "/services",
  });

  useEffect(() => {
    const tokens = getServiceByName("gmx").tokens;
    tokenModal.openDialog(tokens, "gmx");
  }, []);

  return null;
};

export default GMXPage;
