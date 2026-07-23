import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ProjectService } from '@/services/projectService';
import { UploadService } from '@/services/uploadService';

import { useImagePreview } from '@/hooks/useImagePreview';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { projectSchema } from '../../../src/schemas/projects.schema';
import type { NewProject, Project } from '@/typings/Projects';

import toast from 'react-hot-toast';

const initialForm: NewProject = {
  liveUrl: '',
  repoUrl: '',
  imageUrl: '',
  translations: [{ language: 'pt', title: '', description: '' }]
};

export function useProjects(options?: { fetchList?: boolean; editId?: string }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(!!options?.fetchList || !!options?.editId);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    imagePreview,
    setImagePreview,
    selectedFile,
    setSelectedFile,
    handleFileChange
  } = useImagePreview();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<NewProject>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialForm
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'translations'
  });

  const loadProjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ProjectService.getAll();
      setProjects(data);
    } catch (error) {
      const err = error as ApiError;
      const errorKey = err.error || err.message;
      setGlobalError(errorKey ? t(errorKey) : t('api.error.unknown'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const loadProjectForEdit = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const data = await ProjectService.getById(id);

      const cleanTranslations = data.translations?.length
        ? data.translations.map((tData) => ({
          language: tData.language,
          title: tData.title,
          description: tData.description
        }))
        : initialForm.translations;

      reset({
        liveUrl: data.liveUrl ?? '',
        repoUrl: data.repoUrl ?? '',
        imageUrl: data.imageUrl ?? '',
        translations: cleanTranslations,
      });

      setImagePreview(data.imageUrl || null);
    } catch (error) {
      const err = error as ApiError;
      const errorKey = err.error || err.message;
      setGlobalError(errorKey ? t(errorKey) : t('api.error.unknown'));
    } finally {
      setLoading(false);
    }
  }, [reset, setImagePreview, t]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (options?.fetchList) loadProjects();

    if (options?.editId) loadProjectForEdit(options.editId);
  }, [options?.fetchList, options?.editId, loadProjects, loadProjectForEdit]);

  const deleteProject = async (id: string) => {
    if (!window.confirm(t('projects.list.confirm_delete', { defaultValue: 'Tem certeza que deseja apagar este projeto?' }))) return;

    try {
      await ProjectService.delete(id);
      setProjects(prev => prev.filter(p => p.id !== id));

      toast.success('Projeto excluido com sucesso');
    } catch (error) {
      const err = error as ApiError;
      console.log(err);
      toast.error('Ocorreu um erro ao excluir o projeto');
    }
  };

  const processFormSubmit = async (data: NewProject, id?: string) => {
    setGlobalError(null);
    try {
      let finalImageUrl = imagePreview || '';

      if (selectedFile) {
        // eslint-disable-next-line react-hooks/purity
        const fileId = id || Date.now().toString();
        finalImageUrl = await UploadService.uploadImage(selectedFile, 'projects', `proj-${fileId}`);
      }

      const payload = { ...data, imageUrl: finalImageUrl };

      if (id) {
        await ProjectService.update(id, payload);
        toast.success('Projeto atualizado com sucesso');
      } else {
        await ProjectService.create(payload);
        toast.success('Projeto criado com sucesso');
      }

      setSelectedFile(null);
      navigate('/projects');
    } catch (error) {
      const err = error as ApiError;

      const errorKey = err.error || err.message;
      setGlobalError(errorKey ? t(errorKey) : t('api.error.unknown'));

      toast.error('Ocorreu um erro ao criar o projeto');
    }
  };

  const createProject = handleSubmit((data) => processFormSubmit(data));
  const updateProject = (id: string) => handleSubmit((data) => processFormSubmit(data, id));

  return {
    projects,
    loading,
    globalError,
    deleteProject,
    createProject,
    updateProject,

    register,
    errors,
    isSubmitting,
    fields,
    appendTranslation: () => append({ language: 'en', title: '', description: '' }),
    removeTranslation: remove,

    imagePreview,
    handleFileChange
  };
}
