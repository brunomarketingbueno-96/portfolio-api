import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { ServiceService } from '@/services/serviceService';

const initialForm: Service = {
  link: '',
  imageUrl: null,
  translations: [{ language: 'pt', title: '', description: '' }]
};

export function useServices(options?: { fetchList?: boolean; editId?: string }) {
  const navigate = useNavigate();

  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState<Service>(initialForm);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(!!options?.fetchList || !!options?.editId);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadServices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ServiceService.getAll();
      console.log("buscando serviços");
      setServices(data);
    } catch (err: any) {
      setError(err.message || "Não foi possível carregar os serviços.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadServiceForEdit = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const data = await ServiceService.getById(id);
      setForm({
        ...initialForm,
        ...data,
      });
      setImagePreview(data.imageUrl || null);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (options?.fetchList) loadServices();
    if (options?.editId) loadServiceForEdit(options.editId);
  }, [options?.fetchList, options?.editId, loadServices, loadServiceForEdit]);

  const deleteService = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja apagar este serviço?")) return;
    try {
      await ServiceService.delete(id);
      setServices(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      alert(err.message || "Erro ao excluir.");
    }
  };

  const getPayload = () => {
    if (!form.translations[0]?.title?.trim()) throw new Error('O título em Português é obrigatório.');

    return {
      link: form.link,
      translations: form.translations,
      imageUrl: imagePreview ?? undefined,
    };
  };

  const createService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await ServiceService.create(getPayload());
      navigate('/services');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateService = async (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await ServiceService.update(id, getPayload());
      navigate('/services');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateTranslation = (index: number, field: keyof ServiceTranslation, value: string) => {
    const newTranslations = [...form.translations];
    newTranslations[index] = { ...newTranslations[index], [field]: value };
    setForm({ ...form, translations: newTranslations });
  };

  const addTranslation = () => {
    setForm({ ...form, translations: [...form.translations, { language: 'en', title: '', description: '' }] });
  };

  const removeTranslation = (index: number) => {
    setForm({ ...form, translations: form.translations.filter((_, i) => i !== index) });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return {
    services, form, setForm, imagePreview, selectedFile, loading, submitting, error,
    deleteService, createService, updateService,
    updateTranslation, addTranslation, removeTranslation, handleFileChange
  };
}
