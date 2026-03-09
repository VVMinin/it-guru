import { Modal, Input, Button, message } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useProductsStore } from '@/entities/product';
import { FormField } from '@/shared/ui/FormField';
import type { AddProductFormValues } from '@/shared/types';

const schema = yup.object({
  title: yup.string().max(50, 'Не более 50 символов').required('Введите наименование'),
  price: yup
    .number()
    .typeError('Введите цену')
    .positive('Цена должна быть больше 0')
    .required('Введите цену'),
  brand: yup.string().max(20, 'Не более 20 символов').default(''),
  sku: yup.string().max(15, 'Не более 15 символов').required('Введите артикул'),
});

interface Props {
  open: boolean;
  onClose: () => void;
}

export const AddProductModal = ({ open, onClose }: Props) => {
  const addLocalProduct = useProductsStore((s) => s.addLocalProduct);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddProductFormValues>({
    resolver: yupResolver(schema),
    defaultValues: { title: '', price: undefined as unknown as number, brand: '', sku: '' },
  });

  const onSubmit = (values: AddProductFormValues) => {
    addLocalProduct({
      id: Date.now(),
      title: values.title,
      price: values.price,
      brand: values.brand?.trim() || '—',
      sku: values.sku,
      description: '',
      category: '',
      discountPercentage: 0,
      rating: 0,
      stock: 0,
      thumbnail: '',
    });

    message.success('Товар добавлен');
    reset();
    onClose();
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      title="Добавить товар"
      open={open}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
        <FormField label="Наименование" error={errors.title}>
          {(id) => (
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id={id}
                  maxLength={50}
                  showCount
                  status={errors.title ? 'error' : undefined}
                  aria-invalid={!!errors.title}
                />
              )}
            />
          )}
        </FormField>

        <FormField label="Цена" error={errors.price}>
          {(id) => (
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <Input
                  id={id}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '').slice(0, 6);
                    field.onChange(raw === '' ? undefined : Number(raw));
                  }}
                  onBlur={field.onBlur}
                  status={errors.price ? 'error' : undefined}
                  aria-invalid={!!errors.price}
                  inputMode="numeric"
                  maxLength={6}
                />
              )}
            />
          )}
        </FormField>

        <FormField label="Вендор" error={errors.brand}>
          {(id) => (
            <Controller
              name="brand"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id={id}
                  maxLength={20}
                  showCount
                  status={errors.brand ? 'error' : undefined}
                  aria-invalid={!!errors.brand}
                />
              )}
            />
          )}
        </FormField>

        <FormField label="Артикул" error={errors.sku}>
          {(id) => (
            <Controller
              name="sku"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id={id}
                  maxLength={15}
                  showCount
                  status={errors.sku ? 'error' : undefined}
                  aria-invalid={!!errors.sku}
                />
              )}
            />
          )}
        </FormField>

        <div className="flex justify-end gap-3 mt-2">
          <Button onClick={handleCancel}>Отмена</Button>
          <Button type="primary" htmlType="submit" disabled={isSubmitting}>
            Добавить
          </Button>
        </div>
      </form>
    </Modal>
  );
};
