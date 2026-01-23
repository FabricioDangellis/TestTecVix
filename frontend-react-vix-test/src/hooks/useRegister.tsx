import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { api } from "../services/api";
//import { useZBrandInfo } from "../stores/useZBrandStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const useRegister = () => {
  const { t } = useTranslation();
  //const { idBrand } = useZBrandInfo();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return t("loginRegister.invalidEmail");
    }
    return null;
  };

  const validatePasswords = (password: string, confirmPassword: string) => {
    if (!password) return t("loginRegister.invalidPassword");
    if (password !== confirmPassword) {
      return t("loginRegister.passwordMismatch");
    }
    return null;
  };
  const goRegister = async ({
    username,
    password,
    email,
    confirmPassword,
  }: {
    username: string;
    password: string;
    email: string;
    confirmPassword: string;
  }) => {
    if (isLoading) return;

    if (!username) {
      toast.error(t("loginRegister.invalidUsername"));
      return;
    }

    const emailError = validateEmail(email);
    const passwordError = validatePasswords(password, confirmPassword);

    if (emailError || passwordError) {
      toast.error(emailError || passwordError);
      return;
    }

    try {
      setIsLoading(true);

      const response = await api.post({
        url: "/users/register",
        data: {
          username,
          password,
          email,
          role: "member",
          isActive: true,
          //idBrandMaster: idBrand,
        },
      });

      if (response.error) {
        toast.error(response.message);
        return;
      }

      toast.success(t("loginRegister.registerSuccess"));
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  return { goRegister, isLoading };
};
