import React, { useEffect, useState } from "react";
import { useEmitente, useUpdateEmitente } from "../../hooks/useEmitente";
import { useAuthStore } from "../../store/auth";
import {
  User,
  Mail,
  Building,
  IdCard,
  Edit3,
  Save,
  X,
  Check,
} from "lucide-react";
import { useUploadPhoto } from "@/hooks/useUploadPhoto";
import { api } from "@/api/axios";

export default function PerfilConfiguracao() {
  const { user } = useAuthStore();
  const { data, isLoading } = useEmitente();
  const updateEmitente = useUpdateEmitente();

  const [formData, setFormData] = useState({
    name: "",
    registration: "",
    unit: "",
    ciu: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || "",
        registration: data.registration || "",
        unit: data.unit || "",
        ciu: data.ciu || "",
      });
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateEmitente.mutate(formData);
    setIsEditing(false);
    setHasChanges(false);
    alert("Suas informações foram salvas com sucesso.");
  };

  const handleCancel = () => {
    if (data) {
      setFormData({
        name: data.name || "",
        registration: data.registration || "",
        unit: data.unit || "",
        ciu: data.ciu || "",
      });
    }
    setIsEditing(false);
    setHasChanges(false);
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const uploadPhoto = useUploadPhoto();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // preview instantâneo (opcional)
    const previewUrl = URL.createObjectURL(file);
    setPhotoUrl(previewUrl);

    uploadPhoto.mutate(file, {
      onSuccess: (data) => {
        if (data.photo) {
          const newUrl = `${api.defaults.baseURL}/uploads/photos/${
            data.photo
          }?t=${Date.now()}`;
          const img = new Image();
          img.onload = () => {
            setPhotoUrl(newUrl); // só atualiza a imagem visível depois que ela de fato carregar
          };
          img.src = newUrl;
        }
      },
      onError: () => {
        alert("Erro ao enviar a foto.");
      },
    });
  };
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFDFF] font-sans flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFDFF] font-sans">
      <main className="max-w-4xl mx-auto mt-10 px-6">
        {/* Perfil Top */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row items-center md:items-start md:justify-between">
          <div className="flex items-center space-x-4 w-full">
            {/* Avatar */}
            <div
              className="relative cursor-pointer group"
              onClick={handlePhotoClick}
            >
              {uploadPhoto.isPending && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-lg z-10">
                  <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {photoUrl || data?.photo ? (
                <img
                  src={
                    photoUrl ||
                    `${api.defaults.baseURL}/uploads/photos/${data?.photo}`
                  }
                  alt="Foto de perfil"
                  className="w-24 h-24 rounded-lg object-cover border border-gray-300"
                />
              ) : (
                <div className="w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-500" />
                </div>
              )}

              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center shadow">
                <Check className="w-4 h-4 text-white" />
              </div>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800">
                {formData.name || "Nome não informado"}
              </h2>
              <p className="text-sm text-gray-500 flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                {user?.email}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.registration && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center">
                    <IdCard className="w-3 h-3 mr-1" />
                    {formData.registration}
                  </span>
                )}
                {formData.unit && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center">
                    <Building className="w-3 h-3 mr-1" />
                    {formData.unit}
                  </span>
                )}
                {formData.ciu && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    CIU: {formData.ciu}
                  </span>
                )}
              </div>
            </div>

            {/* Botão Editar */}
            <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded flex items-center hover:bg-blue-700"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Editar Perfil
              </button>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 bg-white rounded-xl shadow p-6 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nome completo *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                disabled={!isEditing}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded bg-gray-100"
                placeholder="Ex: João Silva Santos"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Matrícula *
              </label>
              <input
                type="text"
                name="registration"
                value={formData.registration}
                disabled={!isEditing}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded bg-gray-100"
                placeholder="Ex: 123456"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Unidade *
              </label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                disabled={!isEditing}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded bg-gray-100"
                placeholder="Ex: Unidade Norte"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                CIU (opcional)
              </label>
              <input
                type="text"
                name="ciu"
                value={formData.ciu}
                disabled={!isEditing}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded bg-gray-100"
                placeholder="Ex: CIU 123"
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 flex items-center"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                disabled={!hasChanges || updateEmitente.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                {updateEmitente.isPending ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          )}
        </form>

        {/* Seção de verificação */}
        <div className="mt-8 bg-white rounded-xl shadow p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-medium text-gray-800">Perfil Verificado</h4>
          <p className="text-sm text-gray-500">
            Suas informações foram verificadas e estão seguras em nosso sistema.
          </p>
        </div>
      </main>
    </div>
  );
}
