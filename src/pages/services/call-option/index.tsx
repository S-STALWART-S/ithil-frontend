import { useEffect } from "react";

import { useTokenModal } from "@/contexts/TokenModal";
import { getServiceByName } from "@/utils";

const CallOptionPage = () => {
  const tokenModal = useTokenModal({
    isClosable: false,
    returnPath: "/services",
  });

  useEffect(() => {
    const tokens = getServiceByName("call-option").tokens;
    tokenModal.openDialog(tokens, "call-option");
  }, []);

  return null;
};

export default CallOptionPage;
