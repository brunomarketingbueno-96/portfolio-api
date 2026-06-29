import { useTranslation } from "react-i18next";

export default function WelcomePanel() {
  const { t } = useTranslation();

  return (
    <div className="hidden md:flex md:w-1/2 bg-blue-900 
      text-white flex-col justify-center items-center p-12"
    >
      <div className="max-w-md text-center">

        <h1 className="text-4xl font-bold mb-4">
          {t("login.welcome.title", { defaultValue: "Welcome!" })}
        </h1>

        <p className="text-lg text-blue-200">
          {t("login.welcome.description", { defaultValue: "Manage your portfolio" })}
        </p>
      </div>
    </div>
  )
};
